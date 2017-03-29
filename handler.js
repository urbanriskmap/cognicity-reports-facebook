'use strict';

const request = require('request');
require('dotenv').config({silent:true});

// GRASP card
var options = {
  host: process.env.SERVER,
  path: '/cards',
  method: 'POST',
  headers: {
    'x-api-key': process.env.X_API_KEY,
    'Content-Type': 'application/json'
  }
}
if (process.env.SERVER_PORT) {
  options.port = process.env.SERVER_PORT;
}

// GRASP operating regions
const instance_regions = {
  chn: 'chennai',
  jbd: 'jakarta',
  sby: 'surabaya',
  bdg: 'bandung'
}

// Replies to user
const replies = {
  'en': 'Hi! Report using this link, thanks.',
  'id': 'Hi! Laporkan menggunakan link ini. Terima kasih.'
}

// Confirmation message to user
const confirmations = {
  'en': "Hi! Thanks for your report. I've put it on the map.",
  'id': 'Hi! Terima kasih atas laporan Anda. Aku sudah menaruhnya di peta.'
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGEACCESSTOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s",
        recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}

// Webhook handler - This is the method called by Facebook when you verify webhooks for the app
module.exports.webhook = (event, context, callback) => {
  if (event.method === 'GET') {
    // Facebook app verification
    if (event.query['hub.verify_token'] === process.env.VALIDATIONTOKEN && event.query['hub.challenge']) {
      return callback(null, parseInt(event.query['hub.challenge']));
    } else {
      return callback('Invalid token');
    }
  }

  if (event.method === 'POST') {
    event.body.entry.map((entry) => {
      entry.messaging.map((messagingItem) => {
        if (messagingItem.message && messagingItem.message.text &&
          (messagingItem.message.text.toLowerCase().includes('banjir') ||
          messagingItem.message.text.toLowerCase().includes('flood'))) {
          // Form JSON request body
          var language = process.env.DEFAULT_LANG;
          if (messagingItem.message.text.toLowerCase().includes('flood')) {
            language = 'en';
          }
          var card_request = {
            "username": messagingItem.sender.id.toString(),
            "network": "facebook",
            "language": language
          }

          // Get a card from Cognicity server
          request({
            url: options.host + options.path,
            method: options.method,
            headers: options.headers,
            port: options.port,
            json: true,
            body: card_request
          }, function(error, response, body){
            if (!error && response.statusCode === 200){
              //Construct the text message to be sent to the user
              var messageText = replies[language];
              messageText += "\n" + process.env.CARD_PATH + "/" + body.cardId;
              const payload = {
                recipient: {
                  id: messagingItem.sender.id
                },
                message: {
                  text: messageText
                }
              };

              callSendAPI(payload);
            } else {
              var err = 'Error getting card: ' + JSON.stringify(error) + JSON.stringify(response);
              callback(err, null); // Return error
            }
          });
        }
      });
    });
  }
};

module.exports.reply = (event, context, callback) => {
  //This module listens in to SNS Facebook topic and reads the message published
  var message = JSON.parse(event.Records[0].Sns.Message);
  console.log("Message received from SNS topic: " + message);

  //Construct the confirmation message to be sent to the user
  var messageText = confirmations[message.language];
  messageText += "\n" + process.env.MAPSERVER + instance_regions[message.implementation_area] + '/' + message.report_id;
  const payload = {
    recipient: {
      id: message.username
    },
    message: {
      text: messageText
    }
  };

  //Call Send API to confirmation message with report link to the user
  callSendAPI(payload);
};
