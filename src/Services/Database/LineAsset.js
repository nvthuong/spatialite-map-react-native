import React, { Component } from 'react';

formatPointGeomatry = (objGeom) => {
    let line = JSON.parse(objGeom.MultiLineString);
    geom = {
        coordinates: {
            latitude: line.coordinates[1],
            longitude: line.coordinates[0]
        },
        name: objGeom.Name,
        type: line.type
    }
    return geom;
}

parseJson = (array) => {
    if (array.length > 0) {
        myLineData = [];
        for (var i = 0; i < array.length; i++) {
            arrayLine = [];
            let line = JSON.parse(array[i].MultiLineString).coordinates[0];
            for (var j = 0; j < line.length; j++) {
                arrayLine.push({
                    latitude: line[j][1],
                    longitude: line[j][0]
                });
            }
            myLineData.push({
                coordinates: arrayLine
            });
        }
        return myLineData;
    }
}

export { parseJson }