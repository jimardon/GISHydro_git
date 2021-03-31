

function combinesegments(type, subarea, pixel, elev, slope, width, depth, xarea, i_length){


    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
    const arrSum = arr => arr.reduce((a,b) => a + b, 0)

    if (type == 1){

        pixelmerge = 1
        elevmerge = arrAvg(elev[subarea].map(Number))
        slopemerge = arrAvg(slope[subarea].map(Number))
        i_lengthmerge = arrSum(i_length[subarea].map(Number))

        sheetn = parseFloat(document.getElementById("sheet_manning").value)
        sheetp = parseFloat(document.getElementById("sheet_precipitation").value)
        sheetl = parseFloat(document.getElementById("sheet_length").value)

        i_timemerge = 0.007*(sheetn*sheetl)**0.8/sheetp**0.5/slopemerge**0.4
        velmerge = i_lengthmerge/i_timemerge

        return(pixelmerge, elevmerge, slopemerge, i_lengthmerge, velmerge, i_timemerge)

    } else if (type == 2){



    } else {



    }

}