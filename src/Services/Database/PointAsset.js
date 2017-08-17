import React, { Component } from 'react';
import { View, Text } from 'react-native';
import db from 'react-native-spatialite';

setSpatial = (array) => {
    mySpatialData = [];
    for (var i = 0; i < array.length; i++) {
        var geometry = JSON.parse(array[i]["Point"]);
        var name = array[i]["Name"];
        geom = {
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0]
        };
        mySpatialData.push({
            name: name,
            type: geometry.type,
            coordinates: geom
        });
    }
    db.closeConnection();
    return mySpatialData;
}
getPoint = () => {
    db.createConnection('spatialdb.sqlite').then(connected => {
        console.log('Database is connected', connected);
    }).then(array => {
        return db.executeQuery('SELECT Station_Name as Name, AsGeoJSON(geom) as Point FROM geom_point_2012');
    }).then(rows => {
        this.setSpatial(rows);
    }).catch(err => {
        throw err;
    });
}

getString = () => {
    return 'string value';
}
export { getPoint };


