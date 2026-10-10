import React, {useRef, useState, useEffect, useContext} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {ClockStatusContext, ClockCoordsContext} from '../../../functions/Contexts';
import {NmLabel, LoadingScreen} from '../../../components';
import {APP_CONST, NmStyles} from '../../../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NmHardwareBackPress} from '../../../functions/NmFunctions';

export default function ClockLiveTracking(props) {
  const isFocused = useIsFocused();
  const mapRef = useRef();
  const clockedStatus = useContext(ClockStatusContext);
  const coordsContext = useContext(ClockCoordsContext);
  const insets = useSafeAreaInsets();

  const [userCoordsTracking, setUserCoordsTracking] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialRegion, setInitialRegion] = useState({
    latitude: 12.8797,
    longitude: 121.774,
    latitudeDelta: 14.5,
    longitudeDelta: 10.0,
  });

  NmHardwareBackPress();

  // For focusing in current user position
  useEffect(() => {
    if (isFocused) {
      if (mapRef.current && userCoordsTracking.length > 0) {
        mapRef.current.animateToRegion(
          {
            latitude: userCoordsTracking[userCoordsTracking.length - 1].latitude,
            longitude: userCoordsTracking[userCoordsTracking.length - 1].longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          },
          500,
        ); // The second argument is the animation duration in ms
      }
    }
  }, [isFocused]);

  const userCoordsRef = useRef(userCoordsTracking);

  useEffect(() => {
    userCoordsRef.current = userCoordsTracking;
  }, [userCoordsTracking]);

  useEffect(() => {
    setLoading(false);
    switch (clockedStatus) {
      case APP_CONST.NIT_NOTCLOCKED:
      case APP_CONST.NIT_CLOCKEDOUT: {
        setIsTracking(false);
        break;
      }
      case APP_CONST.NIT_CLOCKEDIN:
        setIsTracking(true);
        break;
    }
  }, [clockedStatus]);

  useEffect(() => {
    console.log('LT tracking', isTracking);

    if (isTracking) {
      const intervalId = setInterval(() => {
        getLocations();
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [isTracking]);

  useEffect(() => {
    if (coordsContext) {
      setInitialRegion({
        latitude: coordsContext.latitude,
        longitude: coordsContext.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  }, [coordsContext]);

  const getLocations = async () => {
    const storedLocations = await AsyncStorage.getItem(APP_CONST.NIT_TEMPSTORE);

    if (storedLocations) {
      setUserCoordsTracking(JSON.parse(storedLocations));
    }
  };

  function viewTrackingOverview() {
    mapRef?.current?.fitToCoordinates(userCoordsRef.current, {
      edgePadding: {
        right: 20,
        bottom: 20,
        left: 20,
        top: 20,
      },
    });
  }

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      <View
        style={{
          backgroundColor: '#FFF',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#5b5b5b4c',
          shadowOffset: {width: 0, height: 8},
          shadowRadius: 6,
          shadowOpacity: 0.2,
          elevation: 3,
          paddingBottom: 4,
          paddingTop: insets.top + 8,
        }}>
        <NmLabel style={[NmStyles.poppinsMedium, {fontSize: 20}]}>{'Live Tracking'}</NmLabel>
      </View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        region={initialRegion}
        showsUserLocation={!isTracking}
        showsMyLocationButton={true}
        loadingEnabled={true}
        followsUserLocation={true}
        //zoomEnabled={false}
        //rotateEnabled={false}
        //scrollEnabled={false}
        pitchEnabled={false}
        moveOnMarkerPress={false}>
        {isTracking == true && userCoordsTracking.length > 0 && (
          <>
            <Marker coordinate={userCoordsTracking[0]} anchor={{x: 0.5, y: 0.5}} title={'Clock in position'} description={'Tracking started here'} tracksViewChanges={false}>
              <View style={{width: 24, height: 24, backgroundColor: '#FFF', borderRadius: 30, alignItems: 'center', justifyContent: 'center', opacity: 1}}>
                <View style={{width: 18, height: 18, backgroundColor: '#00ff00ff', borderRadius: 30}}></View>
                {/* <MaterialCommunityIcons name={'map-marker'} size={20} color={'#00ff00ff'} /> */}
              </View>
            </Marker>
            {isTracking && (
              <Marker coordinate={userCoordsTracking[userCoordsTracking.length - 1]} anchor={{x: 0.5, y: 0.5}} title={'You'} description={'Your current position'} tracksViewChanges={false}>
                <View style={{width: 24, height: 24, backgroundColor: '#0e2bd4ff', borderRadius: 30, alignItems: 'center', justifyContent: 'center', opacity: 1}}>
                  <View style={{width: 18, height: 18, backgroundColor: '#FFF', borderRadius: 30, alignItems: 'center', justifyContent: 'center'}}>
                    <MaterialCommunityIcons name={'account-circle-outline'} size={14} color={'#0e2bd4ff'} />
                  </View>
                </View>
              </Marker>
            )}
          </>
        )}
        <Polyline
          coordinates={userCoordsTracking}
          strokeColor="#5eff00ff" // fallback for when `strokeColors` is not supported by the map-provider
          // strokeColors={[
          //   '#238C23',
          //   '#7F0000',
          // ]}
          strokeWidth={5}
        />
      </MapView>

      <View style={styles.breakControls}>
        <View style={[styles.breakButtons, {marginBottom: 10, backgroundColor: '#FFF', width: 138}]}>
          {/* #0aa6eeff */}
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.breakButtons, {backgroundColor: '#0540ffff', padding: 10, width: '100%', justifyContent: 'center', paddingVertical: 14}]}
            disabled={false}
            onPress={() => {
              viewTrackingOverview();
            }}>
            <MaterialCommunityIcons name={'map-marker-path'} color={'#FFF'} size={20} style={{}} />
            <NmLabel style={[NmStyles.poppinsMedium, {marginLeft: 10, marginRight: 4, marginBottom: -2, color: '#FFF', fontSize: 15}]} numberOfLines={1}>
              {'Overview'}
            </NmLabel>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  breakControls: {
    position: 'absolute',
    bottom: 10,
    right: 16,
  },
  breakButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 1.4, // Android specific elevation
      },
    }),
  },
});
