import request from 'request';

/**
 * Facebook object for direct message interactions
 * @param {Object} config - Facebook parameters
 * @return {Object} Function methods
 */
export default function(config) {
  let methods = {};

  /**
   * Prepares Facebook message request object
   * @function _prepareRequest
   * @param {Object} body - message body object
   * @return {Object} - Facebook message request object
   */
  methods._prepareRequest = function(body) {
    let requestOptions = {
      uri: config.app.facebook_endpoint,
      qs: {
        access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
      },
      method: 'POST',
      headers: {
        'x-api-key': config.server.api_key,
        'content-type': 'application/json',
      },
      json: true,
      body: body,
    };
    // Log the message
    // console.log('Outgoing DMessage object: ' + JSON.stringify(body));
    return requestOptions;
  };

  /**
   * Send direct Facebook message
   * @function sendMessage
   * @param {Object} body - Facebook direct message body object
   * @return {Object} - Response object from Facebook
   */
  methods.sendMessage = (body) => new Promise((resolve, reject) => {
    let opts = methods._prepareRequest(body);
    // Send the message
    request.post(opts, function(error, response, body) {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
return methods;
}
