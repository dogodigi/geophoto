#!/bin/bash
sed -i "s^__FLICKR_API_KEY__^$FLICKR_API_KEY^g" /tagga/config/config.json
sed -i "s^__FLICKR_SECRET__^$FLICKR_SECRET^g" /tagga/config/config.json
sed -i "s^__FLICKR_USER_ID__^$FLICKR_USER_ID^g" /tagga/config/config.json
sed -i "s^__FLICKR_ACCESS_TOKEN__^$FLICKR_ACCESS_TOKEN^g" /tagga/config/config.json
sed -i "s^__FLICKR_ACCESS_TOKEN_SECRET__^$FLICKR_ACCESS_TOKEN_SECRET^g" /tagga/config/config.json

cd /tagga
node download.js
npm start
