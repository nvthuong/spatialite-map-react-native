import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Point from './Services/Database/PointAsset'
import * as Line from './Services/Database/LineAsset'
import * as Utils from './Helpers/Utils'
import db from 'react-native-spatialite';

export default class DemoMapView extends Component {
  constructor(props) {
    super(props);
    arrayMarkers = [
      {
        latitude: 40.70357700093293,
        longitude: -74.01504699999998
      }
    ];
    arrayCoordinates = [[
      {
        latitude: 40.70321400093293,
        longitude: -74.01502799999997
      },
      {
        latitude: 40.7025060009329,
        longitude: -74.01488899999998
      },
      {
        latitude: 40.70207700093289,
        longitude: -74.01472199999995
      },
      {
        latitude: 40.70183300093296,
        longitude: -74.11456799999993
      },
    ],
    [
      {
        latitude: 40.775036,
        longitude: -73.912034
      },
      {
        latitude: 40.755036,
        longitude: -73.912034
      },
      {
        latitude: 40.771036,
        longitude: -73.902034
      },
      {
        latitude: 40.275036,
        longitude: -73.942034
      }
    ]
    ];
    this.state = {
      initialRegion: {
        latitude: 40.70357700093293,
        longitude: -74.01504699999998,
        latitudeDelta: 0.4,
        longitudeDelta: 0.4
      },
      markers: [],
      lines: [],
      polygons: [],
      currentRegion: '',
      coordinates: arrayCoordinates,
    }
  }

  onPress(data) {
    let latitude = data.nativeEvent.coordinate.latitude;
    let longitude = data.nativeEvent.coordinate.longitude;
    console.log(latitude);
    arrayMarkers.push({
      latitude: latitude,
      longitude: longitude,
    });
    this.setState({
      markers: arrayMarkers
    })
  }

  renderMarkers() {
    markers = [];
    i = 0;
    for (marker of this.state.markers) {
      markers.push(
        <MapView.Marker
          key={i++}
          title={marker.name}
          description={'lat: ' + marker.coordinates.latitude + ' log: ' + marker.coordinates.longitude}
          coordinate={marker.coordinates}
        />
      )
    }
    return markers;
  }

  renderPolygons() {
    lines = [];
    if(this.state.lines != null){
      i = 0;
      for(line of this.state.lines){
        lines.push(
          <MapView.Polygon
            key={i++}
            coordinates={line.coordinates}
            strokeColor="#b300b3"
            fillColor="#F00"
            strokeWidth={1}
          />
        );
      }
    }
    return lines;
  }


  // /////////////////////////////////// Marker /////////////
  setMarker = (array) => {
    this.setState({ markers: Point.parseJson(array) });
  }
  getMarker = () => {
    db.createConnection('spatialdb.sqlite').then(connected => {
      console.log('Database is connected', connected);
    }).then(array => {
      return db.executeQuery('SELECT Station_Name as Name, AsGeoJSON(geom) as Point FROM geom_point_2012 WHERE ROWID IN' +
        ' (SELECT rowid FROM cache_geom_point_2012_geom WHERE' +
        ' mbr = FilterMbrWithin(' + this.state.currentRegion + '))');
    }).then(rows => {
      this.setMarker(rows);
      db.closeConnection();
      this.getMultiLine();
    }).catch(err => {
      throw err;
    });
  }
  // /////////////////////////////////// MultiLine /////////////
  setMultipleLine = (array) => {
    this.setState({ lines: Line.parseJson(array) });
  }
  getMultiLine = () => {
    db.createConnection('spatialdb.sqlite').then(connected => {
      console.log('Database is connected', connected);
    }).then(array => {
      return db.executeQuery('SELECT Line as Name, AsGeoJSON(geom) as MultiLineString FROM "geom_lines_2010" limit 10');
    }).then(rows => {
      this.setMultipleLine(rows);
      db.closeConnection();
    }).catch(err => {
      throw err;
    });
  }

  onRegionChangeComplete = (region) => {
    console.log(region);
    let currentRegion =
      (region.longitude - (region.longitudeDelta / 2)) + ',' +
      (region.latitude + (region.latitudeDelta / 2)) + ',' +
      (region.longitude + (region.longitudeDelta / 2)) + ',' +
      (region.latitude - (region.latitudeDelta / 2));
    this.setState({ currentRegion: currentRegion });
    console.log(currentRegion);
  }

  _findMe() {
    // let values = [];
    // values = Asset.getPoint();
    this.getMarker();
  }

  render() {
    const { height: windowHeight } = Dimensions.get('window');
    const varTop = windowHeight - 125;
    const hitSlop = {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15,
    }
    bbStyle = function (vheight) {
      return {
        position: 'absolute',
        top: vheight,
        left: 10,
        right: 10,
        backgroundColor: 'transparent',
        alignItems: 'center',
      }
    }

    return (
      <View style={styles.container}>

        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.initialRegion}
          style={[StyleSheet.absoluteFillObject, styles.map]}
          onPress={this.onPress.bind(this)}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {this.renderMarkers()}
          {this.renderPolygons()}

        </MapView>
        <View style={bbStyle(varTop)}>
          <TouchableOpacity
            hitSlop={hitSlop}
            activeOpacity={0.7}
            style={styles.mapButton}
            onPress={() => this._findMe()}
          >
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
              Search
               </Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    zIndex: 1,
  },
  mapButton: {
    width: 75,
    height: 75,
    borderRadius: 85 / 2,
    backgroundColor: 'rgba(252, 253, 253, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowRadius: 8,
    shadowOpacity: 0.12,
    opacity: .6,
    zIndex: 10,
  },
});
AppRegistry.registerComponent("SpatiaLiteMapApp", () => DemoMapView);