import {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text, ImageBackground, FlatList} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import ntpSync from '@ruanitto/react-native-ntp-sync';

import {LoadingScreen, NmButton} from '../../../components';
import {NmGetCleanGeoAddress, NmGetGeoAddress} from '../../../functions/NmFunctions';
import {SCREEN_WIDTH} from '../../../constants/NmStyles';

function ClockingSystem(props) {
  const [initialRegion, setInitialRegion] = useState({
    latitude: 12.2339822,
    longitude: 122.8341213,
    latitudeDelta: 88,
    longitudeDelta: 200,
  });

  const [loading, setLoading] = useState(false);
  const [preciseLoc, setPreciseLoc] = useState('...');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedStatus, setClockedStatus] = useState(false);
  const [clockedBtnTitle, setClockedBtnTitle] = useState('Clock In');
  const [clockedBtnImg, setClockedBtnImg] = useState('play-circle-outline');

  useEffect(() => {
    var options = {};
    var clock = (ntp = new ntpSync(options));

    refreshLocation();

    const intervalId = setInterval(() => {
      var currentTime = clock.getTime();
      setCurrentTime(new Date(currentTime));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getCurrentLocationInfo();
  }, [initialRegion]);

  function refreshLocation() {
    setLoading(true);
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setInitialRegion({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0121,
        longitudeDelta: 0.0121,
      });
    });
  }

  function getCurrentLocationInfo() {
    NmGetGeoAddress(initialRegion.latitude, initialRegion.longitude).then(res => {
      if (res.status == 'OK') {
        setPreciseLoc(res.formattedAddress);
      } else {
        setPreciseLoc('Cannot provide location details');
      }
      setLoading(false);
    });
  }

  function clockInStartStop() {
    setClockedStatus(!clockedStatus);
  }

  useEffect(() => {
    setClockedBtnTitle(clockedStatus == true ? 'Clock Out' : 'Clock In');
    setClockedBtnImg(clockedStatus == true ? 'stop-circle-outline' : 'play-circle-outline');
  }, [clockedStatus]);

  return (
    <View style={styles.container}>
      <ImageBackground style={{flex: 1}} source={require('../../../assets/Images/ClockBackground.jpg')} imageStyle={{opacity: 0.02}}>
        {loading && <LoadingScreen />}

        <ScrollView style={{width: SCREEN_WIDTH}} contentContainerStyle={{flexGrow: 1}}>
          <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
            <View style={{width: '100%', overflow: 'hidden', flexDirection: 'row', justifyContent: 'left', alignItems: 'center'}}>
              <MaterialCommunityIcons name={'map-marker-outline'} color={'#2E7FF9'} size={32} style={{marginRight: 6}} />
              <Text style={[styles.poppinsBlack.bold, {fontSize: 20, marginLeft: 0, marginBottom: -4}]} numberOfLines={1}>
                {preciseLoc}
              </Text>
            </View>
            <View style={{width: '100%', overflow: 'hidden', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', marginTop: 10}}>
              <MaterialCommunityIcons name={'clock-outline'} color={'#2E7FF9'} size={32} style={{marginRight: 6}} />
              <Text style={[styles.poppinsBlack.bold, {fontSize: 20, marginLeft: 0, marginBottom: -4}]}>{currentTime.toLocaleTimeString()}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={{width: '100%', paddingHorizontal: 16, paddingVertical: 8}}>
          <NmButton
            title={clockedBtnTitle}
            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: clockedStatus ? 'red' : '#2E7FF9'}}
            titleStyle={{marginBottom: -1}}
            onPress={clockInStartStop}>
            <MaterialCommunityIcons name={clockedBtnImg} color={'#FFF'} size={26} style={{marginRight: 6}} />
          </NmButton>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  activeBookingBackground: {
    flex: 1,
    backgroundColor: '#FFF',
    width: undefined,
    height: undefined,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    marginHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginBottom: 10,
  },
  poppinsBlack: {
    regular: {fontFamily: 'Poppins-Regular', color: '#000'},
    medium: {fontFamily: 'Poppins-Medium', color: '#000'},
    bold: {fontFamily: 'Poppins-Bold', color: '#000'},
  },
});

export default ClockingSystem;
