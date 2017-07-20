#!/bin/bash
sed -i "s^__FLICKR_API_KEY__^$FLICKR_API_KEY^g" /geophoto/config/config.json
sed -i "s^__FLICKR_SECRET__^$FLICKR_SECRET^g" /geophoto/config/config.json
sed -i "s^__FLICKR_USER_ID__^$FLICKR_USER_ID^g" /geophoto/config/config.json
sed -i "s^__FLICKR_ACCESS_TOKEN__^$FLICKR_ACCESS_TOKEN^g" /geophoto/config/config.json
sed -i "s^__FLICKR_ACCESS_TOKEN_SECRET__^$FLICKR_ACCESS_TOKEN_SECRET^g" /geophoto/config/config.json

cd /geophoto
node download.js
npm start
