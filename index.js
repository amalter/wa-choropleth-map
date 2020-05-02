var mapBoxToken = 'pk.eyJ1IjoiYW1iZXJhbHRlciIsImEiOiJjazlwdHA0aGowZThmM2RvM2Z1amRtcGJvIn0.rABb5kpX7Go1XPcqeq6j_g';
var map = L.map('map').setView([47.6062, -122.3321], 10);
var cityName = {'Seattle': 1,'Shoreline': 45, 'Renton': 55,'Snoqualmie': 24, 'Bellevue': 33};
var polystyle = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 0.65
};

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    accessToken: mapBoxToken
}).addTo(map);

$.getJSON( "wa_city_limits_coordinates.geojson", function(data) {
    $(data.features).each(function(key, data) {
        $.each(cityName, function (index, val){
            if (data.properties.CityName === index) {
                L.geoJson(data,{
                    style: polystyle
                }).addTo(map);
            }
        });// $.each(cityName)
    });//$(data.features).each(function)
});//getJson

