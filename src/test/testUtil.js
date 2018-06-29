import * as test from 'unit.js';
import util from '../lib/util';

/**
 * Facebook library function testing harness
 */
export default function() {
  describe('Util library testing', function() {
    it('Can create SHA256', function(done) {
      test.value(util.sha256('test'))
        .is('veLa46vNONQQ0kF0MNkCmAd7Hoplu4ESdEHgQTy0kwU=');
      done();
    });
  });
}
