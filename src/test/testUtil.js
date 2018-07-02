process.env.FACEBOOK_APP_SECRET = 'lego';

import * as test from 'unit.js';
import util from '../lib/util';


/**
 * Facebook library function testing harness
 */
export default function() {
  describe('Util library testing', function() {
    it('Can create SHA1 hash', function(done) {
        test.value(util.sha1('secret', 'test'))
        .is('sha1=1aa349585ed7ecbd3b9c486a30067e395ca4b356');
      done();
    });
    it('Can safely compare SHA1 hashes', function(done) {
      test.value(util.compareSignatures(
        'sha1=1aa349585ed7ecbd3b9c486a30067e395ca4b356',
        'sha1=1aa349585ed7ecbd3b9c486a30067e395ca4b356'))
        .is(true);
        done();
    });
    it('Can catch non-matching SHA1 hashes', function(done) {
      test.value(util.compareSignatures(
        'sha1=1aa349585ed7ecbd3b9c486a30067e395ca4b356',
        'sha1=1aa349585ed7ecbd3b9c486a30067e395ca4b357'))
        .is(false);
        done();
    });
  });
}
