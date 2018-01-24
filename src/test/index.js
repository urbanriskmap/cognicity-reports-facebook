/* eslint-disable no-console */
/**
 * Unit tests for CogniCity Facebook DM Lambda
 * @file Runs unit tests for CogniCity Facebook DM Lambda
 *
 */

// Unit tests
import testCards from './testLibCards';
import testFacebook from './testLibFacebook';
import testMessages from './testMessages';
// import testReceive from './testReceive';

const config = {
  oauth: {
    validation_token: process.env.FACEBOOK_VALIDATION_TOKEN,
    page_access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  },
  app: {
    default_lang: 'en',
    default_locale: 'US',
    facebook_endpoint: 'http://127.0.0.1',
    map_endpoint: 'https://riskmap.us/map/',
  },
  server: {
    card_endpoint: 'https://cards.riskmap.us/flood/',
    card_api: 'http://127.0.0.1',
    api_key: 'x',
  },
};

testCards(config);
testFacebook(config);
testMessages(config);
// testReceive(config);
