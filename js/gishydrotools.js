"use strict";

//variables start
var date = new Date();
var today = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate() + ', ' + date.getFullYear();
var version = 'March, 2021 (Beta-Testing)';
var thomas = '2020 Maryland Fixed Region Equations';
var errormsg = "The application has encountered an unknown error, please try again. If you think it's a bug, please report it :)";
var type = '';
var layer = '';
var full_project_name = '';
var proj_name = '';
var proj_folder = '';
var dem_layer = '';
var soil_layer = '';
var land_layer = '';
var hyd_cond = '';
var acc_thr = '';
var burnopt = '';
var new_extents = '';
var aoi_zoom = true;
var gagelist = '';
var landslope = '';
var IA = '';
var LI = '';
var areami2 = '';
var basin_lu = '';
var mark_lat = '';
var mark_lon = '';
var btable0_html = '';
var delcheck = true;
var fpcheck = false;
var olcheck = false;
var rscheck = false;
var delcheckin = true;
var wshed_export = '';
var addpointvar = false;
var clear_outlets = false;
var clear_flowpaths = false;
var subshed_export = '';
var Pixel_;
var Type_;
var Mixed_;
var Elev_;
var Slope_;
var AvgArea_;
var Width_;
var Depth_;
var Xarea_;
var Tot_Length_;
var Vel_;
var I_Time_;
var Tot_Time_;
var t_ = [];
var tt_ = [];
var t_temp = [];
var e_temp = [];
var s_temp = [];
var a_temp = [];
var w_temp = [];
var d_temp = [];
var x_temp = [];
var tl_temp = [];
var v_temp = [];
var it_temp = [];
var tt_temp = [];
var thecritavg = '';
var inputstring = '';
var errorstring = '';
var outputstring = '';
var preciplist = [];
var transect_bool = '';
var plot_data = '';
var TWE_max = '';
var TWE_min = '';
var areami2_usda = '';
var reachslope = '';
var ratingtype = '';
var minstage = '';
var reachno = '';
var ratingdata = '';
var totalrating = [];
var totalreach = [];
var totaltype = [];
var totalstage = [];
var reaches = '';
var totalDistance = 0;
var tabledata = '';
var reachcount = '';
var reachcount_ = '';
var subid = '';
var singleshed = false;
var upper90 = false;
var tasker_modal = [];

function alertmodal(title, message,size){
    document.getElementById("alert-body").style.height = size;
    $("#alertmodaltitle").html(title);
    $("#alertmodalmessage").html(message);
    $("#alertmodal").modal()
}

function aoi_selec(){
    new L.Draw.Rectangle(map, drawControl.options.rectangle).enable();
};

function clear_aoi(){
    document.getElementById("aoi-button").style.display = "block";
    document.getElementById("clearaoi-button").style.display = "none";
    drawLayers.clearLayers();
    $('#apply-button').attr('disabled','true');
    $('#aoi-button').removeAttr('disabled');
};

function apply(){
    $('#proj_name').attr('disabled','true');
    $('#demselect').attr('disabled','true');
    $('#soilselect').attr('disabled','true');
    $('#landselect').attr('disabled','true');
    $('#hyddata').attr('disabled','true');
    $('#acc_thres').attr('disabled','true');
    $('#burn').attr('disabled','true');
    $('#clearaoi-button').attr('disabled','true');
    $('#apply-button').attr('disabled','true');
    data_select();
};

function data_select(){
    map.spin(true);
    proj_name = document.getElementById("proj_name").value
    proj_folder = proj_name.replace(/[^a-zA-Z0-9]/g,'_');
    dem_layer = document.getElementById("demselect").value
    soil_layer = document.getElementById("soilselect").value
    land_layer = document.getElementById("landselect").value
    hyd_cond = document.getElementById("hyddata").value
    acc_thr = document.getElementById("acc_thres").value
    burnopt = document.getElementById("burn").checked

    if (land_layer == "lu2010" || land_layer == "mdplu2002" || land_layer == "lu97m" ){
        alertmodal("Disclaimer","The LandUse/Land Cover data set you have selected has been provided courtesy of the Maryland Department of Planning. \
Any use of that data set outside of this application without \
the permission of the Department of Planning is prohibited. \
The 2010 data are based on superior imagery and a refined \
classification system. The 2002 and earlier Land Use/Land \
Cover datasets are not reconciled with these improvements. \
For more information on Department of Planning data, please \
visit the MDP web site http://www.mdp.state.md.us or \
call (410) 767-4500.)","20vh")
    }

    new_extents = layer.getBounds()
    setTimeout(function(){
        map.fitBounds(new_extents); }, 200);
    map.once("moveend zoomend", setnewextent)

    function setnewextent(){
        map.setMinZoom(map.getZoom()-0.5);
    }

    LC.removeLayer(nhdf);
    LC.removeLayer(roadsf);

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/DataSelection",
        useCors:false,
    });
    var gpTask = gpService.createTask();

    gpTask.setParam("Coord_X1", new_extents.getWest());
    gpTask.setParam("Coord_Y1", new_extents.getSouth());
    gpTask.setParam("Coord_X2", new_extents.getEast());
    gpTask.setParam("Coord_Y2", new_extents.getNorth());
    gpTask.setParam("Project_Name", proj_folder);
    gpTask.setParam("DEM_Layer", dem_layer);
    gpTask.setParam("Soil_Layer", soil_layer);
    gpTask.setParam("Land_Layer", land_layer);
    gpTask.setParam("Hydrologic_Condition", hyd_cond);
    gpTask.setParam("Accumulation_Threshold", acc_thr);
    gpTask.setParam("Burn", burnopt);

    gpTask.run(dataselectionCallback);

    function dataselectionCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#proj_name').removeAttr('disabled');
            $('#demselect').removeAttr('disabled');
            $('#soilselect').removeAttr('disabled');
            $('#landselect').removeAttr('disabled');
            $('#hyddata').removeAttr('disabled');
            $('#acc_thres').removeAttr('disabled');
            $('#burn').removeAttr('disabled');
            $('#clearaoi-button').removeAttr('disabled');
            $('#apply-button').removeAttr('disabled');
            map.spin(false);
        }

        aoi_zoom = false

        if(response.aoicheck){
            alertmodal("Warning","Land use does not cover all of the AOI extent.","10vh")
        }

        mask_layer.addLayer(L.geoJson(response.areaofinterest,{
            fillColor: 'red',
            fillOpacity: 0.1,
            color: 'red',
            weight: 1,
            opacity: 0.4,
        }));
        road_layer.addLayer(L.geoJson(response.road_clip,{
            color: '#AC1717',
            weight: 1,
        }));
        nhd_layer.addLayer(L.geoJson(response.nhd_clip,{
            color: 'blue',
            weight: 1,
        }));

        full_project_name = response.full_name

        map.removeLayer(nhdf);
        map.removeLayer(roadsf);
        LC.addOverlay(nhd_layer, "NHD Streams");
        LC.addOverlay(road_layer, "Roads");
        sidebar.enablePanel('shed_del');
        sidebar.open('shed_del');
        drawLayers.clearLayers();
        $('#infstr-button').removeAttr('disabled');
        $('#landuse-button').removeAttr('disabled');
        map.spin(false);
    }
}

function change_delcheck(){
    delcheckin = false;
    delineate();
}

function drawpoint(){
    drawLayers.clearLayers();
    new L.Draw.Marker(map, drawControl.options.marker).enable();
    delcheckin = true;
    addpointvar = false
}

function addpoint(){
    var longitude = document.getElementById('pp_lng').value;
    var latitude =  document.getElementById('pp_lat').value;
    if (longitude > new_extents.getEast() || longitude < new_extents.getWest() || latitude > new_extents.getNorth() || latitude > new_extents.getSouth()){
        alertmodal("Error","Longitude and/or latitude values are out of bounds.","10vh")
    } else {
        addpointvar = true
        var marker = L.marker([latitude, longitude]);
        drawLayers.addLayer(marker);
        delcheckin = true;
        delineate()
    }
};

function clearpoint(){
    document.getElementById("validpp").style.display = "none";
    document.getElementById("novalidpp").style.display = "none";
    document.getElementById("selecpp").style.display = "block";
    drawLayers.clearLayers();
    $('#cleardel-button').attr('disabled','true');
    $('#delineate-button').attr('disabled','true');
    $('#pourpoint-button').removeAttr('disabled');
    $('#pourpoint2-button').removeAttr('disabled');
};

function exportwshed(){saveToFile(wshed_export, 'watershed','sheddownload-button');}

function delineate(){
    map.spin(true);

    $('#delineate-button').attr('disabled','true');
    $('#pourpoint-button').attr('disabled','true');
    $('#pourpoint2-button').attr('disabled','true');
    $('#cleardel-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/Delineation",
        useCors:false
      });
    var gpTask = gpService.createTask();

    if(addpointvar){
        mark_lat = document.getElementById('pp_lat').value
        mark_lon = document.getElementById('pp_lng').value
    }else{
        mark_lat = layer.getLatLng().lat;
        mark_lon = layer.getLatLng().lng;
        document.getElementById('pp_lng').value = parseFloat(mark_lon).toFixed(6)
        document.getElementById('pp_lat').value = parseFloat(mark_lat).toFixed(6)
    }
    map.panTo(new L.LatLng(mark_lat, mark_lon));

    gpTask.setParam("projectname", full_project_name);
    gpTask.setParam("mouse_lat_proj", mark_lat);
    gpTask.setParam("mouse_lon_proj", mark_lon);
    gpTask.setParam("validate_outlet", delcheckin);

    gpTask.run(delineationCallback);

    function delineationCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#delineate-button').removeAttr('disabled');
            $('#pourpoint-button').removeAttr('disabled');
            $('#pourpoint2-button').removeAttr('disabled');
            $('#cleardel-button').removeAttr('disabled');
            map.spin(false);
        }

        if (delcheckin){
            if(response.valid_outlet){
                document.getElementById("novalidpp").style.display = "none";
                document.getElementById("validpp").style.display = "block";
                document.getElementById("selecpp").style.display = "none";
                $('#delineate-button').removeAttr('disabled');
            }else{
                map.setZoom(15);
                document.getElementById("novalidpp").style.display = "block";
                document.getElementById("validpp").style.display = "none";
                document.getElementById("selecpp").style.display = "none";
            }
            $('#cleardel-button').removeAttr('disabled');
            map.spin(false);

        }else{

            wshed_export = response.watershed
            gagelist = response.gagelist;
            wshed.addLayer(L.geoJson(wshed_export,{
                crossOrigin: null,
                fillColor: '#FA6FFA',
                fillOpacity: 0.5,
                color: 'black',
                weight: 2,
            }));

            for(var i = 0; i < gagelist.length; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = gagelist[i];
                opt.value = gagelist[i];
                document.getElementById('gagelist').appendChild(opt);
            }
            
            setTimeout(function(){
                map.fitBounds(wshed.getBounds());
                document.getElementById("sheddownload-div").style.display = "block";
                map.spin(false);
            }, 200);

            map.once("moveend zoomend", setwshedextent)
            function setwshedextent(){
                map.setMinZoom(map.getZoom()-0.5);
                sidebar.enablePanel('basin_properties');
                sidebar.open('basin_properties');
            };
            delcheck = false
        }
    }
}

function basin_properties(){
    map.spin(true);

    $('#gagelist').attr('disabled','true');
    $('#basin_properties-button').attr('disabled','true');
    tasker_modal = [];

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/BasinOutputs",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname", full_project_name);
    gpTask.setParam("landuse", land_layer);
    gpTask.setParam("hyd", hyd_cond);
    gpTask.setParam("gageid", document.getElementById("gagelist").value);

    gpTask.run(basinpropsCallback);

    function basinpropsCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#gagelist').removeAttr('disabled');
            $('#basin_properties-button').removeAttr('disabled');
            map.spin(false);
        }
        
        var lu_desc = response.lu_desc;
        var soil_acre_lists = response.soil_acre_list;
        var total_area = response.total_area;
        var acres = response.acres;
        var area_percent = response.area_percent;
        var curve_num = response.curve_num;

        var html_warning = response.html_warning;
        var x = response.x;
        var y = response.y;
        var provstring = response.provstring;
        areami2 = response.areami2;
        var theslope = response.theslope;
        var theslope_feet = response.theslope_feet;
        landslope = response.landslope;
        var UrbPct = response.urbpct;
        IA = response.ia;
        var tc = response.tc;
        var lagtime = response.lagtime;
        var maxlength = response.maxlength;
        var basinrelief = response.basinrelief;
        var avgCN = response.avgcn;
        var FC = response.fc;
        var ST = response.st;
        LI = response.li;
        var pctsoilR = response.pctsoilr;
        var pctsoil = response.pctsoil;
        var p2yr = response.p2yr;
        var maprec = response.maprec;
        var coef_list = response.coef_list;
        var exp_list = response.exp_list;

        var it_values = response.it_values;
        var q_list_all = response.q_list_all;
        var Qcfs = response.qcfs;
        var regioncount = response.regioncount;
        var taskeroutput = response.tasker;

        btable0_html = '<table border="0">';
        btable0_html += '<col width="300">';
        btable0_html += '<col width="300">';
        btable0_html += '<tr><td align="left">GISHydro Release Version Date:</td><td align="left">' + version + '</td></tr>';
        btable0_html += '<tr><td align="left">Project Name:</td><td align="left">' + proj_name + '</td></tr>';
        btable0_html += '<tr><td align="left">Analysis Date:</td><td align="left">' + today + '</td></tr>';
        btable0_html += '</table>';

        var btable1_html = '<table border="0" align="center">';
        btable1_html += '<col width="300">';
        btable1_html += '<col width="150">';
        btable1_html += '<col width="150">';
        btable1_html += '<col width="150">';
        btable1_html += '<col width="150">';
        btable1_html += '<tr align="center"><th rowspan="2">Land Use</th><th colspan="4" scope="colgroup">Acres on Indicated Soil Group</th></tr>';
        btable1_html += '<tr align="center"><th scope="col">A-Soil</th><th scope="col">B-Soil</th><th scope="col">C-Soil</th><th scope="col">D-Soil</th></tr>';
        for(var i=0; i < lu_desc.length; i++){
            btable1_html += '<tr>';
            btable1_html += '<td>' + lu_desc[i] + '</td>';
            btable1_html += '<td align="right">' + soil_acre_lists[i][0] + '</td>';
            btable1_html += '<td align="right">' + soil_acre_lists[i][1] + '</td>';
            btable1_html += '<td align="right">' + soil_acre_lists[i][2] + '</td>';
            btable1_html += '<td align="right">' + soil_acre_lists[i][3] + '</td>';
            btable1_html += '</tr>';
        }
        btable1_html += '<tr>';
        btable1_html += '<td><b>Total Area</b></td>';
        btable1_html += '<td align="right"><b>' + total_area[0] + '</b></td>';
        btable1_html += '<td align="right"><b>' + total_area[1] + '</b></td>';
        btable1_html += '<td align="right"><b>' + total_area[2] + '</b></td>';
        btable1_html += '<td align="right"><b>' + total_area[3] + '</b></td>';
        btable1_html += '</tr>';
        btable1_html += '</table><p></p>';

        var btable2_html = '<table border="0" align="center">';
        btable2_html += '<col width="300">';
        btable2_html += '<col width="150">';
        btable2_html += '<col width="150">';
        btable2_html += '<col width="100">';
        btable2_html += '<col width="100">';
        btable2_html += '<col width="100">';
        btable2_html += '<col width="100">';
        btable2_html += '<tr align="center"><th>Land Use</th><th>Acres</th><th>Percent</th><th>A</th><th>B</th><th>C</th><th>D</th></tr>';
        for(var i=0; i < lu_desc.length; i++){
            btable2_html += '<tr>';
            btable2_html += '<td>' + lu_desc[i] + '</td>';
            btable2_html += '<td align="right">' + acres[i] + '</td>';
            btable2_html += '<td align="right">' + parseFloat(area_percent[i]).toFixed(2) + '</td>';
            btable2_html += '<td align="right">' + curve_num[i][0] + '</td>';
            btable2_html += '<td align="right">' + curve_num[i][1] + '</td>';
            btable2_html += '<td align="right">' + curve_num[i][2] + '</td>';
            btable2_html += '<td align="right">' + curve_num[i][3] + '</td>';
            btable2_html += '</tr>';
        }
        btable2_html += '</table><p></p>';
        
        var basin_modal = '<div class="modal-dialog modal-lg" style="width:100%">';
        basin_modal +=     '<div class="modal-content">';
        basin_modal +=         '<div class="modal-header">';
        basin_modal +=             '<h4 class="modal-title">Basin Composition</h4>';
        basin_modal +=         '</div>'
        basin_modal +=         '<div class="modal-body">';
        basin_modal +=             btable0_html;
        basin_modal +=             '<p></p><p align="center"><b>Distribution of Land Use by Soil Group</b></p>';
        basin_modal +=             btable1_html;
        basin_modal +=             '<p align="center"><b>Distribution of Land Use by Curve Number</b></p>';
        basin_modal +=             btable2_html;
        basin_modal +=         '</div>';
        basin_modal +=         '<div class="modal-footer">';
        basin_modal +=             '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        basin_modal +=         '</div>';
        basin_modal +=     '</div>';
        basin_modal += '</div>';

        $("#basin_comp").html(basin_modal);

        var basin_dem = 'Unknown';
        basin_lu = 'Unknown';
        var basin_soil = 'Unknown';

        if(dem_layer == "neddem"){basin_dem = "NED DEM (May 2018)"}

        if(land_layer == "nlcd2011"){basin_lu = "NLCD (2011)"}
        if(land_layer == "nlcd2006"){basin_lu = "NLCD (2006)"}
        if(land_layer == "nlcd2001"){basin_lu = "NLCD (2001)"}
        if(land_layer == "mrlc"){basin_lu = "MRLC"}
        if(land_layer == "lu2010"){basin_lu = "MOP (2010)"}
        if(land_layer == "mdplu2002"){basin_lu = "MOP (2002)"}
        if(land_layer == "lu97m"){basin_lu = "MOP (1997)"}
        if(land_layer == "luult"){basin_lu = "ULTIMATE"}
        if(land_layer == "mdde2002"){basin_lu = "MD/DE (2002)"}
        if(land_layer == "lu70"){basin_lu = "USGS (1970's)"}

        if(soil_layer == "ssurgo_2018"){basin_soil = "SSURGO (May 2018)"}
        if(soil_layer == "ssurgo_old"){basin_soil = "SSURGO (2010's)"}
        if(soil_layer == "ragan"){basin_soil = "Ragan"}

        var btable3_html = '<table border="0" align="center">';
        btable3_html += '<col width="300">';
        btable3_html += '<col width="300">';
        btable3_html += '<tr><td align="left">DEM Coverage:</td><td align="left">' + basin_dem + '</td></tr>';
        btable3_html += '<tr><td align="left">Land Use Coverage:</td><td align="left">' + basin_lu + '</td></tr>';
        btable3_html += '<tr><td align="left">Soil Coverage:</td><td align="left">' + basin_soil + '</td></tr>';
        btable3_html += '<tr><td align="left">Hydrologic Condition:</td><td align="left">' + hyd_cond + '</td></tr>';
        btable3_html += '<tr><td align="left">Outlet Easting:</td><td align="left">' + x + ' m (MD Stateplane, NAD 1983)' + '</td></tr>';
        btable3_html += '<tr><td align="left">Outlet Northing:</td><td align="left">' + y + ' m (MD Stateplane, NAD 1983)' + '</td></tr>';
        btable3_html += '</table><p></p>';

        var btable4_html = '<table border="0" align="center">';
        btable4_html += '<col width="300">';
        btable4_html += '<col width="300">';
        btable4_html += '<tr><td align="left">Drainage Area:</td><td align="left">' + areami2 + ' mi<sup>2</sup> (' + parseFloat(areami2*640).toFixed(1) + ' ac)</td></tr>';
        btable4_html += '<tr><td align="left">Channel Slope:</td><td align="left">' + parseFloat(theslope).toFixed(3) + ' ft/mi (' + parseFloat(theslope_feet).toFixed(3) +' ft/ft)' + '</td></tr>';
        btable4_html += '<tr><td align="left">Land Slope:</td><td align="left">' + parseFloat(landslope).toFixed(3) + ' ft/ft' + '</td></tr>';
        btable4_html += '<tr><td align="left">Urban Area:</td><td align="left">' + UrbPct + '%</td></tr>';
        btable4_html += '<tr><td align="left">Impervious Area:</td><td align="left">' + IA + '%</td></tr>';
        btable4_html += '</table><p></p>';

        var btable5_html = '<table border="0" align="center">';
        btable5_html += '<col width="300">';
        btable5_html += '<col width="300">';
        btable5_html += '<tr><td align="left">Time of Concentration:</td><td align="left">' + tc + ' hours [W.O. Thomas, Jr. Equation]' + '</td></tr>';
        btable5_html += '<tr><td align="left">Time of Concentration:</td><td align="left">' + lagtime + ' hours  [From SCS Lag Equation * 1.67]' + '</td></tr>';
        btable5_html += '<tr><td align="left">Longest Flow Path:</td><td align="left">' + maxlength + ' mi</td></tr>';
        btable5_html += '<tr><td align="left">Basin Relief:</td><td align="left">' + basinrelief + ' ft</td></tr>';
        btable5_html += '<tr><td align="left">Average CN:</td><td align="left">' + avgCN + '</td></tr>';
        btable5_html += '<tr><td align="left">Forest Cover:</td><td align="left">' + FC + '%</td></tr>';
        btable5_html += '<tr><td align="left">Storage:</td><td align="left">' + ST + '%</td></tr>';
        btable5_html += '<tr><td align="left">Limestone:</td><td align="left">' + LI + '%</td></tr>';
        btable5_html += '<tr><td align="left">2-Year,24-hour Precipitation:</td><td align="left">' + p2yr + ' in</td></tr>';
        btable5_html += '<tr><td align="left">Mean Annual Precipitation:</td><td align="left">' + maprec + ' in</td></tr>';
        btable5_html += '</table><p></p>';

        var btable6_html = '<table border="0" align="center">';
        btable6_html += '<col width="300">';
        btable6_html += '<col width="300">';
        btable6_html += '<tr><td align="left">A Soils:</td><td align="left">' + pctsoilR[0] + '</td></tr>';
        btable6_html += '<tr><td align="left">B Soils:</td><td align="left">' + pctsoilR[1] + '</td></tr>';
        btable6_html += '<tr><td align="left">C Soils:</td><td align="left">' + pctsoilR[2] + '</td></tr>';
        btable6_html += '<tr><td align="left">D Soils:</td><td align="left">' + pctsoilR[3] + '</td></tr>';
        btable6_html += '</table><p></p>';

        var btable7_html = '<table border="0" align="center">';
        btable7_html += '<col width="300">';
        btable7_html += '<col width="300">';
        btable7_html += '<tr><td align="left">A Soils:</td><td align="left">' + pctsoil[0] + '</td></tr>';
        btable7_html += '<tr><td align="left">B Soils:</td><td align="left">' + pctsoil[1] + '</td></tr>';
        btable7_html += '<tr><td align="left">C Soils:</td><td align="left">' + pctsoil[2] + '</td></tr>';
        btable7_html += '<tr><td align="left">D Soils:</td><td align="left">' + pctsoil[3] + '</td></tr>';
        btable7_html += '</table><p></p>';

        var btableregion_html = '<table border="0" align="center">';
        btableregion_html += '<col width="300">';
        btableregion_html += '<col width="300">';
        for(var i=0; i < provstring.length; i++){
            btableregion_html += '<tr><td align="left">' + provstring[i][0] + ':</td><td align="left">' + provstring[i][1] + '%</td></tr>';
        }
        btableregion_html += '</table><p></p>';

        var basin2_modal = '<div class="modal-dialog modal-lg" style="width:100%">';
        basin2_modal +=     '<div class="modal-content">';
        basin2_modal +=         '<div class="modal-header">';
        basin2_modal +=             '<h4 class="modal-title">Basin Statistics</h4>';
        basin2_modal +=         '</div>'
        basin2_modal +=         '<div class="modal-body">';
        basin2_modal +=             btable0_html
        basin2_modal +=             '<p></p><p align="center"><b>Data Selected</b></p>';
        basin2_modal +=             btable3_html
        basin2_modal +=             '<p align="center"><b>Hydrologic Region Distribution</b></p>';
        basin2_modal +=             btableregion_html
        basin2_modal +=             '<p align="center"><b>Basin Properties</b></p>';
        basin2_modal +=             btable4_html
        basin2_modal +=             btable5_html
        basin2_modal +=             '<p align="center"><b>Selected Soils Data Statistics Percent</b></p>';
        basin2_modal +=             btable6_html
        basin2_modal +=             '<p align="center"><b>SSURGO Soils Data Statistics Percent (used in Regression Equations)</b></p>';
        basin2_modal +=             btable7_html
        basin2_modal +=             '<div align="center"><p style="color:red;width: 400px;text-align: center;" ><b>' + html_warning + '</b></p></div>'
        basin2_modal +=         '</div>';
        basin2_modal +=         '<div class="modal-footer">';
        basin2_modal +=             '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        basin2_modal +=         '</div>';
        basin2_modal +=     '</div>';
        basin2_modal += '</div>';

        $("#basin_stat").html(basin2_modal);

        var btable9_html = '<table border="0" align="center">';
        btable9_html += '<col width="100">';
        btable9_html += '<col width="100">';
        for(var i=0; i < it_values.length; i++){
            btable9_html += '<tr>';
            btable9_html += '<td align="left">Q(' + it_values[i] + '):</td>';
            btable9_html += '<td align="right">' + Qcfs[i] + ' cfs</td>';
            btable9_html += '</tr>';
        }
        btable9_html += '</table><p></p>';

        var btable10_html = '<table border="0" align="center">';
        btable10_html += '<col width="70">';
        btable10_html += '<col width="70">';
        btable10_html += '<col width="70">';
        btable10_html += '<col width="70">';
        btable10_html += '<col width="70">';
        btable10_html += '<col width="70">';
        btable10_html += '<col width="70">';
        btable10_html += '<col width="70">';
        btable10_html += '<col width="70">';
        btable10_html += '<tr align="center"><th rowspan="2">Return Period</th>';
        btable10_html += '<th colspan="2" scope="colgroup">50%</th>';
        btable10_html += '<th colspan="2" scope="colgroup">67%</th>';
        btable10_html += '<th colspan="2" scope="colgroup">90%</th>';
        btable10_html += '<th colspan="2" scope="colgroup">95%</th></tr>';
        btable10_html += '<tr align="center"><th scope="col">lower</th><th scope="col">upper</th>';
        btable10_html += '<th scope="col">lower</th><th scope="col">upper</th>';
        btable10_html += '<th scope="col">lower</th><th scope="col">upper</th>';
        btable10_html += '<th scope="col">lower</th><th scope="col">upper</th></tr>';
        for(var i=0; i < it_values.length; i++){
            btable10_html += '<tr>';
            btable10_html += '<td align="center">' + it_values[i] + '</td>';
            btable10_html += '<td align="center">' + Math.round(q_list_all[i][0]) + '</td>';
            btable10_html += '<td align="center">' + Math.round(q_list_all[i][1]) + '</td>';
            btable10_html += '<td align="center">' + Math.round(q_list_all[i][2]) + '</td>';
            btable10_html += '<td align="center">' + Math.round(q_list_all[i][3]) + '</td>';
            btable10_html += '<td align="center">' + Math.round(q_list_all[i][4]) + '</td>';
            btable10_html += '<td align="center">' + Math.round(q_list_all[i][5]) + '</td>';
            btable10_html += '<td align="center">' + Math.round(q_list_all[i][6]) + '</td>';
            btable10_html += '<td align="center">' + Math.round(q_list_all[i][7]) + '</td>';
            btable10_html += '</tr>';
        }
        btable10_html += '</table><p></p>';

        for(var j=0; j < regioncount; j++){

            var estim_par = taskeroutput[j][0];
            var warning_message = taskeroutput[j][1];
            var cl = taskeroutput[j][2];
            var cu = taskeroutput[j][3];
            var yhat_list = taskeroutput[j][4];
            var sepc_list = taskeroutput[j][5];
            var eqyrs_list = taskeroutput[j][6];
            var sepred_list = taskeroutput[j][7];

            var btable11_html = '<table border="0" align="center">';
            btable11_html += '<col width="150">';
            btable11_html += '<col width="200">';
            for(var i=0; i < estim_par[0].length; i++){
                btable11_html += '<tr>';
                btable11_html += '<td align="left">' + estim_par[0][i] + ':</td>';
                btable11_html += '<td align="right">' + estim_par[1][i] + '</td>';
                btable11_html += '</tr>';
            }
            btable11_html += '</table><p></p>';

            var btable12_html = '<table border="0" align="center">';
            btable12_html += '<col width="100">';
            btable12_html += '<col width="100">';
            btable12_html += '<col width="100">';
            btable12_html += '<col width="100">';
            btable12_html += '<col width="100">';
            btable12_html += '<tr align="center"><th>Return<br />Period</th>';
            btable12_html += '<th>Discharge<br />(cfs)</th>';
            btable12_html += '<th>Standard Error<br />of Prediction<br />(percent)</th>';
            btable12_html += '<th>Equivalent Years<br />of Record</th>';
            btable12_html += '<th>Standard Error<br />of Prediction<br />(logs)</th></tr>';
            for(var i=0; i < it_values.length; i++){
                btable12_html += '<tr>';
                btable12_html += '<td align="center">' + it_values[i] + '</td>';
                btable12_html += '<td align="center">' + yhat_list[i] + '</td>';
                btable12_html += '<td align="center">' + sepc_list[i] + '</td>';
                btable12_html += '<td align="center">' + eqyrs_list[i] + '</td>';
                btable12_html += '<td align="center">' + sepred_list[i] + '</td>';
                btable12_html += '</tr>';
            }
            btable12_html += '</table><p></p>';

            var btable13_html = '<table border="0" align="center">';
            btable13_html += '<col width="70">';
            btable13_html += '<col width="70">';
            btable13_html += '<col width="70">';
            btable13_html += '<col width="70">';
            btable13_html += '<col width="70">';
            btable13_html += '<col width="70">';
            btable13_html += '<col width="70">';
            btable13_html += '<col width="70">';
            btable13_html += '<col width="70">';
            btable13_html += '<tr align="center"><th rowspan="2">Return Period</th>';
            btable13_html += '<th colspan="2" scope="colgroup">50%</th>';
            btable13_html += '<th colspan="2" scope="colgroup">67%</th>';
            btable13_html += '<th colspan="2" scope="colgroup">90%</th>';
            btable13_html += '<th colspan="2" scope="colgroup">95%</th></tr>';
            btable13_html += '<tr align="center"><th scope="col">lower</th><th scope="col">upper</th>';
            btable13_html += '<th scope="col">lower</th><th scope="col">upper</th>';
            btable13_html += '<th scope="col">lower</th><th scope="col">upper</th>';
            btable13_html += '<th scope="col">lower</th><th scope="col">upper</th></tr>';
            for(var i=0; i < it_values.length; i++){
                btable13_html += '<tr>';
                btable13_html += '<td align="center">' + it_values[i] + '</td>';
                btable13_html += '<td align="center">' + cl[i][0] + '</td>';
                btable13_html += '<td align="center">' + cu[i][0] + '</td>';
                btable13_html += '<td align="center">' + cl[i][1] + '</td>';
                btable13_html += '<td align="center">' + cu[i][1] + '</td>';
                btable13_html += '<td align="center">' + cl[i][2] + '</td>';
                btable13_html += '<td align="center">' + cu[i][2] + '</td>';
                btable13_html += '<td align="center">' + cl[i][3] + '</td>';
                btable13_html += '<td align="center">' + cu[i][3] + '</td>';
                btable13_html += '</tr>';
            }
            btable13_html += '</table><p></p>';

            var basin3_modal = '<div class="modal-dialog modal-lg" style="width:100%;">';
            basin3_modal +=     '<div class="modal-content">';
            basin3_modal +=         '<div class="modal-header">';
            basin3_modal +=             '<h4 class="modal-title">Tasker Discharge</h4>';
            basin3_modal +=         '</div>'
            basin3_modal +=         '<div class="modal-body">';
            basin3_modal +=             btable0_html

            basin3_modal += '<table border="0">';
            basin3_modal += '<col width="300">';
            basin3_modal += '<col width="300">';
            basin3_modal += '<tr><td align="left">Hydrologic Region:</td><td align="left">' + provstring[j][0] + '</td></tr>';
            basin3_modal += '<tr><td align="left">Weight of Total Area:</td><td align="left">' + provstring[j][1] + '%</td></tr>';
            basin3_modal += '</table><p></p>';

            basin3_modal +=             '<p align="center" style="font-size:16px;"><b>' + thomas + '</b></p>';
            basin3_modal +=             '<p align="center"><b>Peak Flow (Total Area Weighted)</b></p>';
            basin3_modal +=             btable9_html
            basin3_modal +=             '<p align="center"><b>Prediction Intervals (Total Area Weighted)</b></p>';
            basin3_modal +=             btable10_html
            basin3_modal +=             '<p align="center"><b>Hydrologic Region Parameters</b></p>';
            basin3_modal +=             btable11_html
            basin3_modal +=             '<p align="center"><b>Hydrologic Region Flood Frequency Estimates</b></p>';
            basin3_modal +=             btable12_html
            basin3_modal +=             '<p align="center"><b>Hydrologic Region Prediction Intervals</b></p>';
            basin3_modal +=             btable13_html
            basin3_modal +=             '<p align="center" style="color:red;">'
            for(var i=0; i < warning_message.length; i++){
                basin3_modal += '<b>' + warning_message[i] + '</b><br/>';
            }
            basin3_modal +=             '</p>'
            basin3_modal +=         '</div>';
            basin3_modal +=         '<div class="modal-footer">';
            basin3_modal +=             '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
            basin3_modal +=         '</div>';
            basin3_modal +=     '</div>';
            basin3_modal += '</div>';

            tasker_modal.push(basin3_modal);

            $('#regionselect').append('<option value=' + j + '>' + provstring[j][0] + '</option>');
        }

        if(regioncount>1){
            document.getElementById("regiondisplay").style.display = "block";
        }

        $('#basincomp-button').removeAttr('aria-hidden');
        $('#basincomp-button').removeAttr('disabled');

        $('#basincomp-button').removeAttr('disabled');
        $('#basinstats-button').removeAttr('disabled');
        $('#tasker-button').removeAttr('disabled');

        document.getElementById("sheet_precipitation").value = p2yr;
        document.getElementById("channel_width_coef").value = coef_list[0];
        document.getElementById("channel_depth_coef").value = coef_list[1];
        document.getElementById("channel_area_coef").value = coef_list[2];
        document.getElementById("channel_width_exp").value = exp_list[0];
        document.getElementById("channel_depth_exp").value = exp_list[1];
        document.getElementById("channel_area_exp").value = exp_list[2];

        sidebar.enablePanel('subshed');
        drawLayers.clearLayers();
        alertmodal("Done","Basin Properties Calculations Finished","10vh")
        $('#contours-button').removeAttr('disabled');
        $('#contourbase').removeAttr('disabled');
        $('#contourint').removeAttr('disabled');
        map.spin(false);

        if(parseFloat(IA) > 10){
            alertmodal("Warning","<b>Impervious area in watershed exceeds 10%!</b><br></br><br>Calculated discharges from USGS Regression Equations may not be appropriate.</br>","18vh")
        }
    }
};

function taskerregion(){
    $("#tasker_mod").html(tasker_modal[document.getElementById("regionselect").value]);
    $("#tasker_mod").modal()
}

function flowpaths(){
    delcheck = false;
    fpcheck = true;
    olcheck = false;
    rscheck = false;
    new L.Draw.Marker(map, drawControl.options.marker).enable();
    clear_flowpaths = false
};

function clearflowpaths(){
    clear_flowpaths = true
    flowpaths_polyline()
};

function flowpaths_polyline(){
    map.spin(true);
    $('#flowpath-button').attr('disabled','true');
    if(singleshed == true){
        var centerwshed = wshed.getBounds().getCenter();
        mark_lat = centerwshed.lat;
        mark_lon = centerwshed.lng;
    }else if(clear_flowpaths === false){
        mark_lat = layer.getLatLng().lat;
        mark_lon = layer.getLatLng().lng;
    }else{
        mark_lat = "";
        mark_lon = "";
    }

    $('#subdivideyes-button').attr('disabled','true');
    $('#subdivideno-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/Flowpaths",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname", full_project_name)
    gpTask.setParam("x", mark_lon)
    gpTask.setParam("y", mark_lat)
    gpTask.setParam("clear_flowpaths", clear_flowpaths)

    gpTask.run(flowpathCallback);

    function flowpathCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#flowpath-button').removeAttr('disabled');
            map.spin(false);
        }

        if(clear_flowpaths){
            addasstreams.clearLayers();
            $('#clearflowpath-button').attr('disabled','true');
            $('#subsheds-button').attr('disabled','true');
            $('#outlet-button').attr('disabled','true');
            clearoutlets()
        }else{
            if(singleshed == false){
                addasstreams.addLayer(L.geoJson(response.flowpath,{
                    color: '#00eaff',
                    weight: 2,
                }));
            }
            $('#clearflowpath-button').removeAttr('disabled');
            $('#subsheds-button').removeAttr('disabled');
            $('#outlet-button').removeAttr('disabled');
        }
        drawLayers.clearLayers();
        $('#flowpath-button').removeAttr('disabled');
        map.spin(false);

        if(singleshed == true){
            subsheds()
        }
    }
};

function outlets(){
    delcheck = false;
    fpcheck = false;
    olcheck = true;
    rscheck = false;
    new L.Draw.Marker(map, drawControl.options.marker).enable();
    clear_outlets = false
}

function clearoutlets(){
    clear_outlets = true
    outlets_marker()
};

function outlets_marker(){
    map.spin(true);
    $('#outlet-button').attr('disabled','true');

    if(clear_outlets === false){
        mark_lat = layer.getLatLng().lat;
        mark_lon = layer.getLatLng().lng;
    }else{
        mark_lat = "";
        mark_lon = "";
    }

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/Outlets",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname", full_project_name)
    gpTask.setParam("x", mark_lon)
    gpTask.setParam("y", mark_lat)
    gpTask.setParam("clear_outlets", clear_outlets)

    gpTask.run(outletCallback);

    function outletCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#outlet-button').removeAttr('disabled');
            map.spin(false);
        }
        
        if(clear_outlets){
            addasoutlets.clearLayers();
            $('#clearoutlet-button').attr('disabled','true');
        }else{
            if(response.outlet_validation){
                var marker = L.marker([mark_lat, mark_lon]);
                addasoutlets.addLayer(marker);
                $('#clearoutlet-button').removeAttr('disabled');
            }else{
                alertmodal("Invalid","Select a valid outlet.","10vh")
            }
        }
        drawLayers.clearLayers();
        $('#outlet-button').removeAttr('disabled');
        map.spin(false);
    }
}

function subdivide_yes(){

    document.getElementById("subshedyes").style.display = "block";
    document.getElementById("subshedoption").style.display = "none";
    singleshed = false;
}

function subdivide_no(){
    singleshed = true;
    flowpaths_polyline()
}

function exportsubwshed(){saveToFile(subshed_export, 'subwatershed','subsheddownload-button');}

function subsheds(){
    map.spin(true);

    $('#flowpath-button').attr('disabled','true');
    $('#outlet-button').attr('disabled','true');
    $('#clearflowpath-button').attr('disabled','true');
    $('#clearoutlet-button').attr('disabled','true');
    $('#subsheds-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/Subsheds",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname", full_project_name)

    gpTask.run(subshedCallback);

    function subshedCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#flowpath-button').removeAttr('disabled');
            $('#outlet-button').removeAttr('disabled');
            $('#clearflowpath-button').removeAttr('disabled');
            $('#clearoutlet-button').removeAttr('disabled');
            $('#subsheds-button').removeAttr('disabled');
            map.spin(false);
        }

        subshed_export = response.subsheds
        subwshed.addLayer(L.geoJson(subshed_export,{
            crossOrigin: null,
            fillColor: '#FA6FFA',
            fillOpacity: 0.5,
            color: 'black',
            weight: 2,
        }));

        setTimeout(function(){
            map.fitBounds(subwshed.getBounds());
            map.spin(false);
        }, 200);
        map.once("moveend zoomend", setwshedextent)
        function setwshedextent(){
            map.setMinZoom(map.getZoom()-0.5);
        };

        addasoutlets.clearLayers();
        document.getElementById("subsheddownload").style.display = "block";
        map.removeLayer(wshed);
        sidebar.enablePanel('toc');
        sidebar.open('toc');
        map.spin(false);
    }
}

function settoc(){
    map.spin(true);

    $('#tc_method').attr('disabled','true');
    $('#sheet_manning').attr('disabled','true');
    $('#sheet_precipitation').attr('disabled','true');
    $('#sheet_length').attr('disabled','true');
    $('#pavedopt').attr('disabled','true');
    $('#unpavedopt').attr('disabled','true');
    $('#nhdopt').attr('disabled','true');
    $('#infopt').attr('disabled','true');
    $('#channel_manning').attr('disabled','true');
    $('#channel_area').attr('disabled','true');
    $('#channel_width_coef').attr('disabled','true');
    $('#channel_width_exp').attr('disabled','true');
    $('#channel_depth_coef').attr('disabled','true');
    $('#channel_depth_exp').attr('disabled','true');
    $('#channel_area_coef').attr('disabled','true');
    $('#channel_area_exp').attr('disabled','true');
    $('#tcapply-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/SetTOC",
        useCors:false
      });
    var gpTask = gpService.createTask();

    var tc_method = document.getElementById("tc_method").value;

    gpTask.setParam("projectname", full_project_name)
    gpTask.setParam("landuse", land_layer)
    gpTask.setParam("Tc_method", tc_method)
    gpTask.setParam("Tc_ns", document.getElementById("sheet_manning").value)
    gpTask.setParam("Tc_p", document.getElementById("sheet_precipitation").value)
    gpTask.setParam("Tc_l", document.getElementById("sheet_length").value)
    gpTask.setParam("Tc_paved", document.getElementById("pavedopt").checked)
    gpTask.setParam("Tc_nhd", document.getElementById("nhdopt").checked)
    gpTask.setParam("Tc_sa", document.getElementById("channel_area").value)
    gpTask.setParam("Tc_nc", document.getElementById("channel_manning").value)
    gpTask.setParam("Tc_cwcoef", document.getElementById("channel_width_coef").value)
    gpTask.setParam("Tc_cwexp", document.getElementById("channel_width_exp").value)
    gpTask.setParam("Tc_cdcoef", document.getElementById("channel_depth_coef").value)
    gpTask.setParam("Tc_cdexp", document.getElementById("channel_depth_exp").value)
    gpTask.setParam("Tc_cacoef", document.getElementById("channel_area_coef").value)
    gpTask.setParam("Tc_caexp", document.getElementById("channel_area_exp").value)

    gpTask.run(settocCallback);

    function settocCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#tc_method').removeAttr('disabled');
            $('#sheet_manning').removeAttr('disabled');
            $('#sheet_precipitation').removeAttr('disabled');
            $('#sheet_length').removeAttr('disabled');
            $('#pavedopt').removeAttr('disabled');
            $('#unpavedopt').removeAttr('disabled');
            $('#nhdopt').removeAttr('disabled');
            $('#infopt').removeAttr('disabled');
            $('#channel_manning').removeAttr('disabled');
            $('#channel_area').removeAttr('disabled');
            $('#channel_width_coef').removeAttr('disabled');
            $('#channel_width_exp').removeAttr('disabled');
            $('#channel_depth_coef').removeAttr('disabled');
            $('#channel_depth_exp').removeAttr('disabled');
            $('#channel_area_coef').removeAttr('disabled');
            $('#channel_area_exp').removeAttr('disabled');
            $('#tcapply-button').removeAttr('disabled');
            map.spin(false);
        }

        AvgArea_ = response.avgarea
        Tot_Time_ = response.tot_time
        reachcount = response.reach_check

        map.removeLayer(subwshed);
        subshed_export = response.subshed_edit
        subwshed2.addLayer(L.geoJson(subshed_export, {onEachFeature: forEachFeature, style: style}));

        if(tc_method == "Velocity Method"){
            Pixel_ = response.pixel
            Type_ = response.type
            Mixed_ = response.mixed
            Elev_ = response.elev
            Slope_ = response.slope
            Width_ = response.width
            Depth_ = response.depth
            Xarea_ = response.xarea
            Tot_Length_ = response.tot_length
            Vel_ = response.vel
            I_Time_ = response.i_time

            reaches = Pixel_.length;
            for(var i=0; i < reaches; i++){

                var opt = document.createElement('option');
                opt.innerHTML = i+1;
                opt.value = i+1;
                document.getElementById('subtc').appendChild(opt);
                
                var opt2 = document.createElement('option');
                opt2.innerHTML = i+1;
                opt2.value = i+1;
                document.getElementById('lpsubarea').appendChild(opt2);

                var element = document.createElement("div");
                element.setAttribute("class", "modal fade");
                element.setAttribute("id", "tc_modal" + String(i+1));
                element.setAttribute("role", "dialog");

                var tcmodal = document.getElementById("tocmodal");
                tcmodal.appendChild(element);

                createtctable(i,Pixel_[i],Type_[i],Elev_[i],Slope_[i],AvgArea_[i],Width_[i],Depth_[i],Xarea_[i],Tot_Length_[i],Vel_[i],I_Time_[i],Tot_Time_[i])

                t_temp.push(Type_[i].slice(0));
                e_temp.push(Elev_[i].slice(0));
                s_temp.push(Slope_[i].slice(0));
                a_temp.push(AvgArea_[i].slice(0));
                w_temp.push(Width_[i].slice(0));
                d_temp.push(Depth_[i].slice(0));
                x_temp.push(Xarea_[i].slice(0));
                tl_temp.push(Tot_Length_[i].slice(0));
                v_temp.push(Vel_[i].slice(0));
                it_temp.push(I_Time_[i].slice(0));
                tt_temp.push(Tot_Time_[i].slice(0));

                t_.push(Type_[i].slice(0));
                tt_.push(Tot_Time_[i].slice(0));
            }
            if(reaches>1){
                document.getElementById("velmeth_tc").style.display = "block";
                document.getElementById("lp_subarea").style.display = "block";
            };
            document.getElementById("longestpath-button").style.display = "block";

        }else{

            var tctable_html = '<table border="0" align="center">';
            tctable_html += '<col width="100">';
            tctable_html += '<col width="100">';
            tctable_html += '<col width="100">';
            tctable_html += '<tr align="center"><th>Subwatershed</th>';
            tctable_html += '<th>Area<br/>(mi<sup>2</sup>)</th>';
            tctable_html += '<th>Time of Concentration<br/>(h)</th></tr>';
            for(var i=0; i < Tot_Time_.length; i++){
                tctable_html += '<tr>';
                tctable_html += '<td align="center">' + String(i+1) + '</td>';
                tctable_html += '<td align="center">' + AvgArea_[i] + '</td>';
                tctable_html += '<td align="center">' + Tot_Time_[i] + '</td>';
                tctable_html += '</tr>';
            }
            tctable_html += '</table><p></p>';
    
            var tc_modal = '<div class="modal-dialog" style="width:100%">';
            tc_modal +=     '<div class="modal-content">';
            tc_modal +=         '<div class="modal-header">';
            tc_modal +=             '<h4 class="modal-title">' + tc_method + '</h4>';
            tc_modal +=         '</div>'
            tc_modal +=         '<div class="modal-body" style="height:250px;">';
            tc_modal +=             tctable_html
            tc_modal +=         '</div>';
            tc_modal +=         '<div class="modal-footer">';
            tc_modal +=             '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
            tc_modal +=         '</div>';
            tc_modal +=     '</div>';
            tc_modal += '</div>';
    
            $("#toc_mod").html(tc_modal);

        }

        document.getElementById("tcvalue-button").style.display = "block";
        document.getElementById("tcapply-button").style.display = "none";
        
        alertmodal("Done",'Time of concentration estimated. Move to the next tab or check the computed Time of Concentration estimates for the current method by clicking on <b>Tc</b>',"13vh")

        if(reachcount<1){
            sidebar.enablePanel('wintr20');
        }else{
            sidebar.enablePanel('reachselect');
        }
        map.spin(false);
    }
}

function createtctable(subarea,Pixel,Type,Elev,Slope,AvgArea,Width,Depth,Xarea,Tot_Length,Vel,I_Time,Tot_Time){
    var tc_method = document.getElementById("tc_method").value;

    var tctable_html = '<table border="0" align="center">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<col width="150">';
    tctable_html += '<tr align="center"><th>Pixel</th>';
    tctable_html += '<th>Type</th>';
    tctable_html += '<th>Elev<br>(ft)</br></th>';
    tctable_html += '<th>Slope<br>(ft/ft)</br></th>';
    tctable_html += '<th>Area<br>(mi<sup>2</sup>)</br></th>';
    tctable_html += '<th>Width<br>(ft)</br></th>';
    tctable_html += '<th>Depth<br>(ft)</br></th>';
    tctable_html += '<th>XS<br>(ft<sup>2</sup>)</br></th>';
    tctable_html += '<th>Length<br>(ft)</br></th>';
    tctable_html += '<th>V<br>(ft/s)</br></th>';
    tctable_html += '<th>dt<br>(hr)</br></th>';
    tctable_html += '<th>Tc<br>(hr)</br></th></tr>';
    for(var j=0; j < Pixel.length; j++){
        tctable_html += '<tr>';
        tctable_html += '<td align="center">' + Pixel[j] + '</td>';
        tctable_html += '<td align="center">' + Type[j] + '</td>';
        tctable_html += '<td align="center">' + parseFloat(Elev[j]).toFixed(1) + '</td>';
        tctable_html += '<td align="center">' + parseFloat(Slope[j]).toFixed(6) + '</td>';
        tctable_html += '<td align="center">' + parseFloat(AvgArea[j]).toFixed(6) + '</td>';
        if(Width[j] = "-1"){
            tctable_html += '<td align="center">-</td>';
            tctable_html += '<td align="center">-</td>';
            tctable_html += '<td align="center">-</td>';
        } else {
            tctable_html += '<td align="center">' + Width[j] + '</td>';
            tctable_html += '<td align="center">' + Depth[j] + '</td>';
            tctable_html += '<td align="center">' + Xarea[j] + '</td>';
        }

        tctable_html += '<td align="center">' + parseFloat(Tot_Length[j]).toFixed(1) + '</td>';
        tctable_html += '<td align="center">' + parseFloat(Vel[j]).toFixed(3) + '</td>';
        tctable_html += '<td align="center">' + parseFloat(I_Time[j]).toFixed(4) + '</td>';
        tctable_html += '<td align="center">' + parseFloat(Tot_Time[j]).toFixed(4) + '</td>';
        tctable_html += '</tr>';
    }
    tctable_html += '</table><p></p>';

    var tc_modal = '<div class="modal-dialog modal-lg" style="width:100%">';
    tc_modal +=     '<div class="modal-content">';
    tc_modal +=         '<div class="modal-header">';
    tc_modal +=             '<h4 class="modal-title">' + tc_method + ' ID: ' + String(subarea+1) + '</h4>';
    tc_modal +=         '</div>'
    tc_modal +=         '<div class="modal-body">';
    tc_modal +=             tctable_html
    tc_modal +=         '</div>';
    tc_modal +=         '<div class="modal-footer">';
    tc_modal +=             '<button type="button" class="btn btn-default" data-dismiss="modal" onclick=goback()>Go Back</button>';
    tc_modal +=         '</div>';
    tc_modal +=     '</div>';
    tc_modal += '</div>';

    $("#tc_modal" + String(subarea+1)).html(tc_modal);
}

function changetcmodal(typetc,tottimetc){

    var occcounts = {}
    typetc.forEach(function(x) { occcounts[x] = (occcounts[x] || 0)+1; });

    document.getElementById("vmsubarea").value = String(document.getElementById("subtc").value);
    document.getElementById("vmtotaltime").value = parseFloat(tottimetc[tottimetc.length - 1]).toFixed(3)
    document.getElementById("vmoltt").value = parseFloat(tottimetc[occcounts['overland']-1]).toFixed(3)
    document.getElementById("vmswtt").value = parseFloat(tottimetc[tottimetc.length-occcounts['channel']-1] - tottimetc[occcounts['overland']-1]).toFixed(3)
    document.getElementById("vmchtt").value = parseFloat(tottimetc[tottimetc.length - 1] - tottimetc[tottimetc.length-occcounts['channel']-1]).toFixed(3)
    document.getElementById("vmolseg").value = occcounts['overland']
    document.getElementById("vmswseg").value = occcounts['swale']
    document.getElementById("vmchseg").value = occcounts['channel']

}

function showtc(){
    var tc_method = document.getElementById("tc_method").value;
    if(tc_method == 'Velocity Method'){

        subid = String(document.getElementById("subtc").value);
        changetcmodal(t_[subid-1],tt_[subid-1])

        $("#vm_modal").modal()

    }else{
        $("#toc_mod").modal()
    }
}

function showpx(){
    $('#tc_modal' + subid).modal()
    $("#vm_modal").modal('toggle')
}

function goback(){
    $("#vm_modal").modal()
}

function resettc(){

    var subarea = document.getElementById("subtc").value -1

    t_temp[subarea] = Type_[subarea].slice(0);
    e_temp[subarea] = Elev_[subarea].slice(0);
    s_temp[subarea] = Slope_[subarea].slice(0);
    a_temp[subarea] = AvgArea_[subarea].slice(0);
    w_temp[subarea] = Width_[subarea].slice(0);
    d_temp[subarea] = Depth_[subarea].slice(0);
    x_temp[subarea] = Xarea_[subarea].slice(0);
    tl_temp[subarea] = Tot_Length_[subarea].slice(0);
    v_temp[subarea] = Vel_[subarea].slice(0);
    it_temp[subarea] = I_Time_[subarea].slice(0);
    tt_temp[subarea] = Tot_Time_[subarea].slice(0);

    t_[subarea] = Type_[subarea].slice(0);
    tt_[subarea] = Tot_Time_[subarea].slice(0);

    changetcmodal(t_[subarea],tt_[subarea])
    createtctable(subarea,Pixel_[subarea],Type_[subarea],Elev_[subarea],Slope_[subarea],AvgArea_[subarea],Width_[subarea],Depth_[subarea],Xarea_[subarea],Tot_Length_[subarea],Vel_[subarea],I_Time_[subarea],Tot_Time_[subarea])
}


function xs_add(){
    drawLayers.clearLayers();
    new L.Draw.Polyline(map, drawControl.options.polyline).enable();
}

function selectallprecip() {
    var j = 0;
    var checkboxes = document.getElementsByName('precepcheck');
    for(var i=0, n=checkboxes.length;i<n;i++) {
        if(checkboxes[i].checked){
            j++
    }}
    for(var i=0, n=checkboxes.length;i<n;i++) {
        if(j>0){
            checkboxes[i].checked = false
        } else {
            checkboxes[i].checked = true
    }}
}

function transect() {
    map.spin(true);
    var polylat = []
    var polylon = []
    var arrayOfPoints = layer.getLatLngs();
    for(var i=0, n=arrayOfPoints.length;i<n;i++) {
        polylat.push(arrayOfPoints[i].lat)
        polylon.push(arrayOfPoints[i].lng)
    };

    $('#addxs-button').attr('disabled','true');
    $('#addreservoir-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/Transect",
        useCors:false
      });
    var gpTask = gpService.createTask();

    var user_rs = document.getElementById('reach_slope').value
    var user_be = document.getElementById('bf_elev').value
    var user_cw = document.getElementById('bf_width').value
    var user_cd = document.getElementById('bf_depth').value

    gpTask.setParam("projectname",  full_project_name)
    gpTask.setParam("getlon",  JSON.stringify(polylon))
    gpTask.setParam("getlat",  JSON.stringify(polylat))
    gpTask.setParam("nmain_val", document.getElementById('xsmain_manning').value)
    gpTask.setParam("nleft_val", document.getElementById('xsleft_manning').value)
    gpTask.setParam("n_right_val", document.getElementById('xsright_manning').value)
    if(isNaN(user_rs)===false && user_rs){gpTask.setParam("user_rs", user_rs)}
    if(isNaN(user_be)===false && user_be){gpTask.setParam("user_be", user_be)}
    if(isNaN(user_cw)===false && user_cw){gpTask.setParam("user_cw", user_cw)}
    if(isNaN(user_cd)===false && user_cd){gpTask.setParam("user_cd", user_cd)}

    gpTask.run(transectCallback);

    function transectCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#addxs-button').removeAttr('disabled');
            $('#addreservoir-button').removeAttr('disabled');
            map.spin(false);
        }

        if(response.xs_validation === false){
            alertmodal("Invalid","Transect must be drawn into a routing reach","10vh")
        }else{
            plot_data = response.plot_data
            ratingtype = response.ratingtype
            minstage = response.minstage
            reachno = response.reachno
            ratingdata = response.ratingdata

            $("#tlw").html('<strong>' + parseFloat(totalDistance).toFixed(2) + ' ft</strong>');
            $("#maxelev").html('<strong>' + response.twe_max + ' ft</strong>');
            $("#minelev").html('<strong>' +  response.twe_min + ' ft</strong>');
            $("#uda").html('<strong>' + response.areami2_usda + ' mi<sup>2</sup></strong>');
            $("#rslp").html('<strong>' + response.reachslope + ' ft</strong>');
            $("#bfelev").html('<strong>' + minstage+ ' ft</strong>');
            $("#bcw").html('<strong>' + response.wbf + ' ft</strong>');
            $("#bcd").html('<strong>' + response.dbf + ' ft</strong>');
            $("#xsplotreachno").html(reachno);
            $("#xsinforeachno").html(reachno);

            document.getElementById("xs_output").style.display = "block";
            document.getElementById("rating_method").style.display = "none";
            window['transectline' + reachno] = new L.polyline(arrayOfPoints);
            map.addLayer(eval('transectline' + reachno));
        }
        drawLayers.clearLayers();
        map.spin(false);
        $('#addxs-button').removeAttr('disabled');
        $('#addreservoir-button').removeAttr('disabled');
    }
}

function xsplot_modal(){
    google.charts.load('current', {packages:['corechart']}).then(function () {

        $("#xsplot_modal").on('shown.bs.modal', function () {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'X');
            data.addColumn('number', 'Elevation');

            var datax = plot_data[0]
            var datay = plot_data[1]

            var datainput = []
            for(var i=0, n=plot_data[0].length;i<n;i++) {
                datainput.push(Array(datax[i],datay[i]))
            };
            data.addRows(datainput);
    
            var options = {
                height: 500,
                legend: 'none',
                hAxis: {title: 'Distance [ft]'},
                vAxis: {title: 'Elevation [ft]'}
            };
            var chart = new google.visualization.AreaChart(document.getElementById('chart_div_xs'));

            // Wait for the chart to finish drawing before calling the getImageURI() method.
            google.visualization.events.addListener(chart, 'ready', function () {
                chart_div_xs.innerHTML = '<img src="' + chart.getImageURI() + '">';
                console.log(chart_div_xs.innerHTML);
            });
            chart.draw(data, options);
        });
    });
    $("#xsplot_modal").modal()
}

function redoreach(){
    document.getElementById("xs_output").style.display = "none";
    document.getElementById("rating_method").style.display = "block";
    map.removeLayer(eval('transectline' + reachno));
}

function applyxsreach(){
    document.getElementById("xs_output").style.display = "none";
    document.getElementById("rating_method").style.display = "block";
    totalrating[reachno-1] = ratingdata
    totalreach[reachno-1] = reachno
    totaltype[reachno-1] = ratingtype
    totalstage[reachno-1] = minstage
    var filtered = totalreach.filter(Boolean);
    if(filtered.length == reachcount){
        alertmodal("Done","Reach control complete","10vh")
        sidebar.enablePanel('wintr20');
        sidebar.open('wintr20');
    }else{
        alertmodal("Done","Transect added","10vh")
    }
}

function reservoir_add(){
    delcheck = false;
    fpcheck = false;
    olcheck = false;
    rscheck = true;
    new L.Draw.Marker(map, drawControl.options.marker).enable();
}

function reservoir(){
    map.spin(true);
    mark_lat = layer.getLatLng().lat;
    mark_lon = layer.getLatLng().lng;

    $('#addxs-button').attr('disabled','true');
    $('#addreservoir-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/Reservoir",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname",  full_project_name)
    gpTask.setParam("getlon",  mark_lon)
    gpTask.setParam("getlat",  mark_lat)

    gpTask.run(transectCallback);

    function transectCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#addxs-button').removeAttr('disabled');
            $('#addreservoir-button').removeAttr('disabled');
            map.spin(false);
        }

        ratingtype = response.ratingtype
        reachno = response.rating
        minstage = response.reservoir_elev

        if(response.validate_reservoir){
            $("#reservoir_modal").modal()
            $("#structreachno").html(reachno);
            $("#structelev").html(minstage);
            $("#resinforeachno").html(reachno);
            $("#resplotreachno").html(reachno);
        }else{
            alertmodal("Invalid","Reservoir must be placed into a routing subwatershed","10vh")
            drawLayers.clearLayers();
        }
        map.spin(false);
        $('#addxs-button').removeAttr('disabled');
        $('#addreservoir-button').removeAttr('disabled');
    }
}

function applyresreach(){
    document.getElementById("reservoir_output").style.display = "none";
    document.getElementById("rating_method").style.display = "block";
    totalrating[reachno-1] = ratingdata
    totalreach[reachno-1] = reachno
    totaltype[reachno-1] = ratingtype
    totalstage[reachno-1] = minstage
    drawLayers.clearLayers();
    var filtered = totalreach.filter(Boolean);
    if(filtered.length == reachcount){
        alertmodal("Done","Reach control complete","10vh")
        sidebar.enablePanel('wintr20');
        sidebar.open('wintr20');
    }else{
        alertmodal("Done","Reservoir added","10vh")
    }
}

function redores(){
    drawLayers.clearLayers();
    document.getElementById("reservoir_output").style.display = "none";
    document.getElementById("rating_method").style.display = "block";
}

function resmodaladd(){
    document.getElementById("reservoir_output").style.display = "block";
    document.getElementById("rating_method").style.display = "none";
    tabledata = hot.getData()
    ratingdata = tabledata.filter(element => element.join("") != "");
}

function resplot_modal(){
    google.charts.load('current', {packages:['corechart']}).then(function () {

        $("#resplot_modal").on('shown.bs.modal', function () {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'X');
            data.addColumn('number', 'Discharge [cfs]');
            data.addColumn('number', 'Storage [ac-ft]');

            var datainput = []
            for(var i=0, n=tabledata.length;i<n;i++) {
                if (Number(tabledata[i][0]) != 0){
                    datainput.push(Array(Number(tabledata[i][0]),Number(tabledata[i][1]),Number(tabledata[i][2])))
                }
            };
            data.addRows(datainput);
    
            var options = {
                height: 500,
                legend: { position: 'bottom'},
                hAxis: {
                    title: 'Elevation [ft]',
                    viewWindow: {
                    min: Number(datainput[0][0]),
                    max: Number(datainput[datainput.length-1][0])
                    },
                },
                vAxis: {title: 'Flow-Storage [ft]'},
                colors: ['#0000FF', '#FF0000']
            };
            var chart = new google.visualization.LineChart(document.getElementById('chart_div_res'));

            // Wait for the chart to finish drawing before calling the getImageURI() method.
            google.visualization.events.addListener(chart, 'ready', function () {
                chart_div_res.innerHTML = '<img src="' + chart.getImageURI() + '">';
                console.log(chart_div_res.innerHTML);
            });
            chart.draw(data, options);
        });
    });
    $("#resplot_modal").modal()
}

var hot;
document.addEventListener("DOMContentLoaded", function() {
    var restable = document.getElementById('reservoirtable');
    hot = new Handsontable(restable, {
    rowHeaders: true,
    colHeaders: true,
    colHeaders: ['Stage [ft]', 'Discharge [cfs]', 'Storage [ac ft]'],
    colWidths: 120,
    width: '100%',
    height: 320,
    rowHeights: 23,
    startRows: 30,
    startCols: 3,
    });
});

function ratingtable(){
    
    var rating_html = '<table border="0" align="center">';
    rating_html += '<col width="100">';
    rating_html += '<col width="100">';
    rating_html += '<col width="100">';
    rating_html += '<tr align="center"><th>Stage<br/>[ft]</th>';
    rating_html += '<th>Discharge</br>[cfs]</th>';
    rating_html += '<th>Area<br/>[ft<sup>2</sup>]</th></tr>';
    for(var i=0; i < ratingdata.length; i++){
        rating_html += '<tr>';
        rating_html += '<td align="center">' + ratingdata[i][0] + '</td>';
        rating_html += '<td align="center">' + ratingdata[i][1]+ '</td>';
        rating_html += '<td align="center">' + ratingdata[i][2] + '</td>';
        rating_html += '</tr>';
    }
    rating_html += '</table><p></p>';

    var rating_modal = '<div class="modal-dialog" style="width:100%">';
    rating_modal +=     '<div class="modal-content">';
    rating_modal +=         '<div class="modal-header">';
    rating_modal +=             '<h4 class="modal-title">Rating Table ID: ' + reachno + '</h4>';
    rating_modal +=         '</div>'
    rating_modal +=         '<div class="modal-body">';
    rating_modal +=             rating_html
    rating_modal +=         '</div>';
    rating_modal +=         '<div class="modal-footer">';
    rating_modal +=             '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    rating_modal +=         '</div>';
    rating_modal +=     '</div>';
    rating_modal += '</div>';

    $("#rating_mod").html(rating_modal);
    $("#rating_mod").modal()

}

function precipitationdepth() {

    map.spin(true);
    $('#precipitation-button').attr('disabled','true');

    var j = 0;
    preciplist = []
    var checkboxes = document.getElementsByName('precepcheck');
    for(var i=0, n=checkboxes.length;i<n;i++) {
        if(checkboxes[i].checked){
            preciplist.push(i)
    }};

    upper90 = document.getElementById("upper90check").checked

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/PrecipitationDepths",
        useCors:false
      });
    var gpTask = gpService.createTask();
    
    gpTask.setParam("projectname",  full_project_name)
    gpTask.setParam("cb_list",  JSON.stringify(preciplist))
    gpTask.setParam("upper90",  upper90)

    gpTask.run(precipitationdepthCallback);

    function precipitationdepthCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#precipitation-button').removeAttr('disabled');
            map.spin(false);
        }

        thecritavg = response.thecritavg

        var checkboxes = document.getElementsByName('stormcheck');
        for(var i=0, n=preciplist.length;i<n;i++) {
            checkboxes[preciplist[i]].value = thecritavg[i]
            checkboxes[preciplist[i]].removeAttribute('disabled');
        };

        document.getElementById("tr20input").style.display = "block";
        $('#precipitation-button').removeAttr('disabled');
        document.getElementById("createwintr20-button").style.display = "block";
        document.getElementById("downloadwintr20error-button").style.display = "none";
        document.getElementById("downloadwintr20input-button").style.display = "none";
        document.getElementById("downloadwintr20output-button").style.display = "none";
        map.spin(false);
    }
}

function stormcheck(){
    var checkboxes = document.getElementsByName('stormcheck');
    for(var i=0, n=preciplist.length;i<n;i++) {
        thecritavg[i] = checkboxes[preciplist[i]].value
    };
}

function tr20controlpanel() {
    map.spin(true);
    $('#createwintr20-button').attr('disabled','true');

    totalrating = totalrating.filter(Boolean);
    totalreach = totalreach.filter(Boolean);
    totaltype = totaltype.filter(Boolean);
    totalstage = totalstage.filter(Boolean);

    var usertc = document.getElementById("usertcvalue").value

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/TR20Control",
        useCors:true,
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname", full_project_name)
    gpTask.setParam("main_increment", document.getElementById("dt_inc").value)
    gpTask.setParam("detail", document.getElementById("detailopt").checked)
    gpTask.setParam("arc", document.getElementById("arc").value)
    gpTask.setParam("arf", document.getElementById("arealreduction").checked)
    gpTask.setParam("delmarva", document.getElementById("peakrate").value)
    gpTask.setParam("cb_list", JSON.stringify(preciplist))
    gpTask.setParam("prec_user", JSON.stringify(thecritavg))
    gpTask.setParam("areami2",  areami2)
    gpTask.setParam("ratingtype", JSON.stringify(totaltype))
    gpTask.setParam("minstage", JSON.stringify(totalstage))
    gpTask.setParam("reachno", JSON.stringify(totalreach))
    gpTask.setParam("rating", JSON.stringify(totalrating))
    if(isNaN(usertc)===false && usertc){gpTask.setParam("usertc", usertc)}
    gpTask.setParam("upper90", document.getElementById("upper90check").checked)

    gpTask.run(tr20controlpanelCallback);

    function tr20controlpanelCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#createwintr20-button').removeAttr('disabled');
            map.spin(false);
        }

        inputstring = response.inputstring
        outputstring = response.outputstring
        errorstring = response.errorstring

        document.getElementById("createwintr20-button").style.display = "none";
        document.getElementById("downloadwintr20error-button").style.display = "block";
        document.getElementById("downloadwintr20input-button").style.display = "block";
        document.getElementById("downloadwintr20output-button").style.display = "block";

        if (errorstring != 'NA') {
            alertmodal("Warning","Please check error file for possible errors.","10vh")
        }

        map.spin(false);
    }
}

let saveFile = (strtofile, filename) => {

    let data = strtofile.replace(/\n/g,"\r\n")
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = filename;

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click();
}

function contours(){
    map.spin(true);
    contourlines.clearLayers();
    LC.removeLayer(contourlines);
    $('#contours-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/Contours",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname",  full_project_name)
    gpTask.setParam("interval", document.getElementById("contourint").value)
    gpTask.setParam("base", document.getElementById("contourbase").value)
    
    gpTask.run(contourCallback);

    function contourCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#contours-button').removeAttr('disabled');
            map.spin(false);
        }
        var contours = response.contours
        contourlines.addLayer(L.geoJson(contours,{
            color: '#606060',
            weight: 0.5,
        }));
        LC.addOverlay(contourlines, "Contours");
        $('#contours-button').removeAttr('disabled');
        map.spin(false);
    }
}

function infstreamload(){
    map.spin(true);
    $('#infstr-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/ShowStreams",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname",  full_project_name)
    
    gpTask.run(infstreamloadCallback);

    function infstreamloadCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#infstr-button').removeAttr('disabled');
            map.spin(false);
        }

        var infstreams_layer = response.infstr
        infstreams.addLayer(L.geoJson(infstreams_layer,{
            crossOrigin: null,
            fillColor: '#6666FF',
            fillOpacity: 0.5,
            weight: 0,
        }));
        LC.addOverlay(infstreams, "Inferred Streams");

        map.spin(false);
    }
};

function landuseload(){
    map.spin(true);
    $('#landuse-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/ShowStreams",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname",  full_project_name)
    
    gpTask.run(landuseloadCallback);

    function landuseloadCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#landuse-button').removeAttr('disabled');
            map.spin(false);
        }

        var landuse_layer = response.infstr
        landuselyr.addLayer(L.geoJson(landuse_layer,{
            crossOrigin: null,
            fillColor: '#6666FF',
            fillOpacity: 0.5,
            weight: 0,
        }));
        LC.addOverlay(landuselyr, "Land Use: " + basin_lu);

        map.spin(false);
    }
};

function longestpathload(){
    map.spin(true);
    $('#longestpath-button').attr('disabled','true');

    var gpService = L.esri.GP.service({
        url: "https://fittcoopgis.mbakerintl.com/arcgis/rest/services/UMD/UMDGISHydro/GPServer/ShowStreams",
        useCors:false
      });
    var gpTask = gpService.createTask();

    gpTask.setParam("projectname",  full_project_name)
    gpTask.setParam("subarea", document.getElementById("lpsubarea").value)
    
    gpTask.run(infprojCallback);

    function infprojCallback(error, response, raw){

        if (error){
            alertmodal("Error",errormsg,"10vh")
            $('#longestpath-button').removeAttr('disabled');
            map.spin(false);
        }

        var longestpath_layer = response.longestpath
        longestpathlyr.addLayer(L.geoJson(longestpath_layer,{
            crossOrigin: null,
            fillColor: '#6666FF',
            fillOpacity: 0.5,
            weight: 0,
        }));
        LC.addOverlay(longestpathlyr, "Longest Path: Subarea " + document.getElementById("lpsubarea").value);

        map.spin(false);
    }
};

function saveToFile(data, filename, element) {

    var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    document.getElementById(element).setAttribute('href', 'data:' + convertedData);
    document.getElementById(element).setAttribute('download', filename + '.geojson');
}

function style(feature) {
    return {
        crossOrigin: null,
        fillColor: '#FA6FFA',
        fillOpacity: 0.5,
        color: 'black',
        weight: 2,
    };
}

var highlight = {
    'fillColor': '#3AE5E5',
    'weight': 2,
    'color': 'black',
    'opacity': 1
};

function forEachFeature(feature, layer) {

    var popupContent = "<p><b>ID: </b>"+ feature.properties.ARCID +'</p>';

    layer.bindPopup(popupContent);

    layer.on("click", function (e) { 
        subwshed2.setStyle(style);
        layer.setStyle(highlight);
    }); 
}