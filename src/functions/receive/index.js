import config from '../../config';
import Facebook from '../../lib/facebook';

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


  const errorResponse = {
    statusCode: 500,
    headers: {},
    body: JSON.stringify({'Message': 'Server error'}),
  };

  export default (event, context, callback) => {
    console.log('Lambda handler loading');
    console.log('Event', event);
    console.log('Method', event.httpMethod);
    if (event.httpMethod === 'GET') {
      console.log('GET request, indicates possible Facebook validation');
      if (event.queryStringParameters['hub.verify_token'] ===
        process.env.FACEBOOK_VALIDATION_TOKEN &&
        event.queryStringParameters['hub.challenge']) {
          let tokenResponse = {
            statusCode: 200,
            headers: {},
            body: event.queryStringParameters['hub.challenge'],
          };
       return callback(null, tokenResponse);
      } else {
        return callback(null, tokenError);
      }
    } else if (event.httpMethod === 'POST') {
      const facebook = new Facebook(config);


      console.log(event.body);
      console.log(config);
      callback(null, response);
      const payload = JSON.parse(event.body);
      facebook.sendReply(payload.entry[0].messaging[0])
        .then((data) => callback(null, response))
        .catch((err) => {
          console.log('Error in request: ' + err.message);
          callback(null, errorResponse);
        });
    }
  };
