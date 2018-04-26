// Set a Facebook bot greeting
// Run: npx babel-node commands/setGreeting.js
import axios from 'axios';
require('dotenv').config();
import config from '../src/config';
const body = {
    "greeting":[
        {
          "locale":"default",
          "text":"Hello {{user_first_name}}. RiskMap bot helps you report and view flooding in real time."
        }, {
          "locale":"en_US",
          "text":"Hello {{user_first_name}}. RiskMap bot helps you report and view flooding in real time."
        }
      ] 
}


axios.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + config.FACEBOOK_PAGE_ACCESS_TOKEN, body)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));