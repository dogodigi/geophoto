var exif= require('../lib/exif.js');
var testImage = './assets/test.jpg';
var exifdata = exif(testImage, function(exifErr, exifInfo){
  if (exifErr){
    //skip
    console.log(exifErr);
  } else {
    console.log(exifInfo);
  }
});
