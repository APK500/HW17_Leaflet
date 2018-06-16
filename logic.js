// First, I decided which time-frame I wanted to analyze for the earth quake data from the USGS website,
// per the instructions.  I choose to look at monthly (all month) but to filter down to only 2.5 magnitude EQs
// and higher, to give an equal look at the medium and up to the large---but to emit those so small that
//people won't notice.

// First we store endopints:   This will be 2.5 MAG, for the last 30 days-- so    5/15 to 6/15, roughly.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

//ran some others for testing......(Commented in and out)
// var query2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"




// Now we need to do the "GET REQUEST below"
d3.json(queryUrl, function(data) {
  // Here is the response and the corresponding object produced:

  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


// This gives each resulting data point a pop-up on the map with the description, etc etc
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  

  // Now we need GeoJSON:
  // Then run onEachFeature function, once for each piece of data in the array
  
  
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature,
  //   pointToLayer: function (feature, latlng) {
  //     var color;
  //     var r = 255;
  //     var g = Math.floor(255-80*feature.properties.mag);
  //     var b = Math.floor(255-80*feature.properties.mag);
  //     color= "rgb("+r+" ,"+g+","+ b+")"

var earthquakes = L.geoJSON(earthquakeData, {
     onEachFeature: onEachFeature,
     pointToLayer: function (feature, latlng) {
      var color;
       var r = Math.floor(255-75*feature.properties.mag);
      var g = Math.floor(255-95*feature.properties.mag);
      var b = 255;
       color= "rgb("+r+" ,"+g+","+ b+")"


      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // Now we create the map layers.....
  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYXBrNTAwIiwiYSI6ImNqaDlnY3N0ejAxaGczMHNkNHRreHFja2kifQ." +
    "YeguBfJkuQJ1B4BhGzcNlg");

  //  Now define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Now create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Now create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Now we put in the coloring.
  // function getColor(d) {
  //     return d < 1 ? 'rgb(255,255,255)' :
  //           d < 2  ? 'rgb(255,225,225)' :
  //           d < 3  ? 'rgb(255,195,195)' :
  //           d < 4  ? 'rgb(255,165,165)' :
  //           d < 5  ? 'rgb(255,135,135)' :
  //           d < 6  ? 'rgb(255,105,105)' :
  //           d < 7  ? 'rgb(255,75,75)' :
  //           d < 8  ? 'rgb(255,45,45)' :
  //           d < 9  ? 'rgb(255,15,15)' :
  //                       'rgb(255,0,0)';

  function getColor(d) {
  return d < 1 ? 'rgb(270,270,255)' :
         d < 2  ? 'rgb(240,240,255)' :
               d < 3  ? 'rgb(210,210,255)' :
              d < 4  ? 'rgb(180,180,255)' :
               d < 5  ? 'rgb(150,150,255)' :
              d < 6  ? 'rgb(120,120,255)' :
               d < 7  ? 'rgb(90,90,255)' :
               d < 8  ? 'rgb(60,60,255)' :
               d < 9  ? 'rgb(30,30,255)' :
                           'rgb(0,0,255)';

  }

  // Create a legend to display information about our map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}