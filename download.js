var Flickr = require("flickrapi"),
  async = require('async');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config.json')[env];

var options = config.flickr;
options.user_id = config.people[0];
Flickr.authenticate(options, Flickr.downsync('data/' + options.user_id, true));
