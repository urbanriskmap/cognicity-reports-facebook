import * as test from 'unit.js';

import Locale from '../lib/locale';
import config from '../config';

/**
 * Facebook library function testing harness
 */
export default function() {
  describe('Facebook locale class testing', function() {
    const locale = new Locale(config);
    const oldAxios = locale.axios;
    let axiosError = false;

    before(function() {
        const mockAxios = function(properties) {
            return new Promise((resolve, reject) => {
                if (axiosError === false) {
                resolve({data: {locale: 'id'}});
                } else {
                reject(new Error(`Axios error`));
                }
            });
        };

        locale.axios = {
            get: mockAxios,
        };
    });

    it('Creates class', function(done) {
        test.value(locale instanceof Locale).is(true);
        done();
    });

    it('Gets mocked locale', function(done) {
        locale.get(1)
            .then((res) => {
                test.value(res).is('id');
                done();
            });
    });

    it('Gets default locale', function(done) {
        axiosError = true;
        locale.get(1)
            .then((res) => {
                test.value(res).is(config.DEFAULT_LANGUAGE);
                done();
            });
    });


    after(function() {
      locale.axios = oldAxios;
    });
  });
}
