var Flickr = require("flickrapi");
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config.json')[env];

var args = process.argv.slice(2);
var options = config.flickr;

options.user_id = args[0] || options.user_id;

Flickr.authenticate(options, Flickr.downsync('data/' + options.user_id, true));
