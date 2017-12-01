#!/bin/sh

openssl aes-256-cbc -K $fb_telegram_param_key -iv $fb_telegram_param_iv -in Indonesia-dev.env.yml.enc -out Indonesia-dev.env.yml -d
openssl aes-256-cbc -K $fb_telegram_param_key -iv $fb_telegram_param_iv -in Indonesia-master.env.yml.enc -out Indonesia-master.env.yml -d
