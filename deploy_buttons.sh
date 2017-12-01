#!/bin/bash

if [ -z "$FACEBOOK_PAGE_ACCESS_TOKEN" ]
then
  echo "No FACEBOOK_PAGE_ACCESS_TOKEN IN ENVIRONMENT"
  exit 1 #failure
else
  echo "Found FACEBOOK_PAGE_ACCESS_TOKEN in env."
fi

# ----------------------
# Set Get started button
# ----------------------

#check status
#curl -X GET "https://graph.facebook.com/v2.6/me/messenger_profile?fields=get_started&access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"

#Get Started button shows up first time users look up the bot
get_started=$(cat <<-EOF
  {
    "setting_type": "call_to_actions",
    "thread_state": "new_thread",
    "call_to_actions": [{
    "payload": "GET_STARTED_PAYLOAD"
    }]
  }
EOF
)

echo $get_started

success="$(curl -s -o /dev/null -X POST -H "Content-Type: application/json" -d "$get_started" -w "%{http_code}" "https://graph.facebook.com/v2.6/me/thread_settings?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN")"

if [ $((success)) -eq 200 ]
then
  echo "Successfully set GET_STARTED_PAYLOAD"
else
  echo "Failed to set GET_STARTED_PAYLOAD"
  exit 1
fi

#To delete the get started button above, make the following HTTP request
#curl -X DELETE -H "Content-Type: application/json" -d '{
#
#  "setting_type":"call_to_actions",
#
#  "thread_state":"new_thread"
#
#}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"

# ---------------------
# Set Greeting Text
# ---------------------


#status
#curl -X GET "https://graph.facebook.com/v2.6/me/messenger_profile?fields=greeting&access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"

greeting=$(cat <<-EOF
  {
    "greeting":[{
      "locale":"default",
      "text":"Hello {{user_full_name}}! Welcome to RiskMap bot. Click on Get Started button to start a conversation with the bot."
    }]
  }
EOF
)

success=0
success="$(curl -s -o /dev/null -X POST -H "Content-Type: application/json" -d "$greeting" -w "%{http_code}" "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN")"

if [ $((success)) -eq 200 ]
then
  echo "Successfully set greeting"
else
  echo "Failed to set greeting"
  exit 1
fi

#To delete the greeting set above, use this HTTP REST call:
#curl -X DELETE -H "Content-Type: application/json" -d '{
#  "fields":[
#    "greeting"
#  ]
#}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"
#

# ---------------------
# Set Persistant menu
# ---------------------

#status
#curl -X GET "https://graph.facebook.com/v2.6/me/messenger_profile?fields=persistent_menu&access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"

persistent_menu=$(cat <<-EOF
  '{
    "persistent_menu": [{
        "locale": "default",
        "composer_input_disabled": true,
        "call_to_actions": [
          {
            "title": "Report flood",
            "type": "postback",
            "payload": "flood"
          },
          {
            "title": "Monsoon preparations",
            "type": "postback",
            "payload": "prep"
          }
        ]
      }]
  }'
EOF
)

echo "persistent_menu menu: $persistent_menu"

curl -D - -X POST -H "Content-Type: application/json" -d "$persistent_menu" "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"

#Delete the persistent menu
#del_menu=$(cat <<-EOF
#  '{
#    "fields":[
#        "persistent_menu"
#          ]
#  }'
#EOF
#)
#
#curl -X DELETE -H "Content-Type: application/json" -d "$del_menu" "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"
