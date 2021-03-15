"use strict";

function recalculatetc(){

    let average = (array) => array.reduce((a, b) => a + b) / array.length;

    if (document.getElementById("singleoverland").checked){
        single_overland = 1
    }
    if (document.getElementById("singleswale").checked){
        single_swale = 1
    }
    if (document.getElementById("singlechannel").checked){
        single_channel = 1
    }

    uppx = document.getElementById("vmuspx").value
    dwnpx = document.getElementById("vmdspx").value

    if (uppx == "" && dwnpx == ""){
        uppx = -1
        dwnpx = -1
    }else{
        uppx = parseInt(uppx)
        dwnpx = parseInt(dwnpx)
    }

    channeln = parseFloat(document.getElementById("channel_manning").value)
    overland_n = parseFloat(document.getElementById("sheet_manning").value)
    w_coef = parseFloat(document.getElementById("channel_width_coef").value)
    w_exp = parseFloat(document.getElementById("channel_width_exp").value)
    d_coef = parseFloat(document.getElementById("channel_depth_coef").value)
    d_exp = parseFloat(document.getElementById("channel_depth_exp").value)
    a_coef = parseFloat(document.getElementById("channel_area_coef").value)
    a_exp = parseFloat(document.getElementById("channel_area_exp").value)
    p2 = parseFloat(document.getElementById("sheet_precipitation").value)
    l_tc = parseFloat(document.getElementById("sheet_length").value)

    pixel_overland = Pixel[subid-1].slice(0,counts['overland']-1);
    type_overland = type[subid-1].slice(0,counts['overland']-1);
    mixed_overland = Mixed[subid-1].slice(0,counts['overland']-1);
    elev_overland = Elev[subid-1].slice(0,counts['overland']-1);
    slope_overland = Slope[subid-1].slice(0,counts['overland']-1);
    avgarea_overland = AvgArea[subid-1].slice(0,counts['overland']-1);
    width_overland = Width[subid-1].slice(0,counts['overland']-1);
    depth_overland = Depth[subid-1].slice(0,counts['overland']-1);
    xarea_overland = Xarea[subid-1].slice(0,counts['overland']-1);
    tot_length_overland = Tot_Length[subid-1].slice(0,counts['overland']-1);
    vel_overland = Vel[subid-1].slice(0,counts['overland']-1);
    tot_time_overland = Tot_Time[subid-1].slice(0,counts['overland']-1);

    pixel_swale = Pixel[subid-1].slice(counts['overland'],counts['swale']-1);
    type_swale = type[subid-1].slice(counts['overland'],counts['swale']-1);
    mixed_swale = Mixed[subid-1].slice(counts['overland'],counts['swale']-1);
    elev_swale = Elev[subid-1].slice(counts['overland'],counts['swale']-1);
    slope_swale = Slope[subid-1].slice(counts['overland'],counts['swale']-1);
    avgarea_swale = AvgArea[subid-1].slice(counts['overland'],counts['swale']-1);
    width_swale = Width[subid-1].slice(counts['overland'],counts['swale']-1);
    depth_swale = Depth[subid-1].slice(counts['overland'],counts['swale']-1);
    xarea_swale = Xarea[subid-1].slice(counts['overland'],counts['swale']-1);
    tot_length_swale = Tot_Length[subid-1].slice(counts['overland'],counts['swale']-1);
    vel_swale = Vel[subid-1].slice(counts['overland'],counts['swale']-1);
    tot_time_swale = Tot_Time[subid-1].slice(counts['overland'],counts['swale']-1);

    pixel_channel = Pixel[subid-1].slice(counts['overland'],counts['channel']-1);
    type_channel = type[subid-1].slice(counts['overland'],counts['channel']-1);
    mixed_channel = Mixed[subid-1].slice(counts['overland'],counts['channel']-1);
    elev_channel = Elev[subid-1].slice(counts['overland'],counts['channel']-1);
    slope_channel = Slope[subid-1].slice(counts['overland'],counts['channel']-1);
    avgarea_channel = AvgArea[subid-1].slice(counts['overland'],counts['channel']-1);
    width_channel = Width[subid-1].slice(counts['overland'],counts['channel']-1);
    depth_channel = Depth[subid-1].slice(counts['overland'],counts['channel']-1);
    xarea_channel = Xarea[subid-1].slice(counts['overland'],counts['channel']-1);
    tot_length_channel = Tot_Length[subid-1].slice(counts['overland'],counts['channel']-1);
    vel_channel = Vel[subid-1].slice(counts['overland'],counts['channel']-1);
    tot_time_channel = Tot_Time[subid-1].slice(counts['overland'],counts['channel']-1);

    dspx_overland = pixel_overland
    ilength_overland[0] = 0
    for(var i=0; j < pixel_overland.length; i++){
        uspx_overland[i] = pixel_overland[i]-1
        if(i>1){
            ilength_overland[i] = tot_length_overland[i]-tot_length_overland[i-1]
        }
    }
    dspx_swale = pixel_swale
    ilength_swale[0] = 0
    for(var i=0; j < pixel_swale.length; i++){
        uspx_swale[i] = pixel_swale[i]-1
        if(i>1){
            ilength_swale[i] = tot_length_swale[i]-tot_length_swale[i-1]
        }
    }
    dspx_channel = pixel_channel
    ilength_channel[0] = 0
    for(var i=0; j < pixel_channel.length; i++){
        uspx_channel[i] = pixel_channel[i]-1
        if(i>1){
            ilength_channel[i] = tot_length_channel[i]-tot_length_channel[i-1]
        }
    }

if (length(pixel_overland) != 0 && length(pixel_swale) != 0 && uppx < uspx_overland[uspx_overland.length-1] && dwnpx > dspx_overland[0] && uppx != -1){
    alert("Error: Up and Down pixel flow types are different. Please select up and down pixels of the same type.")
}
if (length(pixel_channel) != 0 && length(pixel_swale) != 0 && uppx < uspx_swale[uspx_swale.length-1] && dwnpx > dspx_channel[0] && uppx != -1){
    alert("Error: Up and Down pixel flow types are different. Please select up and down pixels of the same type.")
}

if (single_overland == 1 && length(pixel_overland) != 0){
    uppxl = uspx_overland[0]
    type = type_overland[0]
    dwpxl = dspx_overland[dspx_overland.length-1]
    avgarea = 0
    for(var i=0; i < pixel_overland.length; i++){
        avgarea = (dspx_overland[i] - uspx_overland[i]) * avgarea_overland[i] + avgarea
    }
    avgarea = avgarea / (dspx_overland[dspx_overland.length-1] - uspx_overland[0])
    upelev = elev_overland[0]
    dwnelev = elev_overland[elev_overland.length-1]
    ilength = ilength_overland.reduce(function(a, b){return a + b;}, 0);
    slope = (upelev - dwnelev) / ilength
    width = average(width_overland)
    depth = average(depth_overland)
    xarea = average(xarea_overland)
    totlength = ilength
    if (ilength > l_tc){
        iswale = ilength - l_tc
        vel_s = 16.1345 * (slope ** 0.5)
        if (!(document.getElementById("pavedopt").checked)){
            vel_s = 20.3282 * (slope ** 0.5)
        }
        swaletinc = iswale / (vel_s * 3600)
        overtinc = 0.007 * ((overland_n * l_tc) ** 0.8) / ((p2 ** 0.5) * (slope ** 0.4))
        itime = overtinc + swaletinc
        vel = ilength / (itime * 3600)
    } else {
        itime = 0.007 * ((overland_n * ilength) ** 0.8) / ((p2 ** 0.5) * (slope ** 0.4))
        vel = ilength / (itime * 3600)
    }
    tottime = itime
    if (vel == "" || vel == 0){
        vel = 0.001
    }
    dspx_overland = dwpxl;
    uspx_overland = uppxl;
    ilength_overland = ilength;
    type_overland = type;
    elev_overland = upelev;
    slope_overland = slope;
    avgarea_overland = avgarea;
    width_overland = width;
    depth_overland = depth;
    xarea_overland = xarea;
    tot_length_overland = totlength;
    vel_overland = vel;
    tot_time_overland = tottime;
}

if (single_swale == 1 && length(swale_list) != 0){
    uppxl = uspx_overland[0]
    type = type_overland[0]
    dwpxl = dspx_overland[dspx_overland.length-1]
    avgarea = 0
    for(var i=0; i < pixel_swale.length; i++){
        avgarea = (dspx_swale[i] - uspx_swale[i]) * avgarea_swale[i] + avgarea
    }
    avgarea = avgarea / (uspx_swale[uspx_swale.length-1] - dspx_swale[0])
    upelev = elev_swale[0]
    dwnelev = elev_swale[elev_swale.length-1]
    ilength = ilength_swale.reduce(function(a, b){return a + b;}, 0);
    slope = (upelev - dwnelev) / ilength
    width = average(width_swale)
    depth = average(width_swale)
    xarea = average(width_swale)
    if (length(pixel_overland) != 0){
        totlength = ilength + tot_length_swale[tot_length_overland.length-1]
    } else {
        totlength = ilength
    }
    vel = 16.1345 * slope ** 0.5
    if (!(document.getElementById("pavedopt").checked)){
        vel = 20.3282 * slope ** 0.5
    }
    if (np.isnan(vel) || vel == 0){
        vel = 0.001
    }
    itime = ilength / vel / 3600
    if (length(pixel_overland) != 0){
        tottime = itime + tot_time_overland[tot_time_overland.length-1])
    } else {
        tottime = itime
    }
    swale_list = [[[], shape, uppxl, [], type, dwpxl, avgarea, dsarea, upelev, dwnelev,
                    slope, width, depth, xarea, ilength, totlength, vel, itime, tottime]]
}

if (single_channel == 1 && length(channel_list) != 0){
    shape = channel_list[0][1]
    uppxl = float(channel_list[0][2])
    type = channel_list[0][4]
    dwpxl = float(channel_list[-1][5])
    avgarea = 0
    for col in channel_list:
        avgarea = (float(col[5]) - float(col[2])) * float(col[6]) + avgarea
    avgarea = avgarea / (float(channel_list[-1][5]) - float(channel_list[0][2]))
    dsarea = np.sum(map(float, [col[7] for col in channel_list]))
    upelev = float(channel_list[0][8])
    dwnelev = float(channel_list[-1][9])
    ilength = np.sum(map(float, [col[14] for col in channel_list]))
    slope = (upelev - dwnelev) / ilength
    width = w_coef * (avgarea ** w_exp)
    depth = d_coef * (avgarea ** d_exp)
    xarea = a_coef * (avgarea ** a_exp)
    if (length(swale_list) != 0){
        totlength = ilength + float(swale_list[-1][15])
    } else if (length(overland_list) != 0){
        totlength = ilength + float(overland_list[-1][15])
    } else {
        totlength = ilength
    }
    vel = 1.49 / channeln * (xarea / (width + 2 * depth)) ** (0.66667) * (slope ** 0.5)
    if (np.isnan(vel) || vel == 0){
        vel = 0.001
    }
    itime = ilength / vel / 3600
    if (length(swale_list) != 0){
        tottime = itime + float(swale_list[-1][18])
    } else if (length(overland_list) != 0){
        tottime = itime + float(overland_list[-1][18])
    } else {
        tottime = itime
    }

    channel_list = [[[], shape, uppxl, [], type, dwpxl, avgarea, dsarea, upelev, dwnelev,
                        slope, width, depth, xarea, ilength, totlength, vel, itime, tottime]]
}

if (len(overland_list) != 0 && length(swale_list) != 0){
    swale_list[0][15] = overland_list[-1][15] + swale_list[0][14]
    swale_list[0][18] = overland_list[-1][18] + swale_list[0][17]
    for i in range(len(swale_list) - 1):
        swale_list[i + 1][15] = swale_list[i + 1][14] + swale_list[i][15]
        swale_list[i + 1][18] = swale_list[i + 1][17] + swale_list[i][18]
}
if (len(channel_list) != 0 && length(swale_list) != 0)
    channel_list[0][15] = swale_list[-1][15] + channel_list[0][14]
    channel_list[0][18] = swale_list[-1][18] + channel_list[0][17]
    for i in range(len(channel_list) - 1):
        channel_list[i + 1][15] = channel_list[i + 1][14] + channel_list[i][15]
        channel_list[i + 1][18] = channel_list[i + 1][17] + channel_list[i][18]
} else if (len(channel_list) != 0 && length(overland_list) != 0){
    channel_list[0][15] = overland_list[-1][15] + channel_list[0][14]
    channel_list[0][18] = overland_list[-1][18] + channel_list[0][17]
    for i in range(len(channel_list) - 1):
        channel_list[i + 1][15] = channel_list[i + 1][14] + channel_list[i][15]
        channel_list[i + 1][18] = channel_list[i + 1][17] + channel_list[i][18]
}


