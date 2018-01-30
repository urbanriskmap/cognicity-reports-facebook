import * as test from 'unit.js';

import receive from '../functions/receive/receive';

// TODO: test button postbacks

let testMsg = {
  'id': 'me',
  'time': 1458692752479,
  'messaging': [
    {
      'sender': {
        'id': '1',
      },
      'recipient': {
        'id': 'me',
      },
      'timestamp': 1458692752478,
      'postback': {
        'title': 'Report flood',
        'payload': 'flood',
      },
    },
  ],
};

let responseMsg = {
  'locale': 'en_US',
};

let indiaMsg = {
  'locale': ''
}


/**
 * Facebook library function testing harness
 * @param {Object} config - configuration object
 */
export default function(config) {
  describe('receive/get Testing', function() {
    it('Can execute send of default message, catches error', function(done) {
      receive(config)._sendDefault('en', 'US', 1)
      .catch((err) => {
        test.value(err.message).is('Error sending message, response from '
          + 'Facebook was: Error: connect ECONNREFUSED 127.0.0.1:80');
        done();
      });
    });
    it('Can execute send of card message', function(done) {
      receive(config)._sendCard('en', 'US', 1)
      .catch((err) => {
        test.value(err.message).is('Could not request card. Error was: '
          + 'connect ECONNREFUSED 127.0.0.1:80');
        done();
      });
    });
    it('Catches errors in process loop', function(done) {
      receive(config).process(testMsg)
      .then(() => done())
      .catch((err) => {
        test.value(err.message).is('Failed calling Profile API, response from '
          + 'Facebook was: Invalid OAuth access token.');
        done();
      });
    });
    it('Process default message and catch error', function(done) {
      receive(config).process(responseMsg)
      .then(() => done())
      .catch((err) => {
        test.value(err.message).is('Error sending message, response from '
          + 'Facebook was: Invalid OAuth access token.');
        done();
      });
    });
  });
}
