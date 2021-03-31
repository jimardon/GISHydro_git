

function combinesegments(type, elev, slope, avgarea, width, depth, xarea, i_length){


    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
    const arrSum = arr => arr.reduce((a,b) => a + b, 0)

    if (type == 1){

        var pixelmerge = 1
        var elevmerge = arrAvg(elev.map(Number))
        var slopemerge = arrAvg(slope.map(Number))
        var avgareamerge = arrSum(avgarea.map(Number))
        var i_lengthmerge = arrSum(i_length.map(Number))

        var sheetn = parseFloat(document.getElementById("sheet_manning").value)
        var sheetp = parseFloat(document.getElementById("sheet_precipitation").value)
        var sheetl = parseFloat(document.getElementById("sheet_length").value)

        var i_timemerge = 0.007*(sheetn*sheetl)**0.8/sheetp**0.5/slopemerge**0.4
        var velmerge = i_lengthmerge/i_timemerge

        alert([subarea,segment[0],"overland",segment[1],segment[2],segment[3],segment[4],segment[5],segment[6],segment[6]])

        createtable(subarea,segment[0],"overland",segment[1],segment[2],segment[3],segment[4],segment[5],segment[6],segment[6])


    } else if (type == 2){



    } else {



    }

}