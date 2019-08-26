/* eslint-disable max-len */
require('dotenv').config({silent: true});

export default {
    ASSESSMENT_URL: process.env.ASSESSMENT_URL || 'https://cards.riskmap.us/assessment/',
    API_GW_WEBHOOK: process.env.API_GW_WEBHOOK,
    BLACKLIST: (process.env.BLACKLIST || '').split(','),
    CARDS_API: process.env.CARDS_API || 'https://data.riskmap.us/cards/',
    CARDS_API_KEY: process.env.CARDS_API_KEY,
    CARDS_DECK: (process.env.CARDS_DECK || 'flood' ).split(','),
    CARDS_URL: process.env.CARDS_URL || 'https://cards.riskmap.us/flood/',
    PREP_URL: process.env.PREP_URL || 'https://cards.riskmap.us/prep/',
    DEFAULT_INSTANCE_COUNTRY_CODE: process.env.DEFAULT_INSTANCE_COUNTRY_CODE || 'us',
    DEFAULT_INSTANCE_REGION_CODE: process.env.DEFAULT_INSTANCE_REGION_CODE || 'brw',
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'id',
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || 'secret',
    FACEBOOK_ENDPOINT: process.env.FACEBOOK_ENDPOINT || 'https://graph.facebook.com/v4.0/me/messages',
    FACEBOOK_PAGE_ACCESS_TOKEN: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    FACEBOOK_VALIDATION_TOKEN: process.env.FACEBOOK_VALIDAION_TOKEN,
    MAP_URL: process.env.MAP_URL || 'https://riskmap.us/',
    NETWORK_NAME: 'facebook',
};
