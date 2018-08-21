import axios from 'axios';
import Bot from '@urbanriskmap/cognicity-bot-core';
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
    this.config.MESSAGES = require('./messages-' +
      this.config.DEFAULT_INSTANCE_COUNTRY_CODE +
      '.json');
    this.bot = new Bot(this.config);
    this.locale = new Locale(this.config);
    this.axios = axios;
  }


  /**
    * Get the buttons that correspond to the card deck in use
    * @method _getButtonsCardResponse
    * @private
    * @param {Object} properties - Request parameters
    * @param {String} properties.userId - User or Telegram chat ID for reply
    * @param {String} properties.message - Bot lib message object
    * @param {String} properties.language - User locale (e.g. 'en')
    * @return {Object} - Request object
  **/
  _getButtonsCardResponse(properties) {
    const floodButton = {
      type: 'web_url',
      title: buttons[properties.language].text.report,
      url: properties.message.link,
    };

    const prepButton = {
      type: 'web_url',
      title: buttons[properties.language].text.prep,
      url: properties.message.prepLink,
    };

    const mapViewButton = {
        type: 'web_url',
        url: this.config.MAP_URL,
        title: buttons[properties.language].text.map,
    };

    let customButtons = [];
    if (this.config.CARDS_DECK.indexOf('flood') >= 0) {
      customButtons.push(floodButton);
    }

    if (this.config.CARDS_DECK.indexOf('prep') >= 0) {
      customButtons.push(prepButton);
    }
    // always push the view map button
    customButtons.push(mapViewButton);
    return customButtons;
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
            buttons: this._getButtonsCardResponse(properties),
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
    * Get the buttons that correspond to the card deck in use
    * @method _getButtons
    * @private
    * @param {Object} properties - Request parameters
    * @param {Object} properties.thanks - bot lib thanks object
    * @param {Object} properties.card - Bot lib card object
    * @param {String} properties.card.link - link to add another
    *                                 flood report
    * @param {String} properties.card.prepLink - link to add
    *                                 prep report
    * @return {Object} - Request object
  **/
  _getButtonsThanksResponse(properties) {
    let customButtons = [];

    const viewReportButton = {
      type: 'web_url',
      title: buttons[properties.language].text.view,
      url: properties.thanks.link,
    };

    // always push the view map button first
    customButtons.push(viewReportButton);
    const addPrepButton = {

      type: 'web_url',
      title: buttons[properties.language].text.addPrep,
      url: properties.card.prepLink,
    };

    const addFloodReport = {
        type: 'web_url',
        url: properties.card.link,
        title: buttons[properties.language].text.add,
    };

    if (this.config.CARDS_DECK.indexOf('flood') >= 0) {
      customButtons.push(addFloodReport);
    }

    if (this.config.CARDS_DECK.indexOf('prep') >= 0) {
      customButtons.push(addPrepButton);
    }
    return customButtons;
  }
    /**
    * Prepares Facebook card message request object
    * @method _prepareThanksResponse
    * @private
    * @param {Object} properties - Request parameters
    * @param {Object} properties.thanks - Thanks reply object from bot
    * @param {Object} properties.card - New card object from bot
    * @param {String} properites.userId - User ID
    * @param {String} properties.language - User locale (e.g. 'en')
    * @return {Object} - Request object
  **/
 _prepareThanksResponse(properties) {
   console.log('PREPARE THANKS');
   console.log(properties);
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
          buttons: this._getButtonsThanksResponse(properties),
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
      console.log(properties.request);
      console.log(JSON.stringify(properties.body));
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
      console.log(body);
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
          console.log('PROPERTIES FOR THANKS RESP');
          console.log(JSON.stringify(properties));
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
