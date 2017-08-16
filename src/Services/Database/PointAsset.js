import React, { Component } from 'react';
import { View, Text } from 'react-native';
import db from 'react-native-spatialite';
getPointAsset = () => {
    db.createConnection('work-asset.sqlite').then(connected => {
        console.log('Database is connected', connected);
    }).then(array => {
        return db.executeQuery('SELECT AsGeoJSON(Geometry) FROM Towns');
    }).then(rows => {
        return ({ rows });
        console.log({ rows });
    }).catch(err => {
        throw err;
    });
}
getString = () => {
    return 'string value';
}
export {getPointAsset, getString};


