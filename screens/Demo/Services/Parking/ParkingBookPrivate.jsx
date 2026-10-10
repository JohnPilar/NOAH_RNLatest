import React, {useState, useEffect, useContext} from 'react';
import {View, StatusBar, Text, StyleSheet, TextInput, ScrollView, Image} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {EventRegister} from 'react-native-event-listeners';

import {LoadingScreen, NmButton} from '../../../../components';
import {NmGetDate, NmTicketDate} from '../../../../functions/NmFunctions';
import NmStyles, {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import NmColors from '../../../../constants/NmColors';
import {ParkingTicketContext} from '../../../../functions/Contexts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UIConfig} from '../../../../Global/UIConfig';

const ParkingBookPrivate = props => {
  const [loading, setLoading] = useState(false);
  const ticketContext = useContext(ParkingTicketContext);

  const parkingInfo = props?.route?.params?.parkingInfo;

  const [property, setProperty] = useState(parkingInfo.unitData.unitName);
  const [floorLevel, setFloorLevel] = useState(parkingInfo.floorData.label);
  const [parkingArea, setParkingArea] = useState(parkingInfo.parkId);
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [detailsComplete, setDetailsComplete] = useState(false);

  useEffect(() => {
    StatusBar.setBackgroundColor('#FFF');
  });

  useEffect(() => {
    if (property != undefined && floorLevel != undefined && parkingArea != undefined && vehicleDetails != '' && vehiclePlate != '') {
      setDetailsComplete(true);
    } else {
      setDetailsComplete(false);
    }
  }, [property, floorLevel, parkingArea, vehicleDetails, vehiclePlate]);

  return (
    <View style={[styles.container, {paddingTop: useSafeAreaInsets().top}]}>
      {loading && <LoadingScreen containerStyle={{backgroundColor: '#FFF'}} />}

      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Book Parking Ticket'}</Text>
      </View>
      <ScrollView style={{width: WINDOW_WIDTH}} contentContainerStyle={{flexGrow: 1}}>
        <View style={{width: '100%', paddingHorizontal: 16}}>
          <View style={{width: '100%', justifyContent: 'center', marginTop: 10}}>
            <Text style={styles.componentHeader}>{'Property'}</Text>
          </View>
          <TouchableOpacity onPress={() => {}} style={[styles.dropdownContainer]}>
            <Text style={[styles.dropdownSelectedValue]} numberOfLines={1}>
              {parkingInfo.unitData.unitName}
            </Text>
            <Image source={UIConfig.DropdownIcon} style={[{height: 20, width: 20, resizeMode: 'contain', tintColor: '#466DC6', marginRight: 10}]} />
          </TouchableOpacity>

          <View style={{width: '100%', justifyContent: 'center', marginTop: 20}}>
            <Text style={styles.componentHeader}>{'Address'}</Text>
          </View>
          <View onPress={() => {}} style={[styles.dropdownContainer]}>
            <Text style={[styles.dropdownSelectedValue]} numberOfLines={1}>
              {parkingInfo.unitData.unitAddress}
            </Text>
          </View>

          <View style={{width: '100%', justifyContent: 'center', marginTop: 20}}>
            <Text style={styles.componentHeader}>{'Floor Level'}</Text>
          </View>
          <TouchableOpacity onPress={() => {}} style={[styles.dropdownContainer]}>
            <Text style={[styles.dropdownSelectedValue]} numberOfLines={1}>
              {parkingInfo.floorData.label}
            </Text>
            <Image source={UIConfig.DropdownIcon} style={[{height: 20, width: 20, resizeMode: 'contain', tintColor: '#466DC6', marginRight: 10}]} />
          </TouchableOpacity>

          <View style={{width: '100%', justifyContent: 'center', marginTop: 20}}>
            <Text style={styles.componentHeader}>{'Parking Area I.D'}</Text>
          </View>
          <TouchableOpacity onPress={() => {}} style={[styles.dropdownContainer]}>
            <Text style={[styles.dropdownSelectedValue]} numberOfLines={1}>
              {parkingInfo.parkId}
            </Text>
            <Image source={UIConfig.DropdownIcon} style={[{height: 20, width: 20, resizeMode: 'contain', tintColor: '#466DC6', marginRight: 10}]} />
          </TouchableOpacity>

          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
            <Text style={styles.componentHeader}>{'Vehicle Details'}</Text>
          </View>
          <View style={[{flex: 1, width: '100%', minHeight: 45, borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
            <TextInput
              style={[NmStyles.textInput]}
              value={vehicleDetails}
              placeholder="Model, Color, etc."
              placeholderTextColor={'#AAA'}
              onChangeText={value => {
                setVehicleDetails(value);
              }}
            />
          </View>

          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
            <Text style={styles.componentHeader}>{'Vehicle Plate No.'}</Text>
          </View>
          <View style={[{width: '100%', minHeight: 45, borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
            <TextInput
              maxLength={8}
              style={[NmStyles.textInput]}
              value={vehiclePlate}
              onChangeText={value => {
                setVehiclePlate(value.toUpperCase());
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
          title="Book Parking Ticket"
          onPress={() => {
            const ticketInfo = {
              ticketId: NmGetDate(),
              ticketDate: NmTicketDate(new Date()),
              ticketBuilding: property,
              ticketAddress: parkingInfo.unitData.unitAddress,
              ticketParkId: floorLevel.concat(', ').concat(parkingArea),
              ticketImage: parkingInfo.unitData.unitImage,
              ticketVehicle: {plateNo: vehiclePlate, details: vehicleDetails},
            };

            EventRegister.emit('updateParkingTicket', ticketInfo);
            props.navigation.navigate('ParkingUnits');
          }}
        />
      </View>
    </View>
  );
};

// {"floorData": {"label": "1st Floor", "value": "PARKING_1GD"},
//     "parkId": "A12",
//     "unitData": {"unitAddress": "Monserrat St., Gil Puyat Ave. Makati City", "unitImage": 96, "unitName": "Noah Towers", "unitParkingStatus": 1}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  componentHeader: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  dropdownContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 12,
    overflow: 'hidden',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownSelectedValue: {
    marginTop: 2,
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  dropdownItemContainer: {
    borderBottomWidth: 1,
    borderColor: '#f4f4f4',
    paddingVertical: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    fontFamily: 'Poppins-Regular',
    height: 50,
  },
  dropdownItemStyle: {
    paddingHorizontal: 10,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});

export default ParkingBookPrivate;
