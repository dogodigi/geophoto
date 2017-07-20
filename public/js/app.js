// Initialize our namespace
document.addEventListener("DOMContentLoaded", function(){
  console.log('ready!');
  map = L.map('result-map').setView([17.996149160906516,-76.74013888888888],14);
  var markers = L.markerClusterGroup();
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  // map.on("zoomend", function (e) {
  //   console.log(map.getZoom());
  //   console.log(map.getCenter());
  // });
  markers.addTo(map);
  m.request({
      method: "GET",
      url: "/api/collections"
    }).then(function(data) {
      data.forEach(function(item, i){
        m.request({
            method: "GET",
            url: "/api/photos/" + data[i]
        }).then(function(photos) {

          if (photos.features.length > 0){
            var geojson = L.geoJSON(photos, {
            style: function (feature) {
                return {fill: false};
            },
            onEachFeature: function (feature, layer) {
              //layer.setIcon(L.icon({"iconUrl":feature.properties.thumbnail}));
              layer.on({
                click: function populate() {
                  m.request({
                      method: "GET",
                      url: "/api/photo/" + data[i] + '/' + feature.properties.id
                  }).then(function(photodetail) {
                    var flashmessage = photodetail.exif.camera.flash ? ' using flash. ': ' not using flash. ';
                    var originalImage = photodetail.exif.image.width ? 'Original image ' + photodetail.exif.image.width + 'px width and ' + photodetail.exif.image.height + 'px height.' : '';
                    var description = photodetail.description.trim().length > 2 ? '<p class="title is-4">' + photodetail.description + '</p>' : '';
                    document.getElementById('click-result').innerHTML =
                    '<div class="card">' +
                      '<div class="card-image">' +
                        '<figure class="image">' +
                          '<img src="' + feature.properties.medium + '">' +
                        '</figure>' +
                      '</div>' +
                      '<div class="card-content">' +
                        '<div class="content">' +
                           description +
                          '<p class="title is-6"></p>' +
                          '<p>Picture ' +
                          '<a href="'+ photodetail.url + '">' + photodetail.title + '</a>' +
                          ' taken on ' + photodetail.date + ' by ' +
                          ' <a href="https://www.flickr.com/photos/'+ photodetail.owner.id + '">' + photodetail.owner.name + '</a>' +' with a ' +
                            photodetail.exif.camera.model +
                            ' with focal length of ' +
                            photodetail.exif.camera.focallength +
                            flashmessage +
                            originalImage +
                          '</p>' +
                        '</div>' +
                      '</div>' +
                    '</div>';
                  });
                }
              });
            }
          });
            markers.addLayer(geojson);
          }
        });
      });
    }
  );
});
