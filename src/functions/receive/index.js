import config from '../../config';
import Facebook from '../../lib/facebook';
import util from '../../lib/util';

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
      console.log('POST request, indicates user input');

      // Respond immediately to webhook
      callback(null, response);

      // Verify signature
      const hash = util.sha1(config.FACEBOOK_APP_SECRET, event.body);
      const signed = util.compareSignatures(hash,
        event.headers['X-Hub-Signature']);

      if (signed === true) {
        console.log('Request signature verified');
        // Create bot instance
        const facebook = new Facebook(config);
        const payload = JSON.parse(event.body);
        console.log(JSON.stringify(event));

        console.log('payload', payload);


        facebook.sendReply(payload.entry[0].messaging[0])
          .then((data) => callback(null, response))
          .catch((err) => {
            console.log('Error in request: ' + err.message);
            callback(null, errorResponse);
          });
        } else {
          console.log('Request signature did not match');
          callback(null, 403, {});
        }
    }
  };
