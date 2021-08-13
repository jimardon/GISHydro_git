
//ESRI World Map
var Esri_WorldStreetMap = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
var esristreetatt = '';

//ESRI World Topo
var Esri_WorldTopoMap = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
var esritopoatt = '';

//Creation of map tiles
var esristreet = L.tileLayer(Esri_WorldStreetMap,{attribution: esristreetatt});
var esritopo = L.tileLayer(Esri_WorldTopoMap,{attribution: esritopoatt});

// Setting bounds
var southWest = L.latLng(37, -81)
northEast = L.latLng(41, -74);
var bounds = L.latLngBounds(southWest, northEast);

//Map creation
var map = L.map('map',{
    layers: [esritopo],
    maxBounds: bounds,
    maxBoundsViscosity: 0.9,
    minZoom: 9,
    zoomSnap: 0.5,
    updateWhenZooming: false,
    updateWhenIdle: true,
    wheelPxPerZoomLevel: 120,
    }).setView([38.85, -77.4],7);

var loadingControl = L.Control.loading({
    spinjs: true
});
map.addControl(loadingControl);

var nhd_url = 'https://services9.arcgis.com/RfT19DrflTYZhTI5/arcgis/rest/services/nhd_streams/FeatureServer/0/';
var gages_url = 'https://services9.arcgis.com/RfT19DrflTYZhTI5/arcgis/rest/services/md_gauges/FeatureServer/0/';
var roads_url = 'https://services9.arcgis.com/RfT19DrflTYZhTI5/arcgis/rest/services/md_road/FeatureServer/0/';
var quads_url = 'https://services9.arcgis.com/RfT19DrflTYZhTI5/arcgis/rest/services/Map_Extent/FeatureServer/0';
var infstr_url = 'https://services9.arcgis.com/RfT19DrflTYZhTI5/ArcGIS/rest/services/infstreams/FeatureServer/0';

var searchControl = L.esri.Geocoding.geosearch({
    zoomToResult: false,
    providers: [
        L.esri.Geocoding.featureLayerProvider({
            url: nhd_url,
            searchFields: ['NAME','GNIS_ID'],
            label: 'NHD Streams',
            formatSuggestion: function (feature) {
            return feature.properties.NAME + ' - ' + feature.properties.GNIS_ID;
            }
        }),
        L.esri.Geocoding.featureLayerProvider({
            url: gages_url,
            searchFields: ['GAGE_ID'],
            label: 'Stream Gauges',
            formatSuggestion: function (feature) {
            return feature.properties.GAGE_ID + ' - ' + feature.properties.STATE;
            }
        }),
        L.esri.Geocoding.featureLayerProvider({
            url: roads_url,
            searchFields: ['HWYNAME','ALT1_NAME'],
            label: 'Roads',
            formatSuggestion: function (feature) {
            return feature.properties.HWYNAME + ' - ' + feature.properties.ALT1_NAME;
            }
        }),
        L.esri.Geocoding.arcgisOnlineProvider(),
    ],
}).addTo(map);

L.Control.MousePosition = L.Control.extend({
    options: {
        position: 'bottomleft',
        separator: ' : ',
        emptyString: 'Unavailable',
        lngFirst: false,
        numDigits: 5,
        lngFormatter: undefined,
        latFormatter: undefined,
        prefix: ""
    },
  
    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
        L.DomEvent.disableClickPropagation(this._container);
        map.on('mousemove', this._onMouseMove, this);
        this._container.innerHTML=this.options.emptyString;
        return this._container;
    },
  
    onRemove: function (map) {
        map.off('mousemove', this._onMouseMove)
    },
  
    _onMouseMove: function (e) {
        var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
        var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
        var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
        var prefixAndValue = this.options.prefix + ' ' + value;
        this._container.innerHTML = prefixAndValue;
    }
  
});
  
L.Map.mergeOptions({positionControl: false});
  
L.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.MousePosition();
        this.addControl(this.positionControl);
    }
});
  
L.control.mousePosition = function (options) {return new L.Control.MousePosition(options);};


var results = L.layerGroup().addTo(map);
searchControl.on("results", function(data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
    }
});

// create the sidebar instance and add it to the map
var sidebar = L.control.sidebar({
    container: 'sidebar',
    autopan: true,
}).addTo(map).open('home');
sidebar.disablePanel('basin_properties');
sidebar.disablePanel('subshed');
sidebar.disablePanel('toc');
sidebar.disablePanel('reachselect');
sidebar.disablePanel('wintr20');
sidebar.disablePanel('download');

//Base layers definition and addition
var baseLayers = {
    "ESRI World Map": esristreet,
    "ESRI World Topo": esritopo,
};

var gagemarkers = {
    radius: 8,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var nhdf = L.esri.featureLayer({
    url: nhd_url,
    style: function (feature) {
      return { color: 'blue', weight: 1 };
    }
});

var gagesf = L.esri.featureLayer({
    url: gages_url,
    onEachFeature:function popUp(f,l){
        var out = [];
        if (f.properties){
                for(var key in f.properties){
                    if (key == "X" || key == "Y" || key == "EL" || key == "STATE" || key == "DRAINAGE_A" || key == "GAGE_ID"){
                            out.push(key+": "+f.properties[key]);
                }   }
        l.bindPopup(out.join("<br />"));
        return new L.circleMarker(l, gagemarkers)
        }
    },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 3, fillColor: "#ff7800"});
    }
});

var roadsf = L.esri.featureLayer({
    url: roads_url,
    style: function (feature) {
      return { color: '#AC1717', weight: 1 };
    }
});

var quadsf = L.esri.featureLayer({
    url: quads_url,
    style: function (feature) {
      return { color: '#606060', weight: 1 };
    }
}).addTo(map);

var infstrf = L.esri.featureLayer({
    url: infstr_url,
    style: function (feature) {
      return {
        crossOrigin: null,
        fillColor: '#6666FF',
        fillOpacity: 0.5,
        weight: 0
      };
    }
});

map.on('zoom', function(){
    if (map.getZoom() > 11 && aoi_zoom) {
        nhdf.addTo(map);
        roadsf.addTo(map);
    } else {
        nhdf.removeFrom(map);
        roadsf.removeFrom(map);
    }
    if (map.getZoom() > 14 && aoi_zoom) {
        infstrf.addTo(map);
    } else {
        infstrf.removeFrom(map);
    }
});

let layerControl = {
    "NHD Streams": nhdf,
    "USGS Gages": gagesf,
    "Roads Layer": roadsf,
    "Inferred Streams": infstrf,
}

var LC = L.control.layers(baseLayers, layerControl);
map.spin(true);
        setTimeout(function () {
            LC.addTo(map);
            map.spin(false);
        }, 1000);

L.control.mousePosition({position: "bottomleft"}).addTo(map);
L.control.scale({position: "bottomleft"}).addTo(map);

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw();
var drawLayers = new L.FeatureGroup();
map.addLayer(drawLayers);

map.on(L.Draw.Event.CREATED, function (e) {
    type = e.layerType;
    layer = e.layer;

    if(type == "polyline"){
        drawLayers.addLayer(layer)

        // Calculating the distance of the polyline
        var tempLatLng = null;
        totalDistance = 0;
        $.each(e.layer._latlngs, function(i, latlng){
            if(tempLatLng == null){
                tempLatLng = latlng;
                return;
            }
            totalDistance += tempLatLng.distanceTo(latlng);
            tempLatLng = latlng;
        });
        var transect_dist = 800;
        if(totalDistance > totalDistance){
            alert("Transect length is " + (totalDistance).toFixed(2) + " m. Maximum allowable length is " + transect_dist + "m. Please draw it again.")
            drawLayers.clearLayers();
        } else {
            $("#xs_modal").modal()
        };
    }
    else if(type == "marker" && delcheck){
        drawLayers.addLayer(layer);
        validdelcheck();
    }
    else if(type == "marker" && fpcheck){
        drawLayers.addLayer(layer);
        flowpaths_polyline();
    }
    else if(type == "marker" && olcheck){
        drawLayers.addLayer(layer);
        outlets_marker();
    }
    else if(type == "marker" && rscheck){
        drawLayers.addLayer(layer);
        reservoir()
    }
});

var addasstreams = new L.layerGroup();
addasstreams.addTo(map);
var addasoutlets = new L.layerGroup();
addasoutlets.addTo(map);
var addasreservoirs = new L.layerGroup();
addasreservoirs.addTo(map);

var mask_layer = L.featureGroup();
map.addLayer(mask_layer);

var nhd_layer = L.featureGroup();
map.addLayer(nhd_layer);

var road_layer = L.featureGroup();
map.addLayer(road_layer);

var wshed_layer = L.featureGroup();
map.addLayer(wshed_layer);

var infstr_layer = L.featureGroup();
map.addLayer(infstr_layer);

var subshed_layer = L.featureGroup();
map.addLayer(subshed_layer);

var subshed2_layer = L.featureGroup();
map.addLayer(subshed2_layer);

var contourlines = L.featureGroup();
map.addLayer(contourlines);

var landuselyr = L.featureGroup();
map.addLayer(landuselyr);

var soilslyr = L.featureGroup();
map.addLayer(soilslyr);

var longestpathlyr = L.featureGroup();
map.addLayer(longestpathlyr);

var checkBoxlayer = $('.LayerCheck');
checkBoxlayer.change(function () {
    $('#email-input').prop('disabled', checkBoxlayer.filter(':checked').length < 1);
    $('#email-button').prop('disabled', checkBoxlayer.filter(':checked').length < 1);
});
$('.LayerCheck').change();

$('#tc_method').on('change', function () {
    $("#velocitydisplay").css('display', (this.value == 'Velocity Method') ? 'block' : 'none');
});

$('#channelflow').on('change', function () {
    $("#sourcearea-display").css('display', (this.value == 'inferredstreams') ? 'block' : 'none');
});

var velmethcheckboxcheckBoxlayer = $('.velmethcheckbox');
velmethcheckboxcheckBoxlayer.change(function () {
    $('#recalculate-button').prop('disabled', velmethcheckboxcheckBoxlayer.filter(':checked').length < 1);
});
$('.velmethcheckbox').change();

$('#advancedreachopt-button').click( function (){
    var x = document.getElementById("advancedreachopt");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
})

function highlightFeaturelu(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function highlightFeaturesoils(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info2.update(layer.feature.properties);
}

function onEachFeaturelu(feature, layer) {
    layer.on({
        mouseover: highlightFeaturelu,
        mouseout: resetHighlightlu,
    });
}

function onEachFeaturesoils(feature, layer) {
    layer.on({
        mouseover: highlightFeaturesoils,
        mouseout: resetHighlightsoils,
    });
}

function style(feature) {
    luhex = feature.properties.CLASS_NAME
    return {
        fillColor: lustyle.CLASS_NAME[luhex.toLowerCase()],
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getsoilColor(d) {
    if (d == 1) {return '#CD6155'}
    else if(d == 2){return '#2980B9'}
    else if(d == 3){return '#27AE60'}
    else if(d == 4){return '#F4D03F'}
    else{return "#85929E"}
}

function style2(feature) {
    return {
        fillColor: getsoilColor(feature.properties.gridcode),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var lugeojson;
function resetHighlightlu(e) {
    lugeojson.resetStyle(e.target);
    info.update();
}

var soilsgeojson;
function resetHighlightsoils(e) {
    soilsgeojson.resetStyle(e.target);
    info2.update();
}

var info = L.control({position: "bottomright"});
var info2 = L.control({position: "bottomright"});

map.on('overlayadd', function(eo) {
    if (eo.name === basin_lu){
        info.addTo(map);
    }
    if (eo.name === basin_soil){
        info2.addTo(map);
    }
});
map.on('overlayremove', function(eo) {
    if (eo.name === basin_lu){
        info.remove();
    }
    if (eo.name === basin_soil){
        info2.remove();
    }
});
