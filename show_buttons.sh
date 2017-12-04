#!/bin/bash

#check status of get started button
curl -X GET "https://graph.facebook.com/v2.6/me/messenger_profile?fields=get_started&access_token=$FACEBOOK_PAGE_ACCESS_TOKEN" | python -m json.tool

#greeting text
curl -X GET "https://graph.facebook.com/v2.6/me/messenger_profile?fields=greeting&access_token=$FACEBOOK_PAGE_ACCESS_TOKEN" | python -m json.tool

#persistant menu
curl -X GET "https://graph.facebook.com/v2.6/me/messenger_profile?fields=persistent_menu&access_token=$FACEBOOK_PAGE_ACCESS_TOKEN" | python -m json.tool
