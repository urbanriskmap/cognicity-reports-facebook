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


# ---------------------
# Set Greeting Text
# ---------------------



greeting=$(cat <<-EOF
  {
    "greeting":[{
      "locale":"default",
      "text":"Hai {{user_full_name}}!!  Saya BencanaBot. Tekan menu di bawah atau ketik ‘Laporkan banjir’ untuk melaporkan banjir di sekitarmu."
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

# ---------------------
# Set Persistant menu
# ---------------------


persistent_menu=$(cat <<-EOF
{
            "persistent_menu": [
                {
                    "call_to_actions": [
                        {
                            "payload": "flood",
                            "title": "Laporkan banjir",
                            "type": "postback"
                        }],
                    "composer_input_disabled": true,
                    "locale": "default"
                }
            ]
    }
EOF
)

echo "persistent_menu menu: $persistent_menu"

curl -D - -X POST -H "Content-Type: application/json" -d "$persistent_menu" "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$FACEBOOK_PAGE_ACCESS_TOKEN"

