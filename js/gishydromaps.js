
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
sidebar.disablePanel('shed_del');
sidebar.disablePanel('basin_properties');
sidebar.disablePanel('subshed');
sidebar.disablePanel('toc');
sidebar.disablePanel('reachselect');
//sidebar.disablePanel('wintr20');

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

map.on('zoom', function(){
    if (map.getZoom() > 11 && aoi_zoom) {
        nhdf.addTo(map);
        roadsf.addTo(map);
    }
    else {
        nhdf.removeFrom(map);
        roadsf.removeFrom(map);
    }
});

let layerControl = {
    "NHD Streams": nhdf,
    "USGS Gages": gagesf,
    "Roads": roadsf,
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
    if(type == "rectangle"){

        var AOIArea = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        AOIArea = AOIArea/(10**9)

        if(AOIArea > 1.5){
            alert("Error: Area of Interest if too big")
        }else{
            drawLayers.addLayer(layer);
            map.fitBounds(layer.getBounds());
            $('#apply-button').removeAttr('disabled');
            $('#aoi-button').attr('disabled','true');
            document.getElementById('clearaoi-button').style.display = "block";
            document.getElementById('aoi-button').style.display = "none";
        }
    }
    else if(type == "polyline"){
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
        delineate();
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

var wshed = L.featureGroup();
map.addLayer(wshed);

var subwshed = L.featureGroup();
map.addLayer(subwshed);

var subwshed2 = L.featureGroup();
map.addLayer(subwshed2);

var contourlines = L.featureGroup();
map.addLayer(contourlines);

var infstreams = L.featureGroup();
map.addLayer(infstreams);

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

$('buttadvancedreachopt-buttonon').click( function (){
    $('advancedreachopt').css('display', 'block');
})