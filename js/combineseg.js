

function combinesegments(subarea,type, elev, slope, avgarea, width, depth, xarea, i_length){


    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
    const arrSum = arr => arr.reduce((a,b) => a + b, 0)

    if (type == 1){

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

        alert([subarea,pixelmerge,"overland",elevmerge,slopemerge,avgareamerge,i_lengthmerge,velmerge,i_timemerge,i_timemerge])

        createtable(subarea,pixelmerge,"overland",elevmerge,slopemerge,avgareamerge,"-1","-1","-1",i_lengthmerge,velmerge,i_timemerge,i_timemerge)

    } else if (type == 2){



    } else {



    }

}