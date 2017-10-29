#!/bin/sh

#will encrypt env.yml into env.yml.enc
#environment variables $fb_telegram_param_iv and $fb_telegram_param_key must be set correctly
openssl enc -aes-256-cbc -K $fb_telegram_param_key -iv $fb_telegram_param_iv -in Indonesia.env.yml -out Indonesia.env.yml.enc 
