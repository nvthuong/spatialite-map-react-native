import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Asset from './Services/Database/PointAsset'
import db from 'react-native-spatialite';

export default class DemoMapView extends Component {
  constructor(props) {
    super(props);
    arrayMarkers = [
      {
        latitude: 20.993777,
        longitude: 105.811417,
      }
    ];
    arrayCoordinates = [
      {
        latitude: 20.993776,
        longitude: 105.811417,
      },
      {
        latitude: 20.993776,
        longitude: 105.822156,
      },
      {
        latitude: 20.994776,
        longitude: 105.822156,
      },
      {
        latitude: 20.999776,
        longitude: 105.832156,
      },
    ];
    this.state = {
      initialRegion: {
        latitude: 20,
        longitude: 105,
        latitudeDelta: 0.01,
        longitudeDelta: 0.001
      },
      markers: [],
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
    markers=[];
    for(marker of this.state.markers) {
      markers.push(
        <MapView.Marker
          coordinate={marker.coordinates}
        />
      )
    }
    return markers;
  }

  setSpatial = (array) => {
    mySpatialData = [];
    for(var i = 0; i < array.length; i ++){
      var geometry = JSON.parse(array[i]["POINT"]);
      geom = {
        latitude: geometry.coordinates[0],
        longitude: geometry.coordinates[1]
      };
      mySpatialData.push({
        type: geometry.type,
        coordinates: geom
      });
    }
    this.setState({markers: mySpatialData});
  }

  getPointAsset = () => {
    db.createConnection('work-asset.sqlite').then(connected => {
        console.log('Database is connected', connected);
    }).then(array => {
        return db.executeQuery('SELECT AsGeoJSON(Transform(Geometry, 4236)) as POINT FROM Towns LIMIT 100');
    }).then(rows => {
      this.setSpatial(rows);
    }).catch(err => {
        throw err;
    });
}

  _findMe(){
    this.getPointAsset();
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
     bbStyle = function(vheight) {
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
          initialRegion={this.state.initialRegion}
          style={[StyleSheet.absoluteFillObject, styles.map]}
          onPress={this.onPress.bind(this)}
        >

          {this.renderMarkers()}


        </MapView>

        <View style={bbStyle(varTop)}>
           <TouchableOpacity
             hitSlop = {hitSlop}
             activeOpacity={0.7}
             style={styles.mapButton}
             onPress={ () => this._findMe() }
           >
               <Text style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
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
     borderRadius: 85/2,
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