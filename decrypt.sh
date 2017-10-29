#!/bin/sh

openssl aes-256-cbc -K $fb_telegram_param_key -iv $fb_telegram_param_iv -in Indonesia.env.yml.enc -out Indonesia.env.yml -d
