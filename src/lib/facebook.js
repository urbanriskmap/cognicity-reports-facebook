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
    * @param {String} message - Message to send
    * @return {String} - URI for request
  **/
  _prepareRequest(userId, message) {
    return (this.config.TELEGRAM_ENDPOINT +
            this.config.BOT_TOKEN +
            '/sendmessage?text=' +
            message +
            '&chat_id=' +
            userId
          );
  }

  /**
    * Send Telegram message
    * @method _prepareRequest
    * @private
    * @param {String} requestString - Telegram call
    * @return {Promise} - Result of request
  **/
  _sendMessage(requestString) {
    return new Promise((resolve, reject) => {
      console.log('Sending request to telegram: ' + requestString);
      this.axios.post(requestString, {})
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

   // TODO - document telegramMessage properties
  /**
    * Respond telegram to user based on input
    * @method sendReply
    * @param {Object} telegramMessage - Telegram requets object
    * @return {Promise} - Result of request
  **/
  sendReply(telegramMessage) {
    return new Promise((resolve, reject) => {
      const properties = {
        userId: String(telegramMessage.chat.id),
        language: this.config.DEFAULT_LANGUAGE,
        network: 'telegram',
      };
      if (this._classify(telegramMessage.text) === 'flood') {
        this.bot.card(properties)
        .then((msg) => {
          const response = this._prepareRequest(properties.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      } else {
        this.bot.default(properties)
        .then((msg) => {
          const response = this._prepareRequest(properties.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      }
    });
  }
}


