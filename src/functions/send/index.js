import facebook from '../../lib/facebook/';
import messages from '../../lib/facebook/messages';

const config = {
  oauth: {
    validation_token: process.env.FACEBOOK_VALIDATION_TOKEN,
    page_access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  },
  app: {
    default_lang: process.env.DEFAULT_LANG,
    facebook_endpoint: 'https://graph.facebook.com/v2.6/me/messages',
  },
  server: {
    card_endpoint: process.env.FRONTEND_CARD_PATH,
    card_api: `https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards`,
    api_key: process.env.SERVER_API_KEY,
  },
};

module.exports.facebookReply = (event, context, callback) => {
  // This module listens in to SNS Facebook topic and reads published messages
  let message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + message);

  request({
      uri: 'https://graph.facebook.com/v2.6/' + message.username + 
      '?fields=locale&access_token=' + process.env.PAGE_ACCESS_TOKEN,
      method: 'GET',
    }, function(error, response, body) {
      if (!error && response.statuscode == 200) {
        var [userLang, userLocale] = body.locale.split('_');

        if (userLocale == 'IN') {
          userLang = 'en';
        }
        // Prepare message
        let msg = messages(config).thanks(userLang, userLocale, 
                                          message.implementation_region,
                                          message.username, message.report_id);
        // Send message to user
        facebook(config).sendMessage(msg)
          .then((response) => 
                console.log('Successfully sent message with id %s to '
                + 'recipient %s', response.message_id, response.recipient_id))
          .catch((err) => console.log('Message failed to send over Send API',
                                      err.code, err.type, err.message));
      } else {
        var err = 'Failed calling Profile API for user: ' + userId + 
                    JSON.stringify(error) + JSON.stringify(response);
        console.error(err);
      }
  });
};
