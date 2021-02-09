// Route to data analyst data
var analyst_data = "/data-analyst";
// Route to busines analyst data
var business_data = "/business-analyst";



function findRadius(number) {
    if (number > 10) {
        return number = 10
    }
    else if (number > 5) {
        return number
    }
    else 
    return number * 2
}

// Create layer group
analystLayer = new L.LayerGroup()
// Grab Data Analyst data
d3.json(analyst_data).then(function (data) {
    analyst_locations = []
    city_coordinates = {}
    data_city_counts = {}
    // Grab all of the locations from the data set and save to array
    data.result.forEach(function (d) {
        analyst_locations.push(d.location);
    });
    // Create function to count occurrence of a city in an array 
    function countCity(city) {
        if (city in data_city_counts) {
            data_city_counts[city] += 1;
        }
        else {
            data_city_counts[city] = 1;
        }
    }
    // Function that will take our function from above and loop through our original data
    function countCities(array) {
        array.forEach(countCity);
        return data_city_counts;
    }
    countCities(analyst_locations);
    // Function to count unique values in array
    const unique = (value, index, self) => {
        return self.indexOf(value) === index
    }
    // Find our unique cities and save to array
    const unique_analyst_locations = analyst_locations.filter(unique)
    // Loop through our list of unique locations 
    unique_analyst_locations.forEach(function (d) {
        // Take location and format it for API call
        var address = d;
        var url_address = address.split(" ").join("");
        url_address = address.replace(",", "");
        // API call to find geocoordinates of each city
        var coordinate_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${url_address}&key=${API_KEY}`;
        // Save city and coordinates to object 
        d3.json(coordinate_url).then(function (d) {
            try {
                city_coordinates[address] = ([d.results[0].geometry.location.lat, d.results[0].geometry.location.lng]);
            }
            catch (TypeError) {
                console.log("City not found, skipping");
            }
            //Grab just the coordinate values from our object of locations/coordinates 
            just_coordinates = Object.values(city_coordinates);
            // Turn each set of coordinates into a circle marker!
            just_coordinates.forEach(function (d) {
                // Grab the name of the location tied to the coordinates and save to variable to display in our tooltip
                tooltip_location = Object.keys(city_coordinates).find(key => city_coordinates[key] === d);
                // Grab the number of times each location shows up in our original data (AKA number of job listings for each city), save for tooltip display
                tooltip_number = data_city_counts[tooltip_location];
                return new L.CircleMarker(d, {
                    radius: findRadius(tooltip_number),
                    color: 'black',
                    fillColor: 'lightgreen',
                    stroke: false,
                    fillOpacity: 0.5
                    // Bind and open our tooltip, add marker to our Data Analyst marker layer group
                }).bindTooltip(`${tooltip_location}` + "<br>" + "<h3> # of Jobs:" + `${tooltip_number}` + "</h3>")
                .openTooltip().addTo(analystLayer);
            });
        });
    });
});

//Create layer group
businessLayer = new L.LayerGroup()
business_city_counts = {}
// Grab Business Analyst data
d3.json(business_data).then(function (data) {
    business_locations = []
    city_coordinates = {}
    // Grab all of the locations from the data set and save to array
    data.result.forEach(function (d) {
        business_locations.push(d.location);
    });
    // Create function to count occurrence of a city in an array 
    function countCity(city) {
        if (city in business_city_counts) {
            business_city_counts[city] += 1;
        }
        else {
            business_city_counts[city] = 1;
        }
    }
    // Function that will take our function from above and loop through our original data
    function countCities(array) {
        array.forEach(countCity);
        return business_city_counts;
    }
    countCities(business_locations);
    // Function to count unique values in array
    const unique = (value, index, self) => {
        return self.indexOf(value) === index
    }
    // Find our unique cities and save to array
    const unique_business_locations = business_locations.filter(unique)
    // Loop through our list of unique locations 
    unique_business_locations.forEach(function (d) {
        // Take location and format it for API call
        var address = d;
        var url_address = address.split(" ").join("");
        url_address = address.replace(",", "");
        // API call to find geocoordinates of each city
        var coordinate_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${url_address}&key=${API_KEY}`;
        // Save city and coordinates to object 
        d3.json(coordinate_url).then(function (d) {
            try {
                city_coordinates[d.results[0].formatted_address] = ([d.results[0].geometry.location.lat, d.results[0].geometry.location.lng]);
            }
            catch (TypeError) {
                console.log("City not found, skipping");
            }
            //Grab just the coordinate values from our object of locations/coordinates
            just_coordinates = Object.values(city_coordinates);
            // Turn each set of coordinates into a circle marker!
            just_coordinates.forEach(function (d) {
                // Grab the name of the location tied to the coordinates and save to variable to display in our tooltip
                tooltip_location = Object.keys(city_coordinates).find(key => city_coordinates[key] === d);
                // Grab the number of times each location shows up in our original data (AKA number of job listings for each city), save for tooltip display
                tooltip_number = business_city_counts[tooltip_location];
                return new L.CircleMarker(d, {
                    radius: findRadius(tooltip_number),
                    color: 'black',
                    fillColor: 'lightcoral',
                    stroke: false,
                    fillOpacity: 0.5
                // Bind and open our tooltip, add marker to our Data Analyst marker layer group
                }).bindTooltip(`${tooltip_location}` + "<br>" + "<h3> # of Jobs:" + `${tooltip_number}` + "</h3>")
                .openTooltip().addTo(businessLayer);
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
    "Business Analyst": businessLayer,
    "Data Analyst": analystLayer
}

var myMap = L.map("mapid", {
    center: [39.50, -98.35],
    zoom: 4,
    layers: [darkmap, analystLayer]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    titles = ["Bussiness Analyst", "Data Analyst"];
    div.innerHTML += ('<strong>  Job Title  </strong><br>');
    div.innerHTML += ('<i style="background:' + 'lightcoral' + '"></i> ' + 'Business Analyst' + '<br>');
    div.innerHTML += ('<i style="background:' + 'lightgreen' + '"></i> ' + 'Data Analyst' + '<br>');

    return div;
};

legend.addTo(myMap);