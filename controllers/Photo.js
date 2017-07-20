var Flickr = require("flickrapi"),
  fs = require('fs'),
  path = require('path'),
  url = require('url'),
  _ = require('underscore'),
  exif = require('../lib/exif'),
  utils = require('../helpers/util'),
  async = require('async');
var request;
var flickrOptions = {
  api_key: "00035f36d8cb075b1030b13b34908854",
  secret: "e25ffa984be8ce3d",
  user_id: "13413821@N02",
  access_token: "72157683187523642-f173163f6424fe53",
  access_token_secret: "38a2dfe980f92443"
};
var flickrData;
function getUrl(path){
  protocol = 'http';
  path = path.replace('./','/');
  var host = request.headers.host.split(':');
  var hostname = host[0];
  var port = host[1] || 80;
  var url = protocol +
    '://' +
    hostname +
    ( port == 80 || port == 443 ? '' : ':' + port ) + path +'/';
    return url;
}
function parsePhoto(photo, callback){
  var properties = {
    id: photo,
    thumbnail: getUrl(flickrData.dirstructure.images.thumbnail) + photo + '.jpg',
    medium: getUrl(flickrData.dirstructure.images.medium) + photo + '.jpg',
    original: getUrl(flickrData.dirstructure.images.original) + photo + '.jpg'
  };
  var original = flickrData.dirstructure.images.original + '/' + photo + '.jpg';
  var exifdata = exif(original, function(exifErr, exifInfo){
    var feature;
    if (exifErr){
      // TODO: At least log these errors
      // don't care about exif errors - they are frequent with malformed files
      feature = {type: "Feature", properties: properties};
      //callback(exifErr, null);
      callback();
    } else {
      if(Object.keys(exifInfo.feature).length !== 0){
        feature = exifInfo.feature;
        feature.properties = properties;
        //feature.properties.exif = exifInfo.exif;
        //feature.properties.exif = exifInfo;
        callback(null, feature);
      } else {
        callback();
        // callback(
        //   {
        //     Error: "No GPS data",
        //     source: photo,
        //     code: 'NO_EXIF_GPS'
        //   },
        //   null
        // );
      }

    }
  });

}
module.exports.getphoto = function(req, res, next){
  var params = req.swagger.params;
  var collectionid = params.collectionid.value;
  var photoid = params.photoid.value;
  res.setHeader('content-type', 'application/json');
  res.setHeader('charset', 'utf-8');
  flickrData = Flickr.loadLocally(path.join("./data/", collectionid), {
    loadPrivate: true
  });
  details = flickrData.photos[photoid];
  var original = './data/' + collectionid + '/images/original/' + photoid + '.jpg';
  var exifdata = exif(original, function(exifErr, exifInfo){
    var exif;
    if (exifErr){
      //skip
      exif = {};
    } else {
      exif = {
        "camera": {
          "model": exifInfo.image.Make + " " + exifInfo.image.Model,
          "focallength": exifInfo.exif.FocalLength,
          "shutterspeed": exifInfo.exif.ShutterSpeedValue,
          "flash": exifInfo.exif.Flash === 0 ? false : true,
          "iso" : exifInfo.exif.ISO,
          "exposure" : exifInfo.exif.ExposureTime
        },
        "image":{
          "height": exifInfo.image.ImageHeight,
          "width": exifInfo.image.ImageWidth,
        }
      };
    }
    var final = {
      "id": details.id,
      "owner": {
        "id": details.owner.nsid,
        "name": details.owner.realname
      },
      "title": details.title._content,
      "description": details.description._content,
      "date": details.dates.taken,
      "url": details.urls.url[0]._content,
      "exif": exif
    };
    res.end(JSON.stringify(final, null, 2));

  });
};
module.exports.getcollections = function(req, res, next){
    var dirlist = fs.readdirSync("./data/").
      filter(function(file){
        if(file === 'flickr'){
          return false;
        }
        return fs.lstatSync(path.join("./data/", file)).isDirectory();
      });
    res.setHeader('content-type', 'application/json');
    res.setHeader('charset', 'utf-8');
    res.end(JSON.stringify(dirlist, null, 2));
};
module.exports.getphotos = function(req, res, next) {
  request = req;
  var params = req.swagger.params;
  var photopath = "./data/" + params.id.value;
  flickrData = Flickr.loadLocally(photopath, {
    loadPrivate: true
  });
  async.map(flickrData.photo_keys, parsePhoto, function(err, result){
    var final = {
      type: "FeatureCollection",
      "features": []
    };
    final.features = utils.clean(result);
    res.setHeader('content-type', 'application/json');
    res.setHeader('charset', 'utf-8');
    res.end(JSON.stringify(final, null, 2));
  });
};
