/*
 * Prepare outgoing bot messages for Facebook Messenger Send API.
 *  Adapted from Twitter DM bot work by Tomas Holderness.
 *
 * @author Cory Johnson 
 */

// Form JSON request body for message
const buttonWrapper = 
  '"messaging_type":{},"recipient":{"id":{}},"message":{"attachment":{'
  + '"type":"template","payload":{"template_type":"button","text":{},'
  + '"buttons":[{"type":"postback","title":{},"payload":"flood"}]}}}';

const messageWrapper = 
  '"messaging_type":{},"recipient":{"id":{}},"message":{"text":{}}';

const greetings = {
  'en': 'Hi! RiskMap bot helps you report flooding in real-time. In '
  + 'life-threatening situations always call 911.',
  'id': 'Hai! Saya BencanaBot. Tekan menu di bawah atau ketik Laporkan banjir'
};

const reportButton = {
  'en': 'Report flood',
  'id': 'Laporkan banjir'
};

const prepButton = {
  'US': 'Hurricane preparations',
  'IN': 'Monsoon preparations'
};

const replies = { 
  'en': 'Send your report using this one-time link: ',
  'id': 'Kirimkan laporan Anda menggunakan link ini: '
};

const confirmations = {
  'en': 'Thanks for your report. You can access it using this link: ',
  'id': 'Terima kasih atas laporan Anda. Aku sudah menaruhnya di peta: '
};

const localeURIs = {
  'US': 'https://riskmap.us/map/broward/',
  'IN': 'https://riskmap.in/map/',
  'ID': 'https://petabencana.id/map/'
};

const mapRegions = {
  chn: 'chennai',
  jbd: 'jakarta',
  sby: 'surabaya',
  bdg: 'bandung',
  srg: 'semarang'
};

export default (config) => ({
  default: function(lang, userId) {
    let wrapper = JSON.parse(buttonWrapper);
    response = wrapper;

    let message = greetings[config.app.default_lang];
    if (lang in greetings) {
      message = greeetings[lang];
    }
    response.messaging_type = 'RESPONSE';
    response.recipient.id = userId;
    response.message.attachement.payload.text = message;
    response.message.attachment.payload.button.title = 
                                reportButton[config.app.default_lang];
    if (lang in reportButton) {
      response.message.attachment.payload.button.title = reportButton[lang];
    }    
    return response;
  },
  card: function(lang, userId, cardId) {
    let wrapper = JSON.parse(messageWrapper);
    response = wrapper;

    let message = replies[config.app.default_lang];
    if (lang in replies) {
      message = replies[lang];
    }
    message += "\n"
    response.messaging_type = 'RESPONSE';
    response.recipient.id = userId;
    response.message.text = message + config.server.card_endpoint + cardId;

    return response;
  },
  thanks: function(lang, locale, region, userId, reportId) {
    let wrapper = JSON.parse(messageWrapper);
    response = wrapper;

    let message = confirmations[config.app.default_lang];
    if (lang in confirmations) {
      message = confirmations[lang];
    }
    message += "\n"

    let linkURI = 'https://riskmap.us/map/broward/';
    if (locale in localeURIs) {
      linkURI = localeURIs[locale];
    }
    if (region in mapRegions) {
      linkURI += mapRegions[region] + '/';
    }
    message += linkURI;
    response.messaging_type = 'RESPONSE';
    response.recipient.id = userId;
    response.message.text = message + reportId;
    
    return response;
  },
});
