// Set a Facebook bot get started message
// Run: npx babel-node commands/setGetStarted.js
import axios from 'axios';
require('dotenv').config();
import config from '../src/config';
import messages from '../src/lib/messages';

const body = {
    "get_started":
        {
            "payload": "Get Started"
        }
}

axios.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + config.FACEBOOK_PAGE_ACCESS_TOKEN, body)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));