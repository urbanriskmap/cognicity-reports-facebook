import axios from 'axios';
import Bot from '@urbanriskmap/cognicity-bot-core';
import messages from './messages.json';

/**
 * Class for sending CogniCity messages via Facebook
 * @class Facebook
 * @param {Object} config - Facebook parameters
 * @return {Object} Function methods
 **/
export default class Facebook {
  /**
   * constructor for class Facebook
   * @param {Object} config - Facebook parameters
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
   * @param {Object} message - Facebook message object
   * @return {String} - Keyword or null
   */
  _classify(message) {
    // Seet search expression
    const re = new RegExp(/\/flood/gi);
    // Determine whether this was a raw text or button response
    if (message.message && message.message.text) {
      // filter the message by keyword
      if (re.exec(message.message.text) !== null) {
        return 'flood';
      } else {
        return null;
      }
    } else if (message.postback && message.postback.payload) {
      if (re.exec(message.postback.payload) !== null) {
        return 'flood';
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /**
    * Prepares Facebook card message request object
    * @method _prepareCardResponse
    * @private
    * @param {Object} properties - Request parameters
    * @param {String} properties.userId - User or Telegram chat ID for reply
    * @param {String} properties.message - Bot lib message object
    * @return {Object} - Request object
  **/
  _prepareCardResponse(properties) {
    const body = {
      recipient: {
        id: properties.userId,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: properties.message.text,
            buttons: [
              {
                type: 'web_url',
                title: 'Report flooding',
                url: properties.message.link,
              },
              {
                type: 'web_url',
                url: this.config.MAP_URL,
                title: 'View live reports',
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
    * Prepares Facebook card message request object
    * @method _prepareCardResponse
    * @private
    * @param {Object} properties - Request parameters
    * @param {String} properties.userId - User or Telegram chat ID for reply
    * @param {String} properties.message - Bot lib message object
    * @return {Object} - Request object
  **/
 _prepareThanksResponse(properties) {
  const body = {
    recipient: {
      id: properties.userId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: properties.message.text,
          buttons: [
            {
              type: 'web_url',
              title: 'View your report',
              url: properties.message.link,
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
    * Prepares default Facebook message request object
    * @method _prepareDefaultResponse
    * @private
    * @param {Object} properties - Properties.request
    * @param {String} properties.userId - User or Telegram chat ID for reply
    * @param {String} properties.message - Bot lib message object
    * @return {Object} - Request object
  **/
  _prepareDefaultResponse(properties) {
    const body = {
      recipient: {
        id: properties.userId,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: properties.message.text,
            buttons: [
              {
                type: 'postback',
                title: 'Report flooding',
                payload: '/flood',
              },
              {
                type: 'web_url',
                url: this.config.MAP_URL,
                title: 'View live reports',
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
      console.log('Request body: ' + JSON.stringify(properties.body));
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
          const response = this._prepareThanksResponse(
            {
            userId: body.userId,
            message: msg,
            });
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
      if (this._classify(facebookMessage) === 'flood') {
        this.bot.card(properties)
        .then((msg) => {
          const response = this._prepareCardResponse(
            {
              userId: properties.userId,
              message: msg,
            });
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      } else {
        this.bot.default(properties)
        .then((msg) => {
          const response = this._prepareDefaultResponse(
            {
              userId: properties.userId,
              message: msg,
            });
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      }
    });
  }
}


