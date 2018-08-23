import * as test from 'unit.js';

import Facebook from '../lib/facebook';
import config from '../config';

/**
 * Facebook library function testing harness
 */
export default function() {
  describe('Facebook bot testing', function() {
    const facebook = new Facebook(config);
    const oldFacebookBot = facebook.bot;
    const oldAxios = facebook.axios;
    const oldLocale = facebook.locale;
    let axiosError = false;
    let botError = false;
    let localeError = false;

    before(function() {
      const mockThanks = function(properties) {
        return new Promise((resolve, reject) => {
          if (botError === false) {
            resolve({text: 'mocked thanks message', link: ' link'});
          } else {
            reject(new Error(`bot error`));
          }
        });
      };

      const mockCard = function(properties) {
        return new Promise((resolve, reject) => {
          if (botError === false) {
            resolve(
              {
                text: 'mocked card message',
                link: ' card',
                prepLink: ' prep Card',
                assessmentLink: ' assessment Card',
              }
            );
          } else {
            reject(new Error(`bot error`));
          }
        });
      };

      const mockAxios = function(properties, body) {
        return new Promise((resolve, reject) => {
          if (axiosError === false) {
            resolve({props: properties, body: body});
          } else {
            reject(new Error(`Axios error`));
          }
        });
      };

      const mockLocale = function(properties, body) {
        return new Promise((resolve, reject) => {
          if (localeError === false) {
            resolve('id');
          } else {
            resolve(config.DEFAULT_LANGUAGE);
          }
        });
      };

      facebook.bot = {
        card: mockCard,
        thanks: mockThanks,
      };

      facebook.axios = {
        post: mockAxios,
      };

      facebook.locale = {
        get: mockLocale,
      };
    });

    it('Creates class', function(done) {
      test.value(facebook instanceof Facebook).is(true);
      done();
    });

    it('Can get thanks messsage', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'jbd',
        reportId: '1',
        userId: '1',
      };
      facebook.sendThanks(body)
        .then((res) => {
          test.value(res.props).is('https://graph.facebook.com/v2.6/me/messages/?access_token='+config.FACEBOOK_PAGE_ACCESS_TOKEN);
          test.value(res.body.recipient.id).is('1');
          test.value(res.body.message.attachment.payload.text)
              .contains('mocked thanks message');
          done();
        }).catch((err) => console.log(err));
    });

    it('Can catch bot error with thanks messsage', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'jbd',
        reportId: '1',
        userId: '1',
      };
      botError = true;
      facebook.sendThanks(body)
        .catch((err) => {
          test.value(err.message).is('bot error');
          botError = false;
          done();
        }).catch((err) => {
          console.error(err);
          test.value(false).is(true); // make sure test fails
        });
    });

    it('Can get a card with a null instance region', function(done) {
        const body = {
          language: 'en',
          instanceRegionCode: 'null',
          reportId: '1',
          userId: '1',
        };
        botError = false;
        facebook.sendThanks(body)
          .then((res) => {
            // the first element should be the flood card
            test.value(
                res.body.message.attachment.payload.buttons[0].url)
                .is(' card');
            botError = false;
            done();
          }).catch((err) => {
            console.error(err);
            test.value(false).is(true); // make sure test fails
          });
      });

    it('Can get a prep card', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'null',
        reportId: '1',
        userId: '1',
      };
      botError = false;
      facebook.config.CARDS_DECK.push('prep');
      facebook.sendThanks(body)
        .then((res) => {
          // the second element should be the prep card
          test.value(
            res.body.message.attachment.payload.buttons[1].url)
            .is(' prep Card');
          botError = false;
          done();
        }).catch((err) => {
          console.error(err);
          test.value(false).is(true); // make sure test fails
        });
    });

    it('Can get card message', function(done) {
      const payload = {
          'object': 'page',
          'entry': [
              {
                'id': '1',
                'time': 1524684657816,
                'messaging': [
                    {
                        'sender': {'id': '1'},
                        'recipient': {'id': '2'},
                        'timestamp': 1524684657462,
                        'message': {
                            'mid': 'mid.123', 'seq': 3068, 'text': '/flood',
                        },
                    },
                ],
            },
        ]};

      facebook.sendReply(payload.entry[0].messaging[0])
        .then((res) => {
            test.value(res.props).is('https://graph.facebook.com/v2.6/me/messages/?access_token=' +
                config.FACEBOOK_PAGE_ACCESS_TOKEN);
            test.value(res.body.recipient.id).is('1');
            test.value(res.body.message.attachment.payload.text)
                .contains('mocked card message');
          done();
        });
    });
    it('Can catch null input from Facebook', function(done) {
        const payload = {
            'object': 'page',
            'entry': [
                {
                  'id': '1',
                  'time': 1524684657816,
                  'messaging': [
                      {
                          'sender': {'id': '1'},
                          'recipient': {'id': '2'},
                          'timestamp': 1524684657462,
                          'message': {
                              'mid': 'mid.123', 'seq': 3068, 'text': null,
                          },
                      },
                  ],
              },
          ]};

        facebook.sendReply(payload.entry[0].messaging[0])
          .then((res) => {
            test.value(res.props).is('https://graph.facebook.com/v2.6/me/messages/?access_token=' +
                config.FACEBOOK_PAGE_ACCESS_TOKEN);
            test.value(res.body.recipient.id).is('1');
            test.value(res.body.message.attachment.payload.text)
                .contains('mocked card message');
            done();
          });
      });

    it('Can get card message from Facebook button submission', function(done) {
        const payload = {
            'object': 'page',
            'entry': [
                {
                    'id': '1',
                    'time': 1524684657816,
                    'messaging': [
                        {
                            'sender': {'id': '1'},
                            'recipient': {'id': '2'},
                            'timestamp': 1524684657462,
                            'postback': {
                                'payload': '/flood',
                                'title': 'Report flooding',
                            },
                        },
                    ],
                },
            ]};

        facebook.sendReply(payload.entry[0].messaging[0])
            .then((res) => {
            test.value(res.props).is('https://graph.facebook.com/v2.6/me/messages/?access_token=' +
                config.FACEBOOK_PAGE_ACCESS_TOKEN);
                test.value(res.body.recipient.id).is('1');
                test.value(res.body.message.attachment.payload.text)
                    .contains('mocked card message');
            done();
            });
        });

    it('Can catch null input from Facebook button submission', function(done) {
        const payload = {
            'object': 'page',
            'entry': [
                {
                    'id': '1',
                    'time': 1524684657816,
                    'messaging': [
                        {
                            'sender': {'id': '1'},
                            'recipient': {'id': '2'},
                            'timestamp': 1524684657462,
                            'postback': {
                                'payload': null,
                                'title': 'Report flooding',
                            },
                        },
                    ],
                },
            ]};

        facebook.sendReply(payload.entry[0].messaging[0])
            .then((res) => {
            test.value(res.props).is('https://graph.facebook.com/v2.6/me/messages/?access_token=' +
                config.FACEBOOK_PAGE_ACCESS_TOKEN);
            test.value(res.props).is('https://graph.facebook.com/v2.6/me/messages/?access_token=' +
                config.FACEBOOK_PAGE_ACCESS_TOKEN);
            test.value(res.body.recipient.id).is('1');
            test.value(res.body.message.attachment.payload.text)
                .contains('mocked card message');
            done();
            });
        });


    it('Can handle axios error geting card message', function(done) {
        const payload = {
            'object': 'page',
            'entry': [
                {
                  'id': '1',
                  'time': 1524684657816,
                  'messaging': [
                      {
                          'sender': {'id': '1'},
                          'recipient': {'id': '2'},
                          'timestamp': 1524684657462,
                          'message': {
                              'mid': 'mid.123', 'seq': 3068, 'text': '/flood',
                          },
                      },
                  ],
              },
          ]};
      axiosError = true;
      facebook.sendReply(payload.entry[0].messaging[0])
        .catch((err) => {
          test.value(err.message).is('Axios error');
          axiosError = false;
          done();
        });
    });

    it('Can catch error getting card messsage', function(done) {
        const payload = {
            'object': 'page',
            'entry': [
                {
                  'id': '1',
                  'time': 1524684657816,
                  'messaging': [
                      {
                          'sender': {'id': '1'},
                          'recipient': {'id': '2'},
                          'timestamp': 1524684657462,
                          'message': {
                              'mid': 'mid.123', 'seq': 3068, 'text': '/flood',
                          },
                      },
                  ],
              },
          ]};
      botError = true;
      facebook.sendReply(payload.entry[0].messaging[0])
        .catch((err) => {
          test.value(err.message).is('bot error');
          done();
        });
    });


    after(function() {
      facebook.bot = oldFacebookBot;
      facebook.axios = oldAxios;
      facebook.locale = oldLocale;
    });
  });
}
