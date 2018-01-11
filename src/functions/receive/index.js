require('dotenv').config();

// Function for sending facebook DMs
import facebook from '../../lib/facebook/';
import receive from './receive';

const config = {
  oauth: {
    validation_token: process.env.FACEBOOK_VALIDATION_TOKEN,
    page_access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  },
  app: {
    default_lang: process.env.DEFAULT_LANG,
    facebook_endpoint: 'https://graph.facebook.com/v2.6/me/messages',
    map_endpoint: process.env.MAPSERVER,
  },
  server: {
    card_endpoint: process.env.FRONTEND_CARD_PATH,
    card_api: 'https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards',
    api_key: process.env.SERVER_API_KEY,
  },
};

/**
 * Webhook handler for incoming Facebook DMs
 * @function facebookDMWebhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
module.exports.facebookDMWebhook = (event, context, callback) => {
  if (event.method === 'GET') {
    if (event.query['hub.verify_token'] === 
      process.env.FACEBOOK_VALIDATION_TOKEN && event.query['hub.challenge']) {
      return callback(null, parseInt(event.query['hub.challenge']));
    } else {
      return callback('Invalid token');
    }
  } else if (event.method === 'POST') {
    receive(config).process(event)
      .then(callback(null))
      .catch((err) => {
        console.log('error is here in post: ' + err);
        callback(null);
      });
    }
  };
