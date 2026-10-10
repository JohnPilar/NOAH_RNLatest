import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, Image, PermissionsAndroid, TextInput, TouchableOpacity} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Animated, {FadeInRight, FadeOutLeft} from 'react-native-reanimated';

import {LoadingPanel, LoadingScreen, NmModal} from '../../components';
import NmStyles from '../../constants/NmStyles';
import NmColors from '../../constants/NmColors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NmHardwareBackPress, NmGetGeoAddress} from '../../functions/NmFunctions';
import {Animations} from 'react-native-modal';

const MapViewer = (props: any): React.JSX.Element => {
  const currentCoords = props?.route?.params?.currentCoords;
  const origin = props?.route?.params?.origin;
  const CustomMarker = require('../../assets/Icons/custom_marker.png');

  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  const [searchValue, setSearchValue] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);

  const [showMarker, setShowMarker] = useState<boolean>(false);
  const [markerAddress, setMarkerAddress] = useState<any>('');

  const [POIClicked, setPOIClicked] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  const defaultLocOptions = [
    {
      id: 'LOC_CURRENT',
      long_name: 'Use current location',
      coords: {lat: '', long: ''},
      icon: 'crosshairs-gps',
    },
    {
      id: 'LOC_CHOOSE',
      long_name: 'Choose on map',
      coords: {lat: '', long: ''},
      icon: 'map-marker-radius-outline',
    },
  ]; //map-marker-outline

  const [searchResults, setSearchResults] = useState<string[]>(['Use current location']);

  const [initialRegion, setInitialRegion] = useState({
    latitude: 12.0526121,
    longitude: 122.0956716,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const [pressedLocation, setPressedLocation] = useState({
    latitude: 12.1410707,
    longitude: 122.9396902,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  NmHardwareBackPress((): boolean => {
    if (showMap == true) {
      setShowMap(false);
    } else {
      props.navigation.goBack();
    }
    return true;
  });

  const requestLocationPermission = async (): Promise<void> => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'NOAH',
        message: 'Allow app to access location to determine your current location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await refreshLocation();
      } else {
        //cannot continue due to declined permission request
      }
    } catch (err) {
      console.warn(err);
    }
  };

  async function refreshLocation(): Promise<void> {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const {latitude, longitude} = position.coords;
    setInitialRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0421,
      longitudeDelta: 0.001,
    });

    if (currentCoords != undefined) {
      setInitialRegion({
        latitude: currentCoords.latitude,
        longitude: currentCoords.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    }
  }

  function showMarkerLocation(eventObj: any): void {
    const coords = eventObj.coordinate;

    const placeName = eventObj?.name == undefined ? '' : eventObj.name.replace(/\n/g, ' ');

    setPressedLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0421,
      longitudeDelta: 0.0421,
    });

    NmGetGeoAddress(coords.latitude, coords.longitude).then((res: any) => {
      if (res.status == 'OK') {
        let cleanAddress = getCleanAddress(res);

        if (placeName != undefined) {
          cleanAddress = cleanAddress.replace(placeName, '');
        }

        if (cleanAddress.startsWith(',')) {
          cleanAddress = cleanAddress.substring(1);
        }

        setMarkerAddress({locName: placeName, locAddress: cleanAddress.trim()});
        setShowMarker(true);
        return;
      } else {
        setMarkerAddress({locName: '', locAddress: 'Cannot provide location details'});
      }
    });
  }

  function getCurrentLocationInfo(): void {
    setLoading(true);

    NmGetGeoAddress(initialRegion.latitude.toString(), initialRegion.longitude.toString()).then((res: any) => {
      if (res.status == 'OK') {
        props.navigation.navigate({
          name: origin.screen,
          params: {[origin.input]: {placeInfo: {locName: '', locAddress: res.formattedAddress}, latitude: initialRegion.latitude, longitude: initialRegion.longitude}},
          merge: false,
        });
        return;
      } else {
        setLoading(false);
        setErrMessage('Error: Current location cannot be located.');
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 3000);
      }
    });
  }

  const getCleanAddress = (response: any): string => {
    const plusCodeObj = response.results[0].address_components.filter((item: any) => item.types[0] == 'plus_code');
    let cleanAddress = response.results[0].formatted_address;

    if (plusCodeObj.length > 0) {
      if (cleanAddress.indexOf(plusCodeObj[0].long_name) > 0) {
        cleanAddress = cleanAddress.replace(plusCodeObj[0].long_name.concat(', '), '');
      } else {
        cleanAddress = cleanAddress.replace(plusCodeObj[0].long_name, '');
      }
    }

    if (cleanAddress.startsWith(',')) {
      cleanAddress = cleanAddress.substring(1);
    }

    return cleanAddress.trim();
  };

  const renderItem = ({item}: any): React.JSX.Element => {
    const defaultOps = item?.id == undefined ? false : true;

    return (
      <View style={{width: '100%', paddingHorizontal: 16}}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (item?.id == 'LOC_CHOOSE') {
              setShowMap(true);
            }

            if (item?.id == 'LOC_CURRENT') {
              getCurrentLocationInfo();
            }
          }}
          style={{borderRadius: 12, backgroundColor: '#FFF', padding: 5, paddingVertical: 10, flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
          <MaterialCommunityIcons style={{padding: 10}} name={item.icon} size={26} color={'#133561'} />
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Medium', fontSize: 16}} numberOfLines={1}>
              {item.long_name}
            </Text>
            {!defaultOps && (
              <Text style={{color: '#000', fontFamily: 'Poppins-Regular'}} numberOfLines={1}>
                {'Address here'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, width: '100%', height: '100%', paddingTop: useSafeAreaInsets().top, backgroundColor: '#FFF'}}>
      {loading && <LoadingScreen />}
      <NmModal winVisible={modalVisible} setWinVisible={setModalVisible} customView={true} customAnimate={true} customAnimateIn={'fadeIn'} customAnimateOut={'fadeOut'}>
        <View style={{flex: 1, paddingHorizontal: 16, justifyContent: 'flex-end', alignItems: 'center'}}>
          <View style={{marginBottom: '20%', backgroundColor: 'white', paddingHorizontal: 16, borderRadius: 6, paddingVertical: 5, alignItems: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 14}}>{errMessage}</Text>
          </View>
        </View>
      </NmModal>

      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Search Location'}</Text>
      </View>

      {!showMap && (
        <View style={{flex: 1}}>
          <View style={{width: '100%', paddingHorizontal: 16, paddingBottom: 10, backgroundColor: '#FFF'}}>
            <View style={[NmStyles.textInputContainer, {borderRadius: 12, borderWidth: 0, marginRight: 16, backgroundColor: '#EEE'}]}>
              <View style={{paddingLeft: 10, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <MaterialCommunityIcons style={{paddingHorizontal: 0}} name={'magnify'} size={30} color={'#CCC'} />
              </View>
              <TextInput
                style={[NmStyles.textInput, {marginLeft: -2}]}
                placeholderTextColor={NmColors.placeholderTextColor}
                onChangeText={value => setSearchValue(value)}
                value={searchValue}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                returnKeyType="search"
                placeholder="Search location"
                onSubmitEditing={() => {
                  //setSearching(true);
                }}
              />
            </View>
          </View>

          <View style={{flex: 1, width: '100%'}}>
            {searching && <LoadingPanel panelStyle={{backgroundColor: '#EEE', position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 1}} />}
            <FlatList data={defaultLocOptions} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} style={{marginTop: 10}} />
          </View>
        </View>
      )}

      {showMap && (
        <View style={{flex: 1, width: '100%'}}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{flex: 1}}
            region={initialRegion}
            showsUserLocation={true}
            onLongPress={event => {
              showMarkerLocation(event.nativeEvent);
              setPOIClicked(false);
            }}
            onPress={event => {
              if (showMarker == true || POIClicked == true) {
                setShowMarker(false);
                setPOIClicked(false);
              }
            }}
            onPoiClick={event => {
              //get name and coords when you want to display info,
              showMarkerLocation(event.nativeEvent);
              setPOIClicked(true);

              // console.log('coords:', event.nativeEvent.coordinate);
              // console.log('place name:', event.nativeEvent.name);
              // console.log('place id:', event.nativeEvent.placeId);
            }}
            onRegionChangeComplete={event => {
              //console.log(event);
            }}>
            {/* <Marker key={0} title={'Your current location'} coordinate={{latitude: initialRegion.latitude, longitude: initialRegion.longitude}}>
              <Image source={CurrentMarker} style={{width: 50, height: 50}} />
            </Marker> */}

            {showMarker && (
              <Marker key={1} coordinate={{latitude: pressedLocation.latitude, longitude: pressedLocation.longitude}}>
                {POIClicked ? undefined : <Image source={CustomMarker} style={{width: 50, height: 50}} />}
              </Marker>
            )}
          </MapView>

          {showMarker && (
            <Animated.View
              style={{width: '100%', position: 'absolute', bottom: 80, paddingHorizontal: 16, paddingVertical: 10}}
              entering={FadeInRight.duration(200)}
              exiting={FadeOutLeft.duration(200)}>
              <View style={{width: '100%', borderRadius: 12, backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 10, borderWidth: StyleSheet.hairlineWidth}}>
                {markerAddress?.locName && (
                  <Text style={{color: '#000', textAlign: 'justify', fontFamily: 'Poppins-Bold', fontSize: 18, borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 5}}>
                    {markerAddress.locName}
                  </Text>
                )}
                <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16}}>{markerAddress.locAddress}</Text>
              </View>
            </Animated.View>
          )}

          <View style={{width: '100%', paddingHorizontal: 16, paddingVertical: 5, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setShowMap(false);
              }}
              style={{}}>
              <MaterialCommunityIcons style={{padding: 10}} name={'arrow-left'} size={26} color={'#133561'} />
            </TouchableOpacity>

            <View style={{flex: 1}}>
              <Text style={{color: '#000', fontFamily: 'Poppins-Medium', fontSize: 16, marginLeft: 10, textAlign: 'center'}} numberOfLines={2}>
                {'Press and hold\non your desired location'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (showMarker == true) {
                  props.navigation.navigate({
                    name: origin.screen,
                    params: {[origin.input]: {placeInfo: markerAddress, latitude: pressedLocation.latitude, longitude: pressedLocation.longitude}},
                    merge: false,
                  });
                  return;
                }
              }}
              style={{}}>
              <MaterialCommunityIcons style={{padding: 10}} name={'check'} size={26} color={'#133561'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default MapViewer;
