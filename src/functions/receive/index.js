require('dotenv').config();

// Function for sending facebook DMs

const config = {
  oauth: {
    validation_token: process.env.FACEBOOK_VALIDATION_TOKEN,
    page_access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  },
  app: {
    default_lang: process.env.DEFAULT_LANGUAGE,
    facebook_endpoint: 'https://graph.facebook.com/v2.6/me/messages',
    map_endpoint: process.env.MAPSERVER,
  },
  server: {
    card_endpoint: process.env.FRONTEND_CARD_PATH,
    card_api: 'https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards',
    api_key: process.env.SERVER_API_KEY,
  },
};

  const response = {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({}),
  };

  const tokenError = {
    statusCode: 500,
    headers: {},
    body: JSON.stringify({'Message': 'Invalid token'}),
  };

  /*
  const error = {
    statusCode: 500,
    headers: {},
    body: JSON.stringify({'Message': 'Server error'}),
  };*/

  export default (event, context, callback) => {
    console.log('Lambda handler loading');
    console.log('Event', event);
    console.log('Method', event.httpMethod);
    if (event.httpMethod === 'GET') {
      console.log('GET request, indicates possible Facebook validation');
      if (event.queryStringParameters['hub.verify_token'] ===
        process.env.FACEBOOK_VALIDATION_TOKEN && 
        event.queryStringParameters['hub.challenge']) {
       return callback(null, response);
      } else {
        return callback(null, tokenError);
      }
    } else if (event.httpMethod === 'POST') {
      console.log(event.body);
      console.log(config);
      callback(null, response);
        /* facebook.sendReply(event.body)
          .then((data) => callback(null, response))
          .catch((err) => {
            console.log('Error in request: ' + err.message);
            callback(null, error);
          });*/
    }
  };
