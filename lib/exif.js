var ExifImage = require('exif').ExifImage;
var image = '';
function toGeoJSON(data){
  var feature = {};
  if(data.gps.GPSLatitude && data.gps.GPSLongitude){
    var lat = data.gps.GPSLatitude;
    var lon = data.gps.GPSLongitude;
    //Convert coordinates to WGS84 decimal
    var latRef = data.gps.GPSLatitudeRef || "N";
    var lonRef = data.gps.GPSLongitudeRef || "W";
    //lon, lat, alt
    feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          (lon[0] + lon[1]/60 + lon[2]/3600) * (lonRef == "W" ? -1 : 1),
          (lat[0] + lat[1]/60 + lat[2]/3600) * (latRef == "N" ? 1 : -1),
          data.gps.GPSAltitude || 0
        ]
      },
      "properties": {
        "image": image
      }
    };
  }
  return feature;
}
/**
 * Utility function to get exif data for processing by a template
 */
var exif = function(staticPath, callback){
  image = staticPath;
  try {
    new ExifImage({
      image : staticPath//'resources/photos/Ireland/West Coast/_MG_4174.jpg'
    }, function (error, data) {
      if (error) {
        return callback(error);
      } else {
        data.feature = toGeoJSON(data);
        return callback(null, data);
      }
    });
  } catch (error) {
    return callback(error);
  }
};

module.exports = exif;
