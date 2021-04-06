function recalculatetc(){

    var type_sheet = "";
    var elev_sheet = "";
    var slope_sheet = "";
    var avgarea_sheet = "";
    var width_sheet = "";
    var depth_sheet = "";
    var xarea_sheet = "";
    var tot_length_sheet = "";
    var vel_sheet = "";
    var i_time_sheet = "";

    var type_shallow = "";
    var elev_shallow = "";
    var slope_shallow = "";
    var avgarea_shallow = "";
    var width_shallow = "";
    var depth_shallow = "";
    var xarea_shallow = "";
    var tot_length_shallow = "";
    var vel_shallow = "";
    var i_time_shallow = "";

    var type_channel = "";
    var elev_channel = "";
    var slope_channel = "";
    var avgarea_channel = "";
    var width_channel = "";
    var depth_channel = "";
    var xarea_channel = "";
    var tot_length_channel = "";
    var vel_channel = "";
    var i_time_channel = "";

    tcmerged = true

    var subarea = document.getElementById("subtc").value -1
    var sheetcheck = document.getElementById("singleoverland").checked
    var shallowcheck = document.getElementById("singleswale").checked
    var channelcheck = document.getElementById("singlechannel").checked

    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
    const cumulativeSum = arr => arr.reduce((a, x, i) => [...a, x + (a[i-1] || 0)], []);

    var occcounts_all = {}
    t_temp[subarea].forEach(function(x) { occcounts_all[x] = (occcounts_all[x] || 0) + 1;});

    function mergevalues(){
        var occcounts = {}
        t_temp[subarea].forEach(function(x) { occcounts[x] = (occcounts[x] || 0) + 1;});

        type_sheet = t_temp[subarea].slice(0,occcounts['overland'])
        elev_sheet = e_temp[subarea].slice(0,occcounts['overland'])
        slope_sheet = s_temp[subarea].slice(0,occcounts['overland'])
        avgarea_sheet = a_temp[subarea].slice(0,occcounts['overland'])
        width_sheet = w_temp[subarea].slice(0,occcounts['overland'])
        depth_sheet = d_temp[subarea].slice(0,occcounts['overland'])
        xarea_sheet = xa_temp[subarea].slice(0,occcounts['overland'])
        tot_length_sheet = tl_temp[subarea].slice(0,occcounts['overland'])
        vel_sheet = v_temp[subarea].slice(0,occcounts['overland'])
        i_time_sheet = it_temp[subarea].slice(0,occcounts['overland'])

        type_shallow = t_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        elev_shallow = e_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        slope_shallow = s_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        avgarea_shallow = a_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        width_shallow = w_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        depth_shallow = d_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        xarea_shallow = x_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        tot_length_shallow = tl_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        vel_shallow = v_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
        i_time_shallow = it_temp[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])

        type_channel = t_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        elev_channel = e_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        slope_channel = s_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        avgarea_channel = a_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        width_channel = w_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        depth_channel = d_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        xarea_channel = x_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        tot_length_channel = tl[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        vel_channel = v_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
        i_time_channel = it_temp[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    }

    function mergeoverland(){

        mergevalues()
        var typemerge = [type_sheet[type_sheet.length - 1]]
        var elevmerge = [parseFloat(arrAvg(elev_sheet.map(Number))).toFixed(1)]
        var slopemerge = [parseFloat(arrAvg(slope_sheet.map(Number))).toFixed(6)]
        var avgareamerge = [parseFloat(avgarea_sheet[avgarea_sheet.length - 1]).toFixed(6)]
        var widthmerge = [width_sheet[width_sheet.length - 1]]
        var depthmerge = [depth_sheet[depth_sheet.length - 1]]
        var xareamerge = [xarea_sheet[xarea_sheet.length - 1]]
        var tot_lengthmerge = [parseFloat(tot_length_sheet[tot_length_sheet.length - 1]).toFixed(1)]

        var sheetn = parseFloat(document.getElementById("sheet_manning").value)
        var sheetp = parseFloat(document.getElementById("sheet_precipitation").value)
        var sheetl = parseFloat(document.getElementById("sheet_length").value)

        var i_timemerge = [parseFloat(0.007*Math.pow((sheetn*sheetl),0.8)/Math.pow(sheetp,0.5)/Math.pow(slopemerge[0],0.4)).toFixed(4)]
        var velmerge = [parseFloat(tot_lengthmerge[0]/i_timemerge[0]/3600).toFixed(3)]

        p_temp = Array.from({length: t.length}, (_, i) => i + 1)
        t_temp = typemerge.concat(type_shallow).concat(type_channel)
        e_temp = elevmerge.concat(elev_shallow).concat(elev_channel)
        s_temp = slopemerge.concat(slope_shallow).concat(slope_channel)
        a_temp = avgareamerge.concat(avgarea_shallow).concat(avgarea_channel)
        w_temp = widthmerge.concat(width_shallow).concat(width_channel)
        d_temp = depthmerge.concat(depth_shallow).concat(depth_channel)
        x_temp = xareamerge.concat(xarea_shallow).concat(xarea_channel)
        tl_temp = tot_lengthmerge.concat(tot_length_shallow).concat(tot_length_channel)
        v_temp = velmerge.concat(vel_shallow).concat(vel_channel)
        it_temp = i_timemerge.concat(i_time_shallow).concat(i_time_channel)
        tt_temp = cumulativeSum(i.map(Number))
        tt_temp = tt.map(arr=>arr.toFixed(4))
    }

    function mergeswale(){

        mergevalues()
        var typemerge = [type_shallow[type_shallow.length - 1]]
        var elevmerge = [parseFloat(arrAvg(elev_shallow.map(Number))).toFixed(1)]
        var slopemerge = [parseFloat(arrAvg(slope_shallow.map(Number))).toFixed(6)]
        var avgareamerge = [parseFloat(avgarea_shallow[avgarea_shallow.length - 1]).toFixed(6)]
        var widthmerge = [width_shallow[width_shallow.length - 1]]
        var depthmerge = [depth_shallow[depth_shallow.length - 1]]
        var xareamerge = [xarea_shallow[xarea_shallow.length - 1]]
        var tot_lengthmerge = [parseFloat(tot_length_shallow[tot_length_shallow.length - 1]).toFixed(1)]

        var paved_const = 20.3282
        if(document.getElementById("unpavedopt").checked){paved_const = 16.1345}

        var velmerge = [parseFloat(paved_const*Math.pow(slopemerge[0],0.5)).toFixed(3)]
        var i_timemerge = [parseFloat(tot_lengthmerge[0]/velmerge[0]).toFixed(4)]

        p_temp = Array.from({length: t.length}, (_, i) => i + 1)
        t_temp = type_sheet.concat(typemerge).concat(type_channel)
        e_temp = elev_sheet.concat(elevmerge).concat(elev_channel)
        s_temp = slope_sheet.concat(slopemerge).concat(slope_channel)
        a_temp = avgarea_sheet.concat(avgareamerge).concat(avgarea_channel)
        w_temp = width_sheet.concat(widthmerge).concat(width_channel)
        d_temp = depth_sheet.concat(depthmerge).concat(depth_channel)
        x_temp = xarea_sheet.concat(xareamerge).concat(xarea_channel)
        tl_temp = tot_length_sheet.concat(tot_lengthmerge).concat(tot_length_channel)
        v_temp = vel_sheet.concat(velmerge).concat(vel_channel)
        it_temp = i_time_sheet.concat(i_timemerge).concat(i_time_channel)
        tt_temp = cumulativeSum(i.map(Number))
        tt_temp = tt.map(arr=>arr.toFixed(4))
    }

    function mergechannel(){

        mergevalues()
        var typemerge = [type_channel[type_channel.length - 1]]
        var elevmerge = [parseFloat(arrAvg(elev_channel.map(Number))).toFixed(1)]
        var slopemerge = [parseFloat(arrAvg(slope_channel.map(Number))).toFixed(6)]
        var avgareamerge = [parseFloat(avgarea_channel[avgarea_channel.length - 1]).toFixed(6)]
        var widthmerge = [parseFloat(arrAvg(width_channel.map(Number))).toFixed(2)]
        var depthmerge = [parseFloat(arrAvg(depth_channel.map(Number))).toFixed(2)]
        var xareamerge = [parseFloat(arrAvg(xarea_channel.map(Number))).toFixed(2)]
        var tot_lengthmerge = [parseFloat(tot_length_channel[tot_length_channel.length - 1]).toFixed(1)]

        var channeln = parseFloat(document.getElementById("channel_manning").value)

        var velmerge = [parseFloat(1.49*Math.pow(xareamerge[0]/(2*depthmerge[0]+widthmerge[0]),2/3)*Math.pow(slopemerge[0],0.5)/channeln).toFixed(3)]
        var i_timemerge = [parseFloat(tot_lengthmerge[0]/velmerge[0]).toFixed(4)]

        p_temp = Array.from({length: t.length}, (_, i) => i + 1)
        t_temp = type_sheet.concat(type_shallow).concat(typemerge)
        e_temp = elev_sheet.concat(elev_shallow).concat(elevmerge)
        s_temp = slope_sheet.concat(slope_shallow).concat(slopemerge)
        a_temp = avgarea_sheet.concat(avgarea_shallow).concat(avgareamerge)
        w_temp = width_sheet.concat(width_shallow).concat(widthmerge)
        d_temp = depth_sheet.concat(depth_shallow).concat(depthmerge)
        x_temp = xarea_sheet.concat(xarea_shallow).concat(xareamerge)
        tl_temp = tot_length_sheet.concat(tot_length_shallow).concat(tot_lengthmerge)
        v_temp = vel_sheet.concat(vel_shallow).concat(velmerge)
        it_temp = i_time_sheet.concat(i_time_shallow).concat(i_timemerge)
        tt_temp = cumulativeSum(i.map(Number))
        tt_temp = tt.map(arr=>arr.toFixed(4))
    }

    if (sheetcheck && shallowcheck == false && channelcheck == false && occcounts_all['overland'] > 1){
        mergeoverland()
    }
    else if (sheetcheck == false && shallowcheck && channelcheck == false && occcounts_all['swale'] > 1){
        mergeswale()
    }
    else if (sheetcheck == false && shallowcheck == false && channelcheck && occcounts_all['channel'] > 1){
        mergechannel()
    }
    else if (sheetcheck && shallowcheck && channelcheck == false && (occcounts_all['overland'] > 1 || occcounts_all['swale'] > 1)){
        mergeoverland()
        mergeswale()
    }
    else if (sheetcheck && shallowcheck == false && channelcheck && (occcounts_all['overland'] > 1 || occcounts_all['channel'] > 1)){
        mergeoverland()
        mergechannel()
    }
    else if (sheetcheck == false && shallowcheck && channelcheck && (occcounts_all['swale'] > 1 || occcounts_all['channel'] > 1)){
        mergeswale()
        mergechannel()
    }
    else if (sheetcheck && shallowcheck && channelcheck && (occcounts_all['overland'] > 1 || occcounts_all['swale'] > 1 || occcounts_all['channel'] > 1)){
        mergeoverland()
        mergeswale()
        mergechannel()
    }

    changetcmodal(t_temp,tt_temp)
    createtctable(subarea,p_temp,t_temp,e_temp,s_temp,a_temp,w_temp,d_temp,x_temp,tl_temp,v_temp,it_temp,tt_temp)

    t_[subarea] = t_temp;
    tt_[subarea] = tt_temp;
}