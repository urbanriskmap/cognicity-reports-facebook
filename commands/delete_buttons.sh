#!/bin/bash

#delete the get started button
get_started=$(cat <<-EOF
  '{
    "setting_type":"call_to_actions",
    "thread_state":"new_thread"
  }'
EOF
)

echo "$get_started"

curl -X DELETE -H "Content-Type: application/json" -d "$get_started" "https://graph.facebook.com/v2.6/me/thread_settings?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"

#delete the greeting
greeting=$(cat <<-EOF
  '{
    "fields":[
      "greeting"
    ]
  }'
EOF
)

curl -X DELETE -H "Content-Type: application/json" -d "$greeting" "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"

#Delete the persistent menu
del_menu=$(cat <<-EOF
  '{
    "fields":[
        "persistent_menu"
          ]
  }'
EOF
)

curl -X DELETE -H "Content-Type: application/json" -d "$del_menu" "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"
