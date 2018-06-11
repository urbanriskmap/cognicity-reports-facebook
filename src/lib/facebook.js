import axios from 'axios';
import Bot from '@urbanriskmap/cognicity-bot-core';
import messages from './messages.json';
import buttons from './buttons.json';
import Locale from './locale';

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
    this.locale = new Locale(this.config);
    this.axios = axios;
  }

  /**
    * Prepares Facebook card message request object
    * @method _prepareCardResponse
    * @private
    * @param {Object} properties - Request parameters
    * @param {String} properties.userId - User or Telegram chat ID for reply
    * @param {String} properties.message - Bot lib message object
    * @param {String} properties.language - User locale (e.g. 'en')
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
                title: buttons[properties.language].text.report,
                url: properties.message.link,
              },
              {
                type: 'web_url',
                url: this.config.MAP_URL,
                title: buttons[properties.language].text.map,
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
    * @param {Object} properties.thanks - Thanks reply object from bot
    * @param {Object} properties.card - New card object from bot
    * @param {String} properites.userId - User ID
    * @param {String} properties.language - User locale (e.g. 'en')
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
          text: properties.thanks.text,
          buttons: [
            {
              type: 'web_url',
              title: buttons[properties.language].text.view,
              url: properties.thanks.link,
            },
            {
              type: 'web_url',
              title: buttons[properties.language].text.add,
              url: properties.card.link,
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
      console.log('Sending request to facebook.');
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
    * @param {number} body.reportId - report ID
    * @param {String} body.instanceRegionCode - region code of report
    * @param {String} body.language - language of report
    * @param {String} body.username - user network identifier
    * @param {String} body.network - social network
    * @return {Promise} - Result of request
  **/
  sendThanks(body) {
    return new Promise((resolve, reject) => {
      if (body.instanceRegionCode === 'null') {
        // catch reports outside the reporting area and reply a default
        body.instanceRegionCode = this.config.DEFAULT_INSTANCE_REGION_CODE;
      }
      Promise.all([this.bot.thanks(body), this.bot.card(body)])
        .then((values) => {
          console.log(values);
          const properties = {
            thanks: values[0],
            card: values[1],
            userId: body.userId,
            language: body.language,
          };
          const response = this._prepareThanksResponse(properties);
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
      this.locale.get(String(facebookMessage.sender.id))
        .then((locale) => {
          const properties = {
            userId: String(facebookMessage.sender.id),
            language: locale,
            network: 'facebook',
          };
          this.bot.card(properties)
          .then((msg) => {
            const response = this._prepareCardResponse(
              {
                userId: properties.userId,
                message: msg,
                language: locale,
              });
            resolve(this._sendMessage(response));
          }).catch((err) => reject(err));
        });
    });
  }
}


