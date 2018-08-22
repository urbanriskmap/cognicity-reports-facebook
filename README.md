[![Build Status](https://travis-ci.org/urbanriskmap/cognicity-reports-facebook.svg?branch=dev)](https://travis-ci.org/urbanriskmap/cognicity-reports-facebook) [![Coverage Status](https://coveralls.io/repos/github/urbanriskmap/cognicity-reports-facebook/badge.svg?branch=dev)](https://coveralls.io/github/urbanriskmap/cognicity-reports-facebook?branch=dev) [![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0) 

# cognicity-reports-facebook
This module deploys AWS lambda functions that, after user initiates a conversation via Facebook messenger, uses the cognicity-bot-core module to fetch a report card from a CogniCity server and sends it to the user.

### Install
`npm install`

### Getting Started
* Create Facebook app and page and get `APPSECRET` and `PAGEACCESSTOKEN` as explained [here](https://developers.facebook.com/docs/messenger-platform/guides/setup). Hold off on completing Step 2 (Set up webhooks) in the guide unitl you complete the steps below
* Deploy functions to AWS Lambda
* Set AWS Lambda environment variables that are listed in `config.js`, including Facebook `APPSECRET` and `PAGEACCESSTOKEN` (see Configuration below).
* Connect your functions to an AWS API gateway instance
* Subscribe your Facebook app to your Facebook page as explained [here](https://developers.facebook.com/docs/messenger-platform/guides/setup#subscribe_app)
* Register the AWS API Gateway URL with the Facebook app and subscribe to messenger events
* Send a text to your Facebook messenger bot to test if it is up and running!

### Deployment
Adjust .travis.yml to deploy via Travis as need.

### Configuration
Save a copy of sample.env as .env in local directory with appropriate credentials as defined in sample.env

Configuration variables are as follows:
* `API_GW_WEBHOOK` - the API GW address for the webhook endpoint (e.g. https://chatbots.riskmap.us/facebook/webhook). Currently this is unused by functions and is for reference
* `CARDS_API` - the endpoint to get new report cards
* `CARDS_DECK` - which cards decks are deployed on this instance. Subset of 'flood,prep'.
* `CARDS_API_KEY` - the api key for the cards endpoint
* `CARDS_URL` - the URL for card resources as sent to the client
* `DEFAULT_INSTANCE_REGION_CODE` - in case a report is submitted outside a city, what city should the code fallback on
* `DEFAULT_LANGUAGE` - default language for user interactions
* `FACEBOOK_APP_SECRET` - the Facebook application secret used by Facebook to sign messenger events
* `FACEBOOK_ENDPOINT` - the Facebook API endpoint to send messages
* `FACEBOOK_PAGE_ACCESS_TOKEN` - a token generated by Facebook for page access
* `FACEBOOK_VALIDATION_TOKEN` - a random string that is a shared secret between Facebook and this software (e.g. a [UUID](https://duckduckgo.com/?q=!guid))
* `MAP_URL` - the risk map URL
* `NETWORK_NAME` - 'facebook' for CogniCity logging
* `PREP_URL` - the prep card url (e.g. https://cards-dev.riskmap.in/prep/)

### Facebook Configuration
- To subscribe to the get started button, make sure the app is subscrived to `messaging_postbacks` as set in the Messenger -> Settings -> Webhooks -> Edit events config page in developers.facebook.com
- To setup messenger buttons and greeting see the scripts in the `commands` folder (scripts require a .env file with Facebook app secrets to populate config.js)

### Testing
run `npm run test`

### Release process
1. Update CHANGELOG.md
2. Commit all changes
3. Tag release in Git and create release in GitHub
4. On the dev branch increment the version number, new development takes place in the new version
