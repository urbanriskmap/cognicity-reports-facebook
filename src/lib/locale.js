import axios from 'axios';
/**
 * Class for getting Facebook user's locale
 * @class Locale
 * @param {Object} config - Facebook class parameters
 **/
export default class Locale {
    /**
     * constructor for class Locale
     * @param {Object} config - telegram parameters
     */
    constructor(config) {
      this.config = config;
      this.axios = axios;
    }

    /**
     * Get a users locale by ID
     * @method get
     * @param {String} userId - userId
     * @return {Promise} - response of locale request
     */
    get(userId) {
        return new Promise((resolve, reject) => {
            const request = 'https://graph.facebook.com/v4.0/' +
                userId + '?fields=locale' + '&access_token=' +
                this.config.FACEBOOK_PAGE_ACCESS_TOKEN;
            this.axios.get(request)
                .then((res) => {
                    resolve(res.data.locale.split('_')[0]);
                })
                .catch((err) => {
                    console.log('Error getting user locale.' + err.message);
                    console.log(err);
                    resolve(this.config.DEFAULT_LANGUAGE);
                });
        });
    }
}
