import * as test from 'unit.js';

import messages from '../lib/facebook/messages';

let expectedMsgIN = {
  messaging_type: 'RESPONSE',
  recipient: {
    id: '123',
  },
  message: {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'Hi! RiskMap bot helps you report flooding in real-time. '
          + 'In life-threatening situations always call 911.',
        buttons: [
          {
            type: 'postback',
            title: 'Report flood',
            payload: 'flood',
          },
          {
            type: 'postback',
            title: 'Monsoon preparations',
            payload: 'prep',
          },
        ],
      },
    },
  },
};

let expectedMsgUS = {
  messaging_type: 'RESPONSE',
  recipient: {
    id: '123',
  },
  message: {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'Hi! RiskMap bot helps you report flooding in real-time. '
          + 'In life-threatening situations always call 911.',
        buttons: [
          {
            type: 'postback',
            title: 'Report flood',
            payload: 'flood',
          },
          {
            type: 'postback',
            title: 'Hurricane preparations',
            payload: 'prep',
          },
        ],
      },
    },
  },
};

/**
 * Facebook library function testing harness
 * @param {Object} config - configuration object
 **/
export default function(config) {
  describe('lib/facebook Message testing', function() {
    it('Get the default response', function(done) {
      let msg = messages(config).default('en', 'IN', '123');
      test.value(msg).is(expectedMsgIN);
      done();
    });
    it('Get the default response if unknown language supplied', function(done) {
      let msg = messages(config).default('zz', 'ZZ', '123');
      test.value(msg).is(expectedMsgUS);
      done();
    });
    it('Get the confirmation response with report id', function(done) {
      let msg = messages(config).card('en', 'US', '123', '1');
      test.value(msg.message.attachment.payload.text)
        .is('Send your report using this one-time link:');
      test.value(msg.message.attachment.payload.buttons[0].title)
        .is('RiskMap.us');
      test.value(msg.message.attachment.payload.buttons[0].url)
        .is('https://cards.riskmap.us/flood/1');
      test.value(msg.recipient.id).is(`123`);
      done();
    });
    it('Get the thanks message with report id', function(done) {
      let msg = messages(config).thanks('en', 'US', '123', '1');
      test.value(msg.message.text)
        .is('Thanks for your report. You can access it using this link: '
          + 'https://riskmap.us/map/broward/1');
      test.value(msg.recipient.id).is(`123`);
      done();
    });
  });
}
