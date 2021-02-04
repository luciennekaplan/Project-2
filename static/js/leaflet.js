var myMap = L.map("mapid", {
    center: [39.50, -98.35],
    zoom: 4,
    });


lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: "pk.eyJ1IjoibHVjaWVubmVrYXBsYW4iLCJhIjoiY2trOHowdGN3MHNyODJ5bnRmbmg5b2t0dyJ9.46ciJtDd5-UKUy6rTirCgA",
    }).addTo(myMap)