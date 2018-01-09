import facebook from '../../lib/facebook';
import messages from '../../lib/facebook/messages';
import cards from '../../lib/cards/';

const starterPayload = 'GET_STARTED_PAYLOAD';
const reportButtons = {'flood', 'prep'};

/**
 * Receive object for incoming Facebook direct message interactions
 * @param {Object} config - facebook parameters
 * @return {Object} Function methods
 **/
export default function(config) {
  let methods = {};
  /**
    * Issues defaul reply message to user
    * @function _sendDefault
    * @param {Number} userId - Facebook user ID
    * @return {Object} - Promise that message issued
    */
  methods._sendDefault = (userId) => new Promise((resolve, reject) => {
    request({
      uri: 'https://graph.facebook.com/v2.6/' + userId + '?fields=locale' +
      '&access_token=' + process.env.PAGE_ACCESS_TOKEN,
      method: 'GET',
    }, function(error, response, body) {
      if (!error && response.statuscode == 200) {
        var [userLang, userRegion] = body.locale.split('_');

        if (userRegion == 'IN') {
          userLang = 'en';
        }

        facebook(config).sendMessage(messages(config).default(
          userLang, userId))
          .then((response) => resolve(response))
          .catch((err) => { 
            reject(new Error('Error sending message, response '
                    + 'from Facebook was: ' + err));
          });
      } else {
        var err = 'Failed calling Profile API for user: ' + userId + 
                    JSON.stringify(error) + JSON.stringify(response);
        console.error(err);
      }
    });
  });

  /**
    * Issues card reply message to user
    * @function _sendCard
    * @param {Number} userId - Facebook user ID
    * @return {Object} - Promise that message issued
    */
  methods._sendCard = (userId, payload) => new Promise((resolve, reject) => {
    cards(config).getCardLink(userId.toString(), 'facebook',
      config.app.default_lang)
      .then((cardId) => {
          // Send message with card link
          facebook(config).sendMessage(messages(config).card(lang, userId, 
                                                             cardId))
            .catch((err) => {
              reject(new Error('Error sending message, response '
            + 'from Facebook was: ' + err));
          });
      })
      .catch((err) => {
        reject(err);
      });
  });

  /**
    * Fetches the user's locale from Facebook using Profile API. Returns user's
    *   language and country codes.
    * @function _getLocale
    * @param {Object} userId - Facebook user ID
    * @return {Object} // TODO
    */
  methods._getLocale = (userId) => new Promise((resolve, reject) => {
    request({
      uri: 'https://graph.facebook.com/v2.6/' + userId + '?fields=locale' +
           '&access_token=' + process.env.PAGE_ACCESS_TOKEN,
      method: 'GET',
    }, function(error, response, body) {
      if (!error && statuscode === 200) {
        let [userLang, userRegion] = body.locale.split('_');
        if (userRegion == 'IN') {
          userLang = 'en';
        }
        callback(userLang); // Return user's locale
        callback(userRegion);
      }
    });
  });

  /**
    * Process incoming message event and issue reply message if required
    * @function process
    * @param {Object} event - Event object
    * @return {Object} - Promise that all messages issued
    */
  methods.process = (event) => new Promise((resolve, reject) => {
    let replies = []; // Array of replies for this event
    // loop through message events
    event.entry.messaging.forEach(function(messageEvent) {
      if (messageEvent.postback && messageEvent.postback.payload &&
          messageEvent.sender.id !== messageEvent.recipient.id) {
        
        let userId = messageEvent.sender.id;
        let lang = process.env.default_lang;
        let payload = messageEvent.postback.payload;

        if (payload === getStarted) {
          replies.push(methods._sendDefault(userId));
          break;
        } else if (payload in reportButtons) {
          replies.push(methods._sendCard(userId, payload));
          break;
        } else {
          // TODO: set an error here
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
