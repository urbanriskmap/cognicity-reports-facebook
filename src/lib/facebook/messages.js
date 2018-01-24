/*
 * Prepare outgoing bot messages for Facebook Messenger Send API.
 *
 */

// Form JSON request body for message
const startWrapper =
  '{"messaging_type":{},'
  + '"recipient":{"id":{}},'
  + '"message":{"attachment":{"type":"template",'
  + '"payload":{"template_type":"button","text":{},'
  + '"buttons":[{"type":"postback","title":{},"payload":"flood"},'
  + '{"type":"postback","title":{},"payload":"prep"}]}}}}';

const messageWrapper =
  '{"messaging_type":{},"recipient":{"id":{}},"message":{"text":{}}}';

const cardWrapper =
  '{"messaging_type":{},'
  + '"recipient":{"id":{}},'
  + '"message":{"attachment":{"type":"template",'
  + '"payload":{"template_type":"button","text":{},'
  + '"buttons":[{"type":"web_url","title":{},"url":{},'
  + '"webview_share_button":"hide"}]}}}}';

const greetings = {
  'en': 'Hi! RiskMap bot helps you report flooding in real-time. In '
  + 'life-threatening situations always call 911.',
  'id': 'Hai! Saya BencanaBot. Tekan menu di bawah atau ketik Laporkan banjir',
};

const reportButton = {
  'en': 'Report flood',
  'id': 'Laporkan banjir',
};

const prepButton = {
  'US': 'Hurricane preparations',
  'IN': 'Monsoon preparations',
};

const cardButton = {
  'US': 'RiskMap.us',
  'IN': 'RiskMap.in',
  'ID': 'PetaBencana.id',
};

const replies = {
  'en': 'Send your report using this one-time link:',
  'id': 'Kirimkan laporan Anda menggunakan link ini:',
};

const confirmations = {
  'en': 'Thanks for your report. You can access it using this link: ',
  'id': 'Terima kasih atas laporan Anda. Aku sudah menaruhnya di peta: ',
};

const mapRegions = {
  chn: 'chennai',
  jbd: 'jakarta',
  sby: 'surabaya',
  bdg: 'bandung',
  srg: 'semarang',
};

export default (config) => ({
  default: function(lang, locale, userId) {
    let wrapper = JSON.parse(startWrapper);
    let response = wrapper;

    let message = greetings[config.app.default_lang];
    if (lang in greetings) {
      message = greetings[lang];
    }
    response.messaging_type = 'RESPONSE';
    response.recipient.id = userId;
    response.message.attachment.payload.text = message;
    response.message.attachment.payload.buttons[0].title =
                                reportButton[config.app.default_lang];
    response.message.attachment.payload.buttons[1].title =
                                prepButton[config.app.default_locale];
    if (lang in reportButton) {
      response.message.attachment.payload.buttons[0].title =
                                                    reportButton[lang];
    }
    if (locale in prepButton) {
      response.message.attachment.payload.buttons[1].title =
                                                    prepButton[locale];
    }
    return response;
  },
  card: function(lang, locale, userId, cardId) {
    let wrapper = JSON.parse(cardWrapper);
    let response = wrapper;

    let message = replies[config.app.default_lang];
    if (lang in replies) {
      message = replies[lang];
    }
    response.messaging_type = 'RESPONSE';
    response.recipient.id = userId;
    response.message.attachment.payload.text = message;
    response.message.attachment.payload.buttons[0].title =
                                cardButton[config.app.default_locale];
    response.message.attachment.payload.buttons[0].url =
                                config.server.card_endpoint + cardId;
    if (locale in cardButton) {
      response.message.attachment.payload.buttons[0].title = cardButton[locale];
    }
    return response;
  },
  thanks: function(lang, region, userId, reportId) {
    let wrapper = JSON.parse(messageWrapper);
    let response = wrapper;

    let message = confirmations[config.app.default_lang];
    if (lang in confirmations) {
      message = confirmations[lang];
    }
    // message += '\n';

    let cardURI = config.app.map_endpoint;
    if (region in mapRegions) {
      cardURI += mapRegions[region] + '/';
    } else {
      cardURI += 'broward/';
    }
    response.messaging_type = 'RESPONSE';
    response.recipient.id = userId;
    response.message.text = message + cardURI + reportId;

    return response;
  },
});
