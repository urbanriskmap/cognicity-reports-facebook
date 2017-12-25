'use strict';

const request = require('request');
require('dotenv').config();

// GRASP card
const options = {
  host: process.env.SERVER_PATH,
  path: '/cards',
  method: 'POST',
  port: process.env.SERVER_PORT,
  headers: {
    'x-api-key': process.env.SERVER_API_KEY,
    'Content-Type': 'application/json'
  }
};

// GRASP operating regions
const instance_regions = {
  chn: 'chennai',
  jbd: 'jakarta',
  sby: 'surabaya',
  bdg: 'bandung',
  srg: 'semarang'
};

// Welcome message to user (telegram)
const initiate = {
  'en': 'Welcome! Type in /flood to request a card link',
  'id': 'Hai!!  Saya BencanaBot. Tekan menu di bawah atau ketik ’Laporkan banjir'
}

const submit_button = {
  'en': 'Report flood',
  'id': 'Laporkan banjir',
}

// Replies to user
const replies = {
  'en': 'Hi! Report using this link, thanks.',
  'id': 'Hi! Laporkan menggunakan link ini. Terima kasih.',
};

// Confirmation message to user
const confirmations = {
  'en': "Hi! Thanks for your report. I've put it on the map.",
  'id': 'Hi! Terima kasih atas laporan Anda. Aku sudah menaruhnya di peta.',
};

/*
 * Construct the initial message to be sent to the user
 */
function getInitialMessageText(language, cardId, disasterType) {
  return replies[language] + "\n" + process.env.FRONTEND_CARD_PATH + "/" + disasterType + "/" + cardId;
}

/*
 * Construct the confirmation message to be sent to the user
 */
function getConfirmationMessageText(language, implementationArea, reportId) {
  return confirmations[language] + "\n" + process.env.FRONTEND_MAP_PATH + "/" + instance_regions[implementationArea] + '/' + reportId;
}

/*
 * Get one time card link from the server
 */
function getCardLink(username, network, language, callback) {
  var card_request = {
    "username": username,
    "network": network,
    "language": language
  };

  console.log(options);
  console.log(card_request);
  // Get a card from Cognicity server
  request({
    url: options.host + options.path,
    method: options.method,
    headers: options.headers,
    port: options.port,
    json: true,
    body: card_request
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(null, body.cardId); //Return cardId on success
    } else {
      var err = 'Error getting card: ' + JSON.stringify(error) + JSON.stringify(response);
      callback(err, null); // Return error
    }
  });
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 */
function sendFacebookMessage(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    },
    method: 'POST',
    json: messageData

  }, function(error, response, body) {
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
module.exports.facebookWebhook = (event, context, callback) => {
  console.log(JSON.stringify(event));
  if (event.method === 'GET') {
    // Facebook app verification
    if (event.query['hub.verify_token'] === process.env.FACEBOOK_VALIDATION_TOKEN && event.query['hub.challenge']) {
      return callback(null, parseInt(event.query['hub.challenge']));
    } else {
      return callback('Invalid token');
    }
  }

  if (event.method === 'POST') {
    event.body.entry.map((entry) => {
      entry.messaging.map((messagingItem) => {
        if (messagingItem.message && messagingItem.message.text && //Code can be removed after updating Petabencana bot because we want to use only menu based communication
          (messagingItem.message.text.toLowerCase().includes('banjir') ||
            messagingItem.message.text.toLowerCase().includes('flood'))) {
          // Form JSON request body
          var language = process.env.DEFAULT_LANG;
          if (messagingItem.message.text.toLowerCase().includes('flood')) {
            language = 'en';
          }

          getCardLink (messagingItem.sender.id.toString(), "facebook", language, function(error, cardId) {
            if(error) {
              console.log(error);
            } else {
              var messageText = getInitialMessageText(language, cardId, 'flood');
              const payload = {
                recipient: {
                  id: messagingItem.sender.id
                },
                message: {
                  text: messageText
                }
              };
              sendFacebookMessage(payload);
            }
          });
        } else if (messagingItem.postback && messagingItem.postback.payload) {
          if (messagingItem.postback.payload === "GET_STARTED_PAYLOAD") {
            var payload = {
              recipient: {
                id: messagingItem.sender.id
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "button",
                    text: initiate[language],
                    buttons: [{
                        "type": "postback",
                        "title": submit_button[language],
                        "payload": "flood"
                      }
                    ]
                  }
                }
              }
            };
            sendFacebookMessage(payload);
          } else if (messagingItem.postback.payload === "flood" || messagingItem.postback.payload === "prep") {
            var language = process.env.DEFAULT_LANG;
            getCardLink (messagingItem.sender.id.toString(), "facebook", language, function(error, cardId) {
              if(error) {
                console.log(error);
              } else {
                var messageText = getInitialMessageText(language, cardId, messagingItem.postback.payload);
                const payload = {
                  recipient: {
                    id: messagingItem.sender.id
                  },
                  message: {
                    text: messageText
                  }
                };
                sendFacebookMessage(payload);
              }
            });
          }
        }
      });
    });
  }
};

module.exports.facebookReply = (event, context, callback) => {
  //This module listens in to SNS Facebook topic and reads the message published
  var message = JSON.parse(event.Records[0].Sns.Message);
  console.log("Message received from SNS topic: " + message);

  var messageText = getConfirmationMessageText(message.language, message.implementation_area, message.report_id);
  const payload = {
    recipient: {
      id: message.username
    },
    message: {
      text: messageText
    }
  };

  //Call Send API to confirmation message with report link to the user
  sendFacebookMessage(payload);
};
