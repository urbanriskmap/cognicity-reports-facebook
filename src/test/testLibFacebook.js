import * as test from 'unit.js';
import facebook from '../lib/facebook/';


const msg = {
  messaging_type: 'RESPONSE',
  recipient: {
        id: undefined,
    },
  message: {
        text: `RiskMap bot helps you report flooding in realtime. `
        + `Send /flood to report. In life-threatening situations always `
        + `call 911.`,
    },
};

/**
 * Facebook library function testing harness
 * @param {Object} config - configuration object
 **/
export default function(config) {
  /**
   * lib/facebook testing harness
   */
  describe('lib/facebook Testing', function() {
    it('Process a proper Facebook request object', function(done) {
      let requestOptions = facebook(config)._prepareRequest(msg);
      // console.log(facebook(config).config);
      test.value(requestOptions.body).is(msg);
      test.value(requestOptions.json).is(true);
      test.value(requestOptions.headers)
        .is({'x-api-key': 'x', 'content-type': 'application/json'});
      done();
    });

   it('Can\'t issue facebook post, catch error', function(done) {
     facebook(config).sendMessage(msg)
     .catch((err) => {
       test.value(err.code).is(`ECONNREFUSED`);
       done();
     });
    });
 });
}
