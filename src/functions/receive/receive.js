import facebook from '../../lib/facebook';
import messages from '../../lib/facebook/messages';
import cards from '../../lib/cards/';
import request from 'request';

const starterPayload = 'GET_STARTED_PAYLOAD';
const reportButtons = ['flood', 'prep'];

/**
 * Receive object for incoming Facebook direct message interactions
 * @param {Object} config - facebook parameters
 * @return {Object} Function methods
 **/
export default function(config) {
  let methods = {};
  /**
    * Issues default message to user
    * @function _sendDefault
    * @param {Object} lang - Facebook user language
    * @param {Object} locale - Facebook user locale
    * @param {Number} userId - Facebook user ID
    * @return {Object} - Promise that message issued
    */
  methods._sendDefault = (lang, locale, userId) =>
                          new Promise((resolve, reject) => {
    facebook(config).sendMessage(messages(config).default(
      lang, locale, userId))
      .then((response) => resolve(response))
      .catch((err) => {
        reject(new Error('Error sending message, response from Facebook was: '
                          + err));
    });
  });
  /**
    * Issues card reply message to user
    * @function _sendCard
    * @param {Object} lang - Facebook user language
    * @param {Number} locale - Facebook user locale
    * @param {Object} userId - Facebook user ID
    * @return {Object} - Promise that message issued
    */
  methods._sendCard = (lang, locale, userId) =>
                                    new Promise((resolve, reject) => {
    cards(config).getCardLink(userId.toString(), 'facebook', lang)
      .then((cardId) => {
        // Send message with card link
        facebook(config).sendMessage(messages(config).card(lang, locale, userId,
                                                           cardId))
          .catch((err) => {
            reject(new Error('Error sending message, response '
                              + 'from Facebook was: ' + err));
        });
      }).catch((err) => {
          reject(err);
      });
  });
  /**
    * Process response from Facebook for user locale.
    * @function _processResponse
    * @param {Object} error - null
    * @param {Object} response - Request response object or null
    * @param {Object} body - Request body object or null
    * @return {Object} location - array containing user location string
    **/
  methods._processResponse = (error, response, body) =>
                                      new Promise((resolve, reject) => {
      if (!error && response && body && !response.statusCode) {
        let location = JSON.parse(body).locale.split('_');
        if (location[1] === 'IN') {
          location[0] = 'en';
        }
        return location;
      } else if (body) {
        return new Error('Failed calling Profile API, response from '
                          + 'Facebook was: ' + JSON.parse(body).error.message);
      } else {
        return new Error('Could not fetch location. Request malformed '
                         +'or user profile permission not acquired.');
      }
    });
  /**
    * Fetches the user's locale from Facebook using Profile API. Returns user's
    *   language and country cod
    * @function _getLocale
    * @param {Object} userId - Facebook user ID
    * @return {Object} array of user language and Facebook region
    */
  methods._getLocation = (userId) => new Promise((resolve, reject) => {
    request({
      uri: 'https://graph.facebook.com/v2.6/'+ userId
      + '?fields=locale&access_token=' + process.env.PAGE_ACCESS_TOKEN,
    }, function(error, response, body) {
      // Process response
      methods._processResponse(error, response, body)
        .then((location) => resolve(location))
        .catch((err) => {
          reject(err);
        });
    });
  });
  /**
    * Process incoming message event and issue reply message if required
    * @function proces
    * @param {Object} event - Event object
    * @return {Object} - Promise that all messages issued
    */
  methods.process = (event) => new Promise((resolve, reject) => {
    let replies = []; // Array of replies for this event
    // loop through message events
    // Check the structure for this and for our SNS messages

    event.messaging.forEach(function(messageEvent) {
      if (messageEvent.postback && messageEvent.postback.payload &&
          messageEvent.sender.id !== messageEvent.recipient.id) {
        let userId = messageEvent.sender.id;
        let location = methods._getLocation(userId);
        let lang = location[0];
        let locale = location[1];
        let payload = messageEvent.postback.payload;

        if (payload === starterPayload) {
          replies.push(methods._sendDefault(lang, locale, userId));
        } else if (payload in reportButtons) {
          replies.push(methods._sendCard(lang, locale, userId));
        }
      }
    });
    Promise.all(replies).then((values) => {
      resolve(values);
    }).catch((err) => {
      reject(err);
    });
  });
  return methods;
}
