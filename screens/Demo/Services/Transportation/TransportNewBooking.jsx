import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';
import {useNavigation} from '@react-navigation/native';

import {LoadingScreen, NmButton, NmDatePickerModal} from '../../../../components';

import NmStyles from '../../../../constants/NmStyles';
import NmColors from '../../../../constants/NmColors';
import {NmGetSchedString, NmTicketDate, NmHardwareBackPress, NmGetDate} from '../../../../functions/NmFunctions';

const TransportNewBooking = props => {
  const navigation = useNavigation();
  const emptyPlaceholder = 'NONE_OR_EMPTY';

  const [locPickup, setLocPickup] = useState(emptyPlaceholder);
  const [locDestination, setLocDestination] = useState(emptyPlaceholder);
  const [rideNotes, setRideNotes] = useState('');
  const [detailsComplete, setDetailsComplete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [schedDate, setSchedDate] = useState(NmGetSchedString(NmGetDate(undefined, 'dashYMD')));
  const [showDateModal, setShowDateModal] = useState(false);

  NmHardwareBackPress();

  useEffect(() => {
    if (props.route.params?.locPickup) {
      setLocPickup(props.route.params?.locPickup);
    }

    if (props.route.params?.locDestination) {
      setLocDestination(props.route.params?.locDestination);
    }
  }, [props.route.params?.locPickup, props.route.params?.locDestination]);

  useEffect(() => {
    if (locPickup != emptyPlaceholder && locDestination != emptyPlaceholder && rideNotes != '') {
      setDetailsComplete(true);
    } else {
      setDetailsComplete(false);
    }
  }, [locPickup, locDestination, rideNotes]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {loading && <LoadingScreen />}
        <NmDatePickerModal
          modalVisible={showDateModal}
          onBackPress={() => {
            setShowDateModal(false);
          }}
          onBackdropPress={() => {
            setShowDateModal(false);
          }}
          setSchedDate={date => {
            setShowDateModal(false);
            setSchedDate(NmGetSchedString(date));
          }}
        />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            paddingVertical: 5,
          }}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20}}>{'Book New Ride'}</Text>
        </View>

        <ScrollView style={{width: '100%'}} contentContainerStyle={{flexGrow: 1}}>
          <View style={{width: '100%', paddingHorizontal: 16, marginBottom: 10}}>
            <View style={styles.infoHeader}>
              <Text style={styles.componentHeader}>{'Set Pick-up Location'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (locPickup == emptyPlaceholder) {
                  navigation.navigate('MapViewer', {origin: {screen: 'TransportNewBooking', input: 'locPickup'}});
                } else {
                  navigation.navigate('MapViewer', {currentCoords: {latitude: locPickup.latitude, longitude: locPickup.longitude}, origin: {screen: 'TransportNewBooking', input: 'locPickup'}});
                }
              }}
              style={[{width: '100%', borderWidth: 1, minHeight: 45, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row', alignItems: 'center'}]}>
              <MaterialCommunityIcons style={{padding: 10}} name={'crosshairs-gps'} size={28} color={locPickup == emptyPlaceholder ? '#AAA' : '#133561'} />
              <View style={{flex: 1, justifyContent: 'center', paddingLeft: 0}}>
                {locPickup == emptyPlaceholder ? (
                  <Text style={[styles.scheduleText, {paddingLeft: 0, color: '#AAA'}]}>{'Click here to search'}</Text>
                ) : (
                  <View style={{paddingVertical: 5, justifyContent: 'center', paddingRight: 5}}>
                    {locPickup.placeInfo?.locName && <Text style={[{fontFamily: 'Poppins-Bold', color: '#000', fontSize: 16}]}>{locPickup.placeInfo.locName}</Text>}
                    <Text style={[{fontFamily: 'Poppins-Regular', color: '#000', fontSize: 16, marginTop: 0}]}>{locPickup.placeInfo.locAddress}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.infoHeader}>
              <Text style={styles.componentHeader}>{'Set Destination'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (locDestination == emptyPlaceholder) {
                  navigation.navigate('MapViewer', {origin: {screen: 'TransportNewBooking', input: 'locDestination'}});
                } else {
                  navigation.navigate('MapViewer', {
                    currentCoords: {latitude: locDestination.latitude, longitude: locDestination.longitude},
                    origin: {screen: 'TransportNewBooking', input: 'locDestination'},
                  });
                }
              }}
              style={[{width: '100%', borderWidth: 1, minHeight: 45, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row', alignItems: 'center'}]}>
              <MaterialCommunityIcons style={{padding: 10}} name={'map-marker-outline'} size={28} color={locDestination == emptyPlaceholder ? '#AAA' : '#133561'} />
              <View style={{flex: 1, justifyContent: 'center', paddingLeft: 0}}>
                {locDestination == emptyPlaceholder ? (
                  <Text style={[styles.scheduleText, {paddingLeft: 0, color: '#AAA'}]}>{'Click here to search'}</Text>
                ) : (
                  <View style={{paddingVertical: 5, justifyContent: 'center', paddingRight: 5}}>
                    {locDestination.placeInfo?.locName && <Text style={[{fontFamily: 'Poppins-Bold', color: '#000', fontSize: 16}]}>{locDestination.placeInfo.locName}</Text>}
                    <Text style={[{fontFamily: 'Poppins-Regular', color: '#000', fontSize: 16, marginTop: 0}]}>{locDestination.placeInfo.locAddress}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* <View style={styles.infoHeader}>
              <Text style={styles.componentHeader}>{'Set Pick-Up Date and Time'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowDateModal(true);
              }}
              style={[{width: '100%', height: 45, borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <Text style={[styles.scheduleText, {paddingLeft: 10, color: '#AAA'}]}>{schedDate}</Text>
              </View>
            </TouchableOpacity> */}

            <View style={styles.infoHeader}>
              <Text style={styles.componentHeader}>{'Notes'}</Text>
            </View>
            <View style={[{flex: 1, width: '100%', minHeight: 45, borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
              <TextInput
                multiline={true}
                maxLength={500}
                placeholder="None if nothing"
                placeholderTextColor={'#AAA'}
                style={[NmStyles.textInput]}
                value={rideNotes}
                onChangeText={value => {
                  setRideNotes(value);
                }}
              />
            </View>
          </View>
        </ScrollView>
        <View style={{width: '100%', paddingHorizontal: 16, paddingVertical: 10}}>
          <NmButton
            buttonTheme={'dark'}
            disabled={!detailsComplete}
            style={[{backgroundColor: detailsComplete ? NmColors.buttonDark : NmColors.buttonDisabled, borderRadius: 12}]}
            titleStyle={{}}
            title="Book Private Ride"
            onPress={() => {
              const bookingObject = {
                type: 'ONGOING',
                status: 'Finding a Ride',
                destination: locDestination.placeInfo.locAddress,
                date: NmTicketDate(new Date()).concat(', '.concat(NmGetDate(new Date(), 'customFormat', 'hh:mm a'))),
              };

              EventRegister.emit('updateActiveBooking', bookingObject);
              props.navigation.goBack();
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  componentHeader: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  scheduleText: {
    marginTop: 2,
    padding: 0,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  infoHeader: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
});

export default TransportNewBooking;
