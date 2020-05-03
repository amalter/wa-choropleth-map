var mapBoxToken = 'pk.eyJ1IjoiYW1iZXJhbHRlciIsImEiOiJjazlwdHA0aGowZThmM2RvM2Z1amRtcGJvIn0.rABb5kpX7Go1XPcqeq6j_g';
var map = L.map('map').setView([47.6062, -122.3321], 10);
var info = L.control();
var cityVal;
var cityName = {
    'Seattle':37.6,
    'Kent': 8.2, 
    'Federal Way': 6.5,
    'Renton': 6.1, 
    'Bellevue': 4.5,
    'SeaTac' : 3.7,
    'Auburn' : 3.9,
    'Burien' : 3.7,
    'Tukwila': 2.5,
    'Kirkland' : 2.1,
    'Des Moines' : 2.1,
    'Redmond' : 2,
    'Shoreline' : 1.7,
    'Issaquah' : .9,
    'Bothel' : .6,
    'Covington' : .4,
    'Mercer Island' : .2
};
//generate colorscale here: https://gka.github.io/palettes/
function getColor(d) {
    return d > 90 ? '#ec4d30' :
           d > 30  ? '#f36836' :
           d > 8  ? '#fa7f4a' :
           d > 6  ? '#ff9663' :
           d > 4   ? '#ffad82' :
           d > 2   ? '#ffc3a0' :
           d > 0   ? '#ffd7c0' :
                      '#ffebdf';
}

function polyStyle(val) {
    return {
        fillColor: getColor(val),
        weight: 1,
        opacity: .3,
        color: '#c65600',
        fillOpacity: 0.5
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        color:'#c65600',
        weight: 2,
        opacity: .9,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
    
}

function resetHighlight(e) {
    var layer = e.target;
    var styleReset = e.target.options.style;
    layer.setStyle(styleReset);

    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    info.update(layer.feature.properties);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    accessToken: mapBoxToken
}).addTo(map);

$.getJSON( "wa_city_limits_coordinates.geojson", function(data) {
    $(data.features).each(function(key, data) {
        $.each(cityName, function (index, val){
            
            polystyle = polyStyle(val);

            if (data.properties.CityName === index) {
                cityVal = val;
                 L.geoJson(data,{
                    style: polystyle,
                    onEachFeature : onEachFeature
                }).addTo(map);
            }
        });// $.each(cityName)
    });//$(data.features).each(function)
});//getJson

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Rental Assistance Applications</h4>';
    if (props) {
        $.each(cityName, function (index, val){
            if (props.CityName === index) {
                cityVal = val;
            }
        });// $.each(cityName)

       this._div.innerHTML += '<b>' + props.CityName + '</b><br />' + cityVal + '%';
            
    } else {
        this._div.innerHTML += 'Hover over a city';
    }
};

info.addTo(map);
