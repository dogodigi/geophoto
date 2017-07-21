function trim_nulls(data) {
  var y;
  for (var x in data) {
    y = data[x];
    if (y === "null" || y === null || y === "" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length === 0)) {
      delete data[x];
    }
    if (y instanceof Object) y = trim_nulls(y);
  }
  return data;
}

module.exports.clean = function(object){
  var obj2 = JSON.parse(JSON.stringify(object));
  if(Array.isArray(obj2)){
    arr = obj2.filter(function(e){return e;});
    obj2 = arr;
  }
  return trim_nulls(arr);
};
module.exports.getConfig = function(key) {
  var fs = require("fs");
  var config;
  var env = process.env.NODE_ENV || "development";
  if (!fs.existsSync(__dirname + '/../config/config.json')) {
    //console.log('Warning, no config.json present. Falling back to config.default.json');
    config = require(__dirname + '/../config/config.default.json')[env];
  } else {
    config = require(__dirname + '/../config/config.json')[env];
  }
  return config[key];
};
