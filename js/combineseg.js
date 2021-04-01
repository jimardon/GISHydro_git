function recalculatetc(){

    var sheetcheck = document.getElementById("singleoverland").checked
    var shallowcheck = document.getElementById("singleswale").checked
    var channelcheck = document.getElementById("singlechannel").checked

    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
    const arrSum = arr => arr.reduce((a,b) => a + b, 0)

    var subarea = document.getElementById("subtc").value -1
    var pixel = Pixel_[subarea]
    var type = Type_[subarea]
    var elev = Elev_[subarea]
    var slope = Slope_[subarea]
    var avgarea = AvgArea_[subarea]
    var width = Width_[subarea]
    var depth = Depth_[subarea]
    var xarea = Xarea_[subarea]
    var tot_length = Tot_Length_[subarea]

    if(sheetcheck && shallowcheck == false && channelcheck == false){

        type.forEach(function(x) { occcounts[x] = (occcounts[x] || 0)+1; });

        var pixelmerge = [1]
        var typemerge = ["overland"]
        var elevmerge = [parseFloat(arrAvg(elev.slice(0,occcounts['overland']-1).map(Number))).toFixed(1)]
        var slopemerge = [parseFloat(arrAvg(slope.slice(0,occcounts['overland']-1).map(Number))).toFixed(6)]
        var avgareamerge = [parseFloat(avgarea[occcounts['overland']-1]).toFixed(6)]
        var widthmerge = ["-1"]
        var depthmerge = ["-1"]
        var xareamerge = ["-1"]
        var tot_lengthmerge = [parseFloat(tot_length[occcounts['overland']-1]).toFixed(1)]

        var sheetn = parseFloat(document.getElementById("sheet_manning").value)
        var sheetp = parseFloat(document.getElementById("sheet_precipitation").value)
        var sheetl = parseFloat(document.getElementById("sheet_length").value)

        var i_timemerge = [parseFloat(Math.pow(0.007*(sheetn*sheetl),0.8)/Math.pow(sheetp,0.5)/Math.pow(slopemerge,0.4)).toFixed(3)]
        var velmerge = [parseFloat(tot_lengthmerge/i_timemerge/3600).toFixed(2)]

        alert([subarea,pixelmerge,typemerge,elevmerge,slopemerge,avgareamerge,widthmerge,depthmerge,xareamerge,tot_lengthmerge,velmerge,i_timemerge,i_timemerge])

        createtable(subarea,pixelmerge,typemerge,elevmerge,slopemerge,avgareamerge,widthmerge,depthmerge,xareamerge,tot_lengthmerge,velmerge,i_timemerge,i_timemerge)



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

}