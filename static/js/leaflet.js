const API_KEY = "AIzaSyBYbCDB_gjy4zEU8tCwlyRWbLAGd_7ii-0";
var analyst_data = "/data-analyst";
var business_data = "/business-analyst";


analystLayer = new L.LayerGroup()
d3.json(analyst_data).then(function(data) {
    analyst_locations = []
    coordinates = []
    data.result.forEach(function(d) {
        analyst_locations.push(d.location);
    });
    const unique = (value, index, self) => {
        return self.indexOf(value) === index
      }
    
    const unique_analyst_locations = analyst_locations.filter(unique)
        unique_analyst_locations.forEach(function(d) {
            d = d.split(',')[0];
            var address = d;
            address = address.replace(/\s+/g, '');
            var coordinate_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`;
            d3.json(coordinate_url).then(function(d) {
                try {
                coordinates.push([d.results[0].geometry.location.lat, d.results[0].geometry.location.lng]);
                }
                catch (TypeError) {
                    console.log("Data not found")
                }
                coordinates.forEach(function(d) {
                    return new L.CircleMarker(d, {
                        radius: 10,
                        color: 'black',
                        fillColor: 'blue',
                        stroke: false,
                        fillOpacity: 0.5
                      }).addTo(analystLayer);
                });
            });
        });
});

businessLayer = new L.LayerGroup()
d3.json(business_data).then(function(data) {
    business_locations = []
    coordinates = []
    data.result.forEach(function(d) {
        business_locations.push(d.location);
    });
    const unique = (value, index, self) => {
        return self.indexOf(value) === index
      }
    
    const unique_business_locations = business_locations.filter(unique)
        unique_business_locations.forEach(function(d) {
            d = d.split(',')[0];
            var address = d;
            address = address.replace(/\s+/g, '');
            var coordinate_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`;
            d3.json(coordinate_url).then(function(d) {
                try {
                coordinates.push([d.results[0].geometry.location.lat, d.results[0].geometry.location.lng]);
                }
                catch (TypeError) {
                    console.log("Data not found")
                }
                coordinates.forEach(function(d) {
                    return new L.CircleMarker(d, {
                        radius: 10,
                        color: 'black',
                        fillColor: 'green',
                        stroke: false,
                        fillOpacity: 0.5
                    }).addTo(businessLayer);
                });
            });
        });
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: "pk.eyJ1IjoibHVjaWVubmVrYXBsYW4iLCJhIjoiY2trOHowdGN3MHNyODJ5bnRmbmg5b2t0dyJ9.46ciJtDd5-UKUy6rTirCgA",
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: "pk.eyJ1IjoibHVjaWVubmVrYXBsYW4iLCJhIjoiY2trOHowdGN3MHNyODJ5bnRmbmg5b2t0dyJ9.46ciJtDd5-UKUy6rTirCgA",
});
var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: "pk.eyJ1IjoibHVjaWVubmVrYXBsYW4iLCJhIjoiY2trOHowdGN3MHNyODJ5bnRmbmg5b2t0dyJ9.46ciJtDd5-UKUy6rTirCgA",
});

var baseMaps = {
    "Dark Map": darkmap,
    "Light Map": lightmap,
    "Outdoor Map": outdoorsmap
};

var overlayMaps = {
    "Business Analyst" : businessLayer,
    "Data Analyst" : analystLayer
}

var myMap = L.map("mapid", {
    center: [39.50, -98.35],
    zoom: 4,
    layers: [darkmap, analystLayer]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);