
/**
* @param  {H.Map} firstMap  A HERE Map instance within the application
* @param  {H.Map} secondMap  A HERE Map instance within the application
*/

function displayBounds(firstMap, secondMap) {
  // get view model objects for both maps, view model contains all data and
  // utility functions that're related to map's geo state
  var viewModel1 = firstMap.getViewModel(),
    viewModel2 = secondMap.getViewModel(),
    polygon,
    marker;

  // create a polygon that will represent the visible area of the main map
  polygon = new H.map.Polygon(viewModel1.getLookAtData().bounds, {
    volatility: true
  });
  // create a marker that will represent the center of the visible area
  marker = new H.map.Marker(viewModel1.getLookAtData().position, {
    volatility: true
  });
  // add both objects to the map
  staticMap.addObject(polygon);
  staticMap.addObject(marker)

  // set up view change listener on the interactive map
  firstMap.addEventListener('mapviewchange', function () {
    // on every view change take a "snapshot" of a current geo data for
    // interactive map and set the zoom and position on the non-interactive map
    var data = viewModel1.getLookAtData();
    viewModel2.setLookAtData({
      position: data.position,
      zoom: data.zoom - 2
    });

    // update the polygon that represents the visisble area of the interactive map
    polygon.setGeometry(data.bounds);
    // update the marker that represent the center of the interactive map
    marker.setGeometry(data.position);
  });
}

/**
* Boilerplate map initialization code starts below:
*/

// initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: 'kgSdjqerT-AJ-VhQvIwifffAhb9AuVu7LK3gMkbIweA',
  useHTTPS: true,
  useCIT: true
});
// create two sets of the default layers for each map instance
var defaultLayers = platform.createDefaultLayers();
var defaultLayersSync = platform.createDefaultLayers();

// set up containers for the map

var mapContainer = document.createElement('div');
var staticMapContainer = document.createElement('div');

mapContainer.style.height = '600px';

staticMapContainer.style.position = 'absolute';
staticMapContainer.style.width = '900px';
staticMapContainer.style.height = '600px';

document.getElementById('map').appendChild(mapContainer);
document.getElementById('panel').appendChild(staticMapContainer);

// initialize a map, this map is interactive
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map, {
  center: { lat: -33.4372, lng: -70.6506 },
  zoom: 16,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// adjust tilt and rotation of the map
map.getViewModel().setLookAtData({
  tilt: 45,
  heading: 60
});

// initialize a map that will be synchronised
var staticMap = new H.Map(staticMapContainer,
  defaultLayersSync.vector.normal.map, {
  center: { lat: -33.4372, lng: -70.6506 },
  zoom: 7,
  pixelRatio: window.devicePixelRatio || 1
});

// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
// create beahvior only for the first map
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Now use the map as required...
displayBounds(map, staticMap);



//LUGAR ESPECIFICO

function moveMapToBerlin(map) {
  map.setZoom(14);
}

var ui = H.ui.UI.createDefault(map, defaultLayers);


// MARCADOR

function addMarkersToMap(map) {
  var parisMarker = new H.map.Marker({ lat: -33.4379, lng: -70.6506 });
  map.addObject(parisMarker);

  var romeMarker = new H.map.Marker({ lat: -33.4390, lng: -70.6506 });
  map.addObject(romeMarker);

  var berlinMarker = new H.map.Marker({ lat: -33.4362, lng: -70.6506 });
  map.addObject(berlinMarker);

  var madridMarker = new H.map.Marker({ lat: -33.4352, lng: -70.6506 });
  map.addObject(madridMarker);

  var londonMarker = new H.map.Marker({ lat: -33.4332, lng: -70.6506 });
  map.addObject(londonMarker);


  // Now use the map as required...
  window.onload = function () {
    addMarkersToMap(map)
    moveMapToBerlin(map);
  }
};


// ESTILO

function setStyle(map) {
  // get the vector provider from the base layer
  var provider = map.getBaseLayer().getProvider();
  // Create the style object from the YAML configuration.
  // First argument is the style path and the second is the base URL to use for
  // resolving relative URLs in the style like textures, fonts.
  // all referenced resources relative to the base path https://js.api.here.com/v3/3.1/styles/omv.
  var style = new H.map.Style('https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/data/dark.yaml',
    'https://js.api.here.com/v3/3.1/styles/omv/');
  // set the style on the existing layer
  provider.setStyle(style);
}

setStyle(map);

//limites en el mapa

function setMapViewBounds(map) {
  var bbox = new H.geo.Rect(-33.4379);
  map.getViewModel().setLookAtData({
    bounds: bbox
  });
}

window.onload = function () {
  setMapViewBounds(map);
};


//TOMAR UNA FOTO

function capture(resultContainer, map, ui) {
  // Capturing area of the map is asynchronous, callback function receives HTML5 canvas
  // element with desired map area rendered on it.
  // We also pass an H.ui.UI reference in order to see the ScaleBar in the output.
  // If dimensions are omitted, whole veiw port will be captured
  map.capture(function (canvas) {
    if (canvas) {
      resultContainer.innerHTML = '';
      resultContainer.appendChild(canvas);
    } else {
      // For example when map is in Panorama mode
      resultContainer.innerHTML = 'Capturing is not supported';
    }
  }, [ui], 50, 50, 500, 200);
}

var resultContainer = document.getElementById('panel_DOS');

// Create container for the "Capture" button
var containerNode = document.createElement('div');
containerNode.className = 'btn-group ';

// Create the "Capture" button
var captureBtn = document.createElement('input');
captureBtn.value = 'Tomar Captura';
captureBtn.type = '<br><br><br> button';
captureBtn.className = 'btn btn-primary';

// Add both button and container to the DOM
containerNode.appendChild(captureBtn);
mapContainer.appendChild(containerNode);

// Step 7: Handle capture button click event
captureBtn.onclick = function () {
  capture(resultContainer, map, ui);
}; 


//Contexto centrar el mapa con el click derecho


function addContextMenus(map) {
  // First we need to subscribe to the "contextmenu" event on the map
  map.addEventListener('contextmenu', function (e) {
    // As we already handle contextmenu event callback on circle object,
    // we don't do anything if target is different than the map.
    if (e.target !== map) {
      return;
    }

    // "contextmenu" event might be triggered not only by a pointer,
    // but a keyboard button as well. That's why ContextMenuEvent
    // doesn't have a "currentPointer" property.
    // Instead it has "viewportX" and "viewportY" properties
    // for the associates position.

    // Get geo coordinates from the screen coordinates.
    var coord  = map.screenToGeo(e.viewportX, e.viewportY);

    // In order to add menu items, you have to push them to the "items"
    // property of the event object. That has to be done synchronously, otherwise
    // the ui component will not contain them. However you can change the menu entry
    // text asynchronously.
    e.items.push(
      // Create a menu item, that has only a label,
      // which displays the current coordinates.
      new H.util.ContextItem({
        label: [
          Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S'),
          Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W')
        ].join(' ')
      }),
      // Create an item, that will change the map center when clicking on it.
      new H.util.ContextItem({
        label: 'Centrar el mapa aqui',
        callback: function() {
          map.setCenter(coord, true);
        }
      }),
      // It is possible to add a seperator between items in order to logically group them.
      H.util.ContextItem.SEPARATOR,
      // This menu item will add a new circle to the map
      new H.util.ContextItem({
        label: 'Agregar Circulo',
        callback: addCircle.bind(map, coord)
      })
    );
  });
}

/**
 * Adds a circle which has a context menu item to remove itself.
 *
 * @this H.Map
 * @param {H.geo.Point} coord Circle center coordinates
 */
function addCircle(coord) {
  // Create a new circle object
  var circle = new H.map.Circle(coord, 5000),
      map = this;

  // Subscribe to the "contextmenu" eventas we did for the map.
  circle.addEventListener('contextmenu', function(e) {
    // Add another menu item,
    // that will be visible only when clicking on this object.
    //
    // New item doesn't replace items, which are added by the map.
    // So we may want to add a separator to between them.
    e.items.push(
      new H.util.ContextItem({
        label: 'Remove',
        callback: function() {
          map.removeObject(circle);
        }
      })
    );
  });

  // Make the circle visible, by adding it to the map
  map.addObject(circle);
}

addContextMenus(map);