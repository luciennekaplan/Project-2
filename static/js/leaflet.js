var cityArrayData = []
var cityArrayBus = []
d3.json("/data-analyst/locations").then(dataLoc => {
    console.log(dataLoc)
    d3.json("/data-analyst").then(data => {
        console.log(data)
        var citiesData = {};

        // then we loop through the data that we got from the promise and do a frequency count for each industry
        data.result.forEach((d, i) => {
            if (d.location in citiesData) {
                //this is basically saying "if the industry is already in our keys, add 1 to the value"
                citiesData[d.location] += 1;
            }
            else {
                // and this one is saying "if this industry isn't already in our keys then make it a key and give it the value of 1"
                citiesData[d.location] = 1;
            }
        });

        var citNameData = Object.keys(citiesData)
        var citCountData = Object.values(citiesData)

        

        citNameData.forEach((d, i) => {
            var dicty = {
                name : d,
                count: citCountData[i],
                coordinates: dataLoc[d]
            }

            cityArrayData.push(dicty)
        })
        console.log(cityArrayData)
    })
})

d3.json("/business-analyst/locations").then(busLoc => {
    console.log(busLoc)
    d3.json("/business-analyst").then(data => {
        console.log(data)
        var citiesBus = {};

        // then we loop through the data that we got from the promise and do a frequency count for each industry
        data.result.forEach((d, i) => {
            if (d.location in citiesBus) {
                //this is basically saying "if the industry is already in our keys, add 1 to the value"
                citiesBus[d.location] += 1;
            }
            else {
                // and this one is saying "if this industry isn't already in our keys then make it a key and give it the value of 1"
                citiesBus[d.location] = 1;
            }
        });

        var citNameBus = Object.keys(citiesBus)
        var citCountBus = Object.values(citiesBus)

        citNameBus.forEach((d, i) => {
            var dicty = {
                name : d,
                count: citCountBus[i],
                coordinates: busLoc[d]
            }

            cityArrayBus.push(dicty)
        })
        console.log(cityArrayBus)
    })
})
setTimeout(function () { 
console.log(cityArrayBus)
console.log(cityArrayData)

var dataAnalystMarkers = []
var busAnalystMarkers = []

cityArrayData.forEach(d => {
    dataAnalystMarkers.push(
        L.circle(d.coordinates, {
            stroke: true,
            weight: 2,
            fillOpacity: 0.75,
            color: "black",
            fillColor: "blue",
            radius: d.count * 100,
            interactive: true
        }).on("click", function (event){
            console.log(d)
        }).bindTooltip(`${d.name} <br> # of jobs: ${d.count}`)
    )
})

cityArrayBus.forEach(d => {
    busAnalystMarkers.push(
        L.circle(d.coordinates, {
            stroke: true,
            weight: 2,
            fillOpacity: 0.75,
            color: "black",
            fillColor: "green",
            radius: d.count * 100,
            interactive: true
        }).on("click", function (event){
            console.log(d)
        }).bindTooltip(`${d.name} <br> # of jobs: ${d.count}`)
    )
})

var dataAnalyst = L.layerGroup(dataAnalystMarkers);
var busAnalyst = L.layerGroup(busAnalystMarkers);

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: MAP_API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: MAP_API_KEY
});

var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  
  // Create an overlay object
var overlayMaps = {
    "Data Analyst": dataAnalyst,
    "Business Analyst": busAnalyst
  };

  var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, dataAnalyst]
  });
  
  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}, 2000)