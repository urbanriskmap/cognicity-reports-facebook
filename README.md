[![Build Status](https://travis-ci.org/urbanriskmap/cognicity-reports-facebook.svg?branch=dev)](https://travis-ci.org/urbanriskmap/cognicity-reports-facebook) [![Coverage Status](https://coveralls.io/repos/github/urbanriskmap/cognicity-reports-facebook/badge.svg?branch=dev)](https://coveralls.io/github/urbanriskmap/cognicity-reports-facebook?branch=refactor) [![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0) 

# cognicity-reports-facebook
This module deploys serverless lambdas that, after user initiates a conversation via Facebook messenger, uses the cognicity-bot-core module to fetch a report card from a CogniCity server and sends it to the user.

### Install
`npm install`

### Getting started
* Create Facebook app and page and get `APPSECRET` and `PAGEACCESSTOKEN` as explained [here](https://developers.facebook.com/docs/messenger-platform/guides/setup). Hold off on completing Step 2 (Set up webhooks) in the guide.
* Add code for webhooks and add it to the functions in serverless.yml file as explained [here](https://serverless.com/blog/building-a-facebook-messenger-chatbot-with-serverless/)
* Add the lambda function to listen to relevant SNS topics and add it to the functions in serverless.yml file
* Set up the config files as explained in the `Configuration` section. `VALIDATIONTOKEN` can be set to any arbitrary string.
* Now, deploy your serverless lambdas as mentioned in the `Run` section
* On successful deployment, you'll get a secure URL for the webhook's GET method. Now complete Step 2 in the [Quick Start Guide](https://developers.facebook.com/docs/messenger-platform/guides/setup). Set this secure URL as 'Callback URL' and `VALIDATIONTOKEN` in the 'Verify Token' fields. Select 'messages' and 'messaging_postbacks' to enable two-way communication. Verifying and saving this enables the webhooks for the app.
* Subscribe your app to your page as explained [here](https://developers.facebook.com/docs/messenger-platform/guides/setup#subscribe_app)
* Send a text to your Facebook messenger bot to test if it is up and running!
* Read `Misc Notes` section to assist in configuration

### Deployment
Adjust .travis.yml to deploy via Travis as need.

### Configuration
Save a copy of sample.env as .env in local directory with appropriate credentials as defined in sample.env

