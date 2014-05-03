var map = L.map('map').setView([57.692818, 12.080584], 15);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '',
  id: 'examples.map-9ijuk24y'
}).addTo(map);


var roadsGeojson = L.geoJson(roads).addTo(map);

var drawControl = new L.Control.Draw({
  draw: {
    polygon: false, 
    marker: false, 
    rectangle: false, 
    circle: false,
    polyline: { guideLayers: [roadsGeojson] }
  }
});

map.addControl(drawControl);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
    
    drawnItems.addLayer(layer);
    
});