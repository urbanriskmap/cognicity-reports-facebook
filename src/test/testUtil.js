import * as test from 'unit.js';
import util from '../lib/util';

/**
 * Facebook library function testing harness
 */
export default function() {
  describe('Util library testing', function() {
    it('Can create SHA256', function(done) {
      test.value(util.sha256('test'))
        .is('Aymga2LNFrM+tnkr6MYLFY2Jou46h2/Omogeu0iMCRQ=');
      done();
    });
  });
}
