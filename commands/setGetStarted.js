// Set a Facebook bot get started message
// Run: npx babel-node commands/setGetStarted.js
import axios from 'axios';
require('dotenv').config();
import config from '../src/config';
const messages = require('../src/lib/messages-' +
      config.DEFAULT_INSTANCE_COUNTRY_CODE +
      '.json');

const body = {
    "get_started":
        {
            "payload": "Get Started"
        }
}

axios.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + config.FACEBOOK_PAGE_ACCESS_TOKEN, body)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));