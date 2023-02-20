var map = L.map('map').setView([52.735044,-1.420020], 7)

// Add basemap
var layer_OSM = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map)

map.createPane('labels');
map.getPane('labels').style.zIndex = 550;
map.getPane('labels').style.pointerEvents = 'none';

var stamenLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20,
  pane: 'labels'
}).addTo(map)


map.spin(true);
// Add GeoJSON
$.getJSON('./data/safi_simple.json', function (geojson) {
  var choroplethLayer = L.choropleth(geojson, {
    valueProperty: 'dec_efi',
    scale: ['#29B6F6','#FFF9C4', '#FF5722'],
    steps: 10,
    mode: 'q',
    style: {
      color: '#D5D8DC',
      weight: 0.1,
      fillOpacity: 1.0
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(' Moderate & Severe Frailty 2019' + '<br>' +
                      '<hr>' +
                      '<table>' +
                      '<tr style="background-color: #c0c8c0">' +
                        '<td>MSOA Code </td>' +
                        '<td>' + feature.properties.MSOA11CD + '</td>' +
                      '</tr>' +
                      '<tr>' +
                        '<td>MSOA Name </td>' +
                        '<td>' + feature.properties.MSOA11NM + '</td>' +
                      '</tr>' +
                      '<tr style="background-color: #c0c8c0">' +
                        '<td>Moderate & Severe Frailty (#) </td>' +
                        '<td>' + feature.properties.efi_num + '</td>' +
                      '</tr>' +
                      '<tr>' +
                        '<td>Moderate & Severe Frailty (%) </td>' +
                        '<td>' + feature.properties.mod_sev_pc + '</td>' +
                      '</tr>' +
                      '<tr style="background-color: #c0c8c0">' +
                        '<td>Total patients (at least 1 deficit) </td>' +
                        '<td>' + feature.properties.efi_pop + '</td>' +
                      '</tr>' +
                      '</table>')
    }
  }).addTo(map)
  map.spin(false);
    
  // Add legend (don't forget to add the CSS from index.html)
  var legend = L.control({ position: 'bottomright' })
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = choroplethLayer.options.limits
    var colors = choroplethLayer.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="title"> Legend </div>'
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] +': Low' + '</div> \
			<div class="max">' + 'High :'+limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(map)

  var layers = {
    'OpenStreetMap': layer_OSM,
    'Frailty Map': choroplethLayer,
    'OSM Labels': stamenLayer
};

var layersControl = L.control.layers({},
    layers,
    { collapsed: false }).addTo(map);
})






