function recalculatetc(){

    tcmerged = true

    var subarea = document.getElementById("subtc").value -1
    var sheetcheck = document.getElementById("singleoverland").checked
    var shallowcheck = document.getElementById("singleswale").checked
    var channelcheck = document.getElementById("singlechannel").checked

    var t = '';
    var tt = '';

    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

    var occcounts = {}
    Type_[subarea].forEach(function(x) { occcounts[x] = (occcounts[x] || 0) + 1;});

    var pixel_sheet = Pixel_[subarea].slice(0,occcounts['overland'])
    var type_sheet = Type_[subarea].slice(0,occcounts['overland'])
    var elev_sheet = Elev_[subarea].slice(0,occcounts['overland'])
    var slope_sheet = Slope_[subarea].slice(0,occcounts['overland'])
    var avgarea_sheet = AvgArea_[subarea].slice(0,occcounts['overland'])
    var width_sheet = Width_[subarea].slice(0,occcounts['overland'])
    var depth_sheet = Depth_[subarea].slice(0,occcounts['overland'])
    var xarea_sheet = Xarea_[subarea].slice(0,occcounts['overland'])
    var tot_length_sheet = Tot_Length_[subarea].slice(0,occcounts['overland'])
    var vel_sheet = Vel_[subarea].slice(0,occcounts['overland'])
    var i_time_sheet = I_Time_[subarea].slice(0,occcounts['overland'])
    var tot_time_sheet = Tot_Time_[subarea].slice(0,occcounts['overland'])

    var pixel_shallow = Pixel_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var type_shallow = Type_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var elev_shallow = Elev_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var slope_shallow = Slope_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var avgarea_shallow = AvgArea_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var width_shallow = Width_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var depth_shallow = Depth_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var xarea_shallow = Xarea_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var tot_length_shallow = Tot_Length_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var vel_shallow = Vel_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var i_time_shallow = I_Time_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])
    var tot_time_shallow = Tot_Time_[subarea].slice(occcounts['overland'],occcounts['overland']+occcounts['swale'])

    var pixel_channel = Pixel_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var type_channel = Type_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var elev_channel = Elev_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var slope_channel = Slope_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var avgarea_channel = AvgArea_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var width_channel = Width_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var depth_channel = Depth_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var xarea_channel = Xarea_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var tot_length_channel = Tot_Length_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var vel_channel = Vel_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var i_time_channel = I_Time_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])
    var tot_time_channel = Tot_Time_[subarea].slice(occcounts['overland']+occcounts['swale'],occcounts['overland']+occcounts['swale']+occcounts['channel'])

    if(sheetcheck && shallowcheck == false && channelcheck == false){

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

        var tot_timemerge = [parseFloat(Math.pow(0.007*(sheetn*sheetl),0.8)/Math.pow(sheetp,0.5)/Math.pow(slopemerge[0],0.4)).toFixed(4)]
        var i_timemerge = [parseFloat(tot_timemerge[0]).toFixed(3)]
        var velmerge = [parseFloat(tot_lengthmerge[0]/tot_timemerge[0]/3600).toFixed(2)]

        t = typemerge.concat(type_shallow).concat(type_channel)
        e = elevmerge.concat(elev_shallow).concat(elev_channel)
        s = slopemerge.concat(slope_shallow).concat(slope_channel)
        a = avgareamerge.concat(avgarea_shallow).concat(avgarea_channel)
        w = widthmerge.concat(width_shallow).concat(width_channel)
        d = depthmerge.concat(depth_shallow).concat(depth_channel)
        x = xareamerge.concat(xarea_shallow).concat(xarea_channel)
        tl = tot_lengthmerge.concat(tot_length_shallow).concat(tot_length_channel)
        v = velmerge.concat(vel_shallow).concat(vel_channel)
        i = i_timemerge.concat(i_time_shallow).concat(i_time_channel)
        tt = tot_timemerge.concat(tot_time_shallow).concat(tot_time_channel)

        p = Array.from({length: t.length}, (_, i) => i + 1)

        changetcmodal(t,tt)

        createtctable(subarea,p,t,e,s,a,w,d,x,tl,v,i,tt)

    } else if (sheetcheck == false && shallowcheck && channelcheck == false){
        type = 2
    } else if (sheetcheck == false && shallowcheck == false && channelcheck){
        type = 3
    } else if (sheetcheck && shallowcheck && channelcheck == false){
        type = 4
    } else if (sheetcheck && shallowcheck == false && channelcheck){
        type = 5
    } else if (sheetcheck == false && shallowcheck && channelcheck){
        type = 6
    } else {
        type = 7
    }

    t_[subarea] = t;
    tt_[subarea] = tt;
}