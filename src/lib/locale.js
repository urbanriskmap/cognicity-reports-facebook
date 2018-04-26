import axios from 'axios';
import config from '../config';
/**
 * Class for getting Facebook user's locale
 * @class Locale
 * @param {Object} config - Facebook class parameters
 **/
export default class Locale {
    /**
     * constructor for class Telegram
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
     */
    get(userId) {
        const request = 'https://graph.facebook.com/v2.6/' + userId + '?fields=locale' + '&access_token=' + config.FACEBOOK_PAGE_ACCESS_TOKEN;
        this.axios.get(request)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }
}
