// Initialize our namespace
var tagControl;
var map;
document.addEventListener("DOMContentLoaded", function(){
  init();
});

function init(){
  map = L.map('result-map').setView([0,0],1);
  var markers = L.markerClusterGroup();
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  markers.addTo(map);
  m.request({
      method: "GET",
      url: "/api/collections"
    }).then(function(data) {
      var counter = data.length;
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
                    showPhoto(feature, photodetail);
                    //geotagger(layer, map);
                  });
                }
              });
            }
          });
            markers.addLayer(geojson);
            if ( counter === i+1){
              map.fitBounds(markers.getBounds());
            }
          }
        });
      });
    }
  );
}

function showPhoto(feature, photodetail){
  console.log(feature);
  var flashmessage = photodetail.exif.camera.flash ? ' using flash. ': ' not using flash. ';
  var originalImage = photodetail.exif.image.width ? 'Original image ' + photodetail.exif.image.width + 'px width and ' + photodetail.exif.image.height + 'px height.' : '';
  var description = photodetail.description.trim().length > 2 ? m("p", {class: "title is-4"}, m.trust(photodetail.description) ) : '';
  var download = m("div", {class: 'level'}, m("div", {class: 'level-item has-text-centered'},
    m("a", {class:"button", href: feature.properties.original, target: '_blank'},[
      m("span",{class: "icon"}, m("i", {class:"fa fa-download"})),
      m("span", "Download")
    ])));
  var tags;
  if(photodetail.tags){
    tags = [];
    photodetail.tags.forEach(function(item, i){
      tags.push(
        m("div", {class: 'level-item has-text-centered'}, m("span", {class: "tag is-light"}, photodetail.tags[i]))
      );
    });
  } else {
    tags = '';
  }
  var root = document.body;
  var card = m(photoCard, {
    image: {
      src: feature.properties.medium,
      link: photodetail.url,
      title: photodetail.title
    },
    owner:{
      name: photodetail.owner.name,
      link: 'https://www.flickr.com/photos/'+ photodetail.owner.id
    },
    camera: {
      model: photodetail.exif.camera.model,
      focallength: photodetail.exif.camera.focallength
    },
    description:  description,
    flash: flashmessage,
    original: originalImage,
    date: photodetail.date,
    tags: tags,
    download: download
  });
  m.render(document.getElementById('click-result'), card);
}

var photoCard = {
  view: function(vnode){
    return m("div", {class: "card"},[
      m("div",{class: "card-image"},
        m("figure", {class: "image"},
          m("img", {src: vnode.attrs.image.src})
        )
      ),
      m("div", {class: "card-content"},
        m("div", {class: "content"}, [
          vnode.attrs.description,
          m("hr"),
          m("p", [
            "Picture ",
            m("a",{href: vnode.attrs.image.link}, m.trust(vnode.attrs.image.title)),
            " taken on ", vnode.attrs.date, " by ",
            m("a",{href: vnode.attrs.owner.link}, vnode.attrs.owner.name),
            " with a ", vnode.attrs.camera.model,
            " with a focal length of ", vnode.attrs.camera.focallength,
            vnode.attrs.flash,
            vnode.attrs.original
          ]),
          m("hr"),
          m("div", {class: 'level'}, vnode.attrs.tags),
          vnode.attrs.download
        ])
      )
    ]);
  }
};

function geotagger(layer, map){
  var sourceLatLng = layer.getLatLng();
  var targetLatLng = {
    lat: parseFloat(sourceLatLng.lat) + parseFloat(0.0005),
    lng: sourceLatLng.lng
  };
  var points = {
    type: 'Feature',
    properties: {
      angle: 45
    },
    geometry: {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [sourceLatLng.lng, sourceLatLng.lat]
        },
        {
          type: 'Point',
          coordinates: [targetLatLng.lng, targetLatLng.lat]
        }
      ]
    }
  };
  if(tagControl){
    tagControl.setCameraAndTargetLatLng(sourceLatLng, targetLatLng);
    tagControl.setAngle(45);
  } else {
    tagControl = L.geotagPhoto.camera(points, {
      draggable: true
    }).addTo(map)
      .on('change', function (event) {
        var fieldOfView = this.getFieldOfView();
    });
  }
}
