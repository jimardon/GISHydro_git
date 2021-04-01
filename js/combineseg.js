function recalculatetc(){

    var sheetcheck = document.getElementById("singleoverland").checked
    var shallowcheck = document.getElementById("singleswale").checked
    var channelcheck = document.getElementById("singlechannel").checked

    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
    const arrSum = arr => arr.reduce((a,b) => a + b, 0)

    var subarea = document.getElementById("subtc").value -1
    var pixel = Pixel_[subarea]
    var elev = Elev_[subarea]
    var slope = Slope_[subarea]
    var avgarea = AvgArea_
    var width = Width_[subarea]
    var depth = Depth_[subarea]
    var xarea = Xarea_[subarea]
    var i_length = I_Length_[subarea]

    if(sheetcheck && shallowcheck == false && channelcheck == false){

        var pixelmerge = 1
        var elevmerge = parseFloat(arrAvg(elev.map(Number))).toFixed(2)
        var slopemerge = parseFloat(arrAvg(slope.map(Number))).toFixed(2)
        var avgareamerge = parseFloat(arrSum(avgarea.map(Number))).toFixed(2)
        var i_lengthmerge = parseFloat(arrSum(i_length.map(Number))).toFixed(2)

        var sheetn = parseFloat(document.getElementById("sheet_manning").value)
        var sheetp = parseFloat(document.getElementById("sheet_precipitation").value)
        var sheetl = parseFloat(document.getElementById("sheet_length").value)

        var i_timemerge = parseFloat(Math.pow(0.007*(sheetn*sheetl),0.8)/Math.pow(sheetp,0.5)/Math.pow(slopemerge,0.4)).toFixed(2)
        var velmerge = parseFloat(i_lengthmerge/i_timemerge).toFixed(2)

        alert([subarea,pixelmerge,"overland",elevmerge,slopemerge,avgareamerge,"-1","-1","-1",i_lengthmerge,velmerge,i_timemerge,i_timemerge])

        createtable(subarea,pixelmerge,"overland",elevmerge,slopemerge,avgareamerge,"-1","-1","-1",i_lengthmerge,velmerge,i_timemerge,i_timemerge)



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