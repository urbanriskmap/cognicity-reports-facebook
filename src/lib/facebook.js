import axios from 'axios';
import Bot from '@urbanriskmap/cognicity-bot-core';
import messages from './messages.json';

/**
 * Class for sending CogniCity messages via Facebook
 * @class Facebook
 * @param {Object} config - facebook parameters
 * @return {Object} Function methods
 **/
export default class Facebook {
  /**
   * constructor for class Facebook
   * @param {Object} config - facebook parameters
   */
  constructor(config) {
    this.config = config;
    this.config.MESSAGES = messages;
    this.bot = new Bot(this.config);
    this.axios = axios;
  }

  /**
   * Method to filter text by keyword
   * @method _classify
   * @private
   * @param {String} text - message from user
   * @return {String} - keyword or null
   */
  _classify(text) {
    // filter the message by keyword
    const re = new RegExp(/\/flood/gi);
    if (re.exec(text) !== null) {
      return 'flood';
    } else {
      return null;
    }
  }

  /**
    * Prepares Telegram message request object
    * @method _prepareRequest
    * @private
    * @param {String} userId - User or Telegram chat ID for reply
    * @param {String} messageText - Message to send
    * @return {Object} - Request object
  **/
  _prepareRequest(userId, messageText) {
    const body = {
      recipient: {
        id: userId,
      },
      message: {
        'attachment': {
          'type': 'template',
          'payload': {
            'text': 'hello world',
        },
      },
    },
    };

    const request = this.config.FACEBOOK_ENDPOINT +
      '/?access_token=' +
      this.config.FACEBOOK_PAGE_ACCESS_TOKEN;


    return ({request: request, body: body});
  }

    /**
    * Prepares default Facebook message request object
    * @method _prepareDefaultResponse
    * @private
    * @param {Object} properties - Properties.request
    * @param {String} properties.userId - User or Telegram chat ID for reply
    * @param {String} properties.messageText - Message to send
    * @return {Object} - Request object
  **/
  _prepareDefaultResponse(properties) {
    const body = {
      recipient: {
        id: properties.userId,
      },
      message: {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'button',
            'text': properties.messageText,
            'buttons': [
              {
                'type': 'postback',
                'title': 'Report flooding',
                'payload': '/flood',
              },
              {
                'type': 'web_url',
                'url': 'https://riskmap.us/broward',
                'title': 'View live reports',
              },
            ],
          },
        },
      },
    };

    const request = this.config.FACEBOOK_ENDPOINT +
      '/?access_token=' +
      this.config.FACEBOOK_PAGE_ACCESS_TOKEN;

    return ({request: request, body: body});
  }

  /**
    * Send Facebook message
    * @method _sendMessage
    * @private
    * @param {Object} properties - Properties of request
    * @param {String} request - Request string
    * @param {Object} body - Request body
    * @return {Promise} - Result of request
  **/
  _sendMessage(properties) {
    return new Promise((resolve, reject) => {
      console.log('Sending request to facebook: ' + properties.request);
      this.axios.post(properties.request, properties.body)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

   // TODO - document body properties
  /**
    * Prepare and send a thank you message to user with report ID
    * @method sendThanks
    * @param {Object} body - HTTP body request object
    * @return {Promise} - Result of request
  **/
  sendThanks(body) {
    return new Promise((resolve, reject) => {
      this.bot.thanks(body)
        .then((msg) => {
          const response = this._prepareRequest(body.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
    });
  }

  /**
    * Respond to Facebook to user based on input
    * @method sendReply
    * @param {Object} facebookMessage - Facebook requets object
    * @return {Promise} - Result of request
  **/
  sendReply(facebookMessage) {
    return new Promise((resolve, reject) => {
      const properties = {
        userId: String(facebookMessage.sender.id),
        language: this.config.DEFAULT_LANGUAGE,
        network: 'facebook',
      };
      if (this._classify(facebookMessage.message.text) === 'flood') {
        this.bot.card(properties)
        .then((msg) => {
          const response = this._prepareRequest(properties.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      } else {
        this.bot.default(properties)
        .then((msg) => {
          const response = this._prepareDefaultResponse({userId: properties.userId, messageText: msg});
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      }
    });
  }
}


