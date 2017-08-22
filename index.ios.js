import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

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
                latitude: 20.993776,
                longitude: 105.811417,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            },
            markers: arrayMarkers,
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
        for (marker of this.state.markers) {
            markers.push(
                <MapView.Marker
                    key={marker.longitude}
                    title={'toi o day' + marker.latitude}
                    description={'day la mo ta'}
                    coordinate={marker}
                />
            )
        }

        return markers;
    }

    _findMe() {
        let array = [
            {
                latitude: 20.994623,
                longitude: 105.813052
            },
            {
                latitude: 20.992954,
                longitude: 105.812496
            },
            {
                latitude: 20.990930,
                longitude: 105.811875
            },
            {
                latitude: 20.999181,
                longitude: 105.812681
            },
            {
                latitude: 20.988950,
                longitude: 105.808418
            },
            {
                latitude: 20.992829,
                longitude: 105.809141
            },
        ];
        arrayMarkers.push({
            array
        });
        this.setState({
            markers: array
        })
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
                zIndex: 100
            }
        }

        return (
            <View style={styles.container}>

                <MapView style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={this.state.initialRegion}
                    style={[StyleSheet.absoluteFillObject, styles.map]}
                    onPress={this.onPress.bind(this)}
                >
                    {this.renderMarkers()}
                </MapView>

                <View style={bbStyle(varTop)}>
                    <TouchableOpacity
                        hitSlop={hitSlop}
                        activeOpacity={0.7}
                        style={styles.mapButton}
                        onPress={() => this._findMe()}
                    >
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>Search</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

AppRegistry.registerComponent("SpatiaLiteMapApp", () => DemoMapView);

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