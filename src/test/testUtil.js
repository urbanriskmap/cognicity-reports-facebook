import * as test from 'unit.js';
import util from '../lib/util';

/**
 * Facebook library function testing harness
 */
export default function() {
  describe('Util library testing', function() {
    it('Can create SHA1', function(done) {
        test.value(typeof(util.sha1('test'))).is('string');
      /* test.value(util.sha1('test'))
        .is('GqNJWF7X7L07nEhqMAZ+OVyks1Y=');*/
      done();
    });
  });
}
