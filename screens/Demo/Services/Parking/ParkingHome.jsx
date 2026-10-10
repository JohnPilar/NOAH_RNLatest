import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {SCREEN_WIDTH} from '../../../../constants/NmStyles';
import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmShortcutsPanel} from '../../../../components';
import {AccountDetailsContext, ParkingTicketContext} from '../../../../functions/Contexts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NmGetTimeGreeting} from '../../../../functions/NmFunctions';
import {SamplePublicParkingList} from '../../../../Global/GlobalVariable';

const ParkingHome = props => {
  const ticketContext = useContext(ParkingTicketContext);
  const {recname} = useContext(AccountDetailsContext);

  const SampleQuickShortcuts = [
    {itemName: 'Book Parking', icon: 'book-edit-outline', screenName: 'Test'},
    {itemName: 'My Tickets', icon: 'ticket-outline', screenName: 'Test'},
    {itemName: 'Payment', icon: 'credit-card-fast-outline', screenName: 'Test'},
    {itemName: 'Telecoms', icon: 'cellphone-basic', screenName: 'Test'},
    {itemName: 'Placeholder Item', icon: 'qrcode-scan', screenName: 'Test'},
  ];

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF', paddingTop: useSafeAreaInsets().top}}>
      <ScrollView style={{width: SCREEN_WIDTH}} contentContainerStyle={{flexGrow: 1}}>
        {/* Name and header */}
        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 5, flexDirection: 'row'}}>
          <Image source={require('../../../../assets/testuser.png')} style={{width: 46, height: 46, borderRadius: 46, overflow: 'hidden'}} />
          <View style={{width: '100%', marginLeft: 10, justifyContent: 'center', marginTop: 0}}>
            <Text style={[styles.poppinsBlack.regular, {fontSize: 16}]}>{NmGetTimeGreeting()}</Text>
            <Text style={[styles.poppinsBlack.bold, {fontSize: 18}]}>{recname}</Text>
          </View>
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 10}}>
          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.poppinsBlack.bold, {fontSize: 18, marginLeft: 0}]}>{'Active Booked Parking'}</Text>
          </View>

          {ticketContext != undefined ? (
            <TouchableOpacity
              style={[{width: '100%', height: 160, justifyContent: 'center'}]}
              activeOpacity={0.85}
              onPress={() => {
                props.navigation.navigate('ParkingTickets');
              }}>
              <ImageBackground style={[styles.activeBookingBackground]} imageStyle={[{resizeMode: 'cover'}, props.imageStyle]} source={ticketContext.ticketImage}>
                <View style={styles.statusContainer}>
                  <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name={'crosshairs-gps'} color={'#000'} size={20} style={{marginLeft: 8, padding: 3}} />
                    <View style={{flexd: 1}}>
                      <Text style={{marginLeft: 5, fontFamily: 'Poppins-Bold', color: '#000', fontSize: 18}} numberOfLines={1}>
                        {ticketContext.ticketBuilding}
                      </Text>
                      <Text style={{marginLeft: 5, fontFamily: 'Poppins-Bold', color: '#000'}}>{ticketContext.ticketParkId}</Text>
                      <Text style={{marginLeft: 5, fontFamily: 'Poppins-Regular', color: '#000'}}>{ticketContext.ticketAddress}</Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={{color: '#AAA', fontFamily: 'Poppins-Regular', fontSize: 18}}>{'No active booking'}</Text>
            </View>
          )}
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <NmShortcutsPanel headerTitle={'Quick Actions'} items={SampleQuickShortcuts} containerStyle={{marginTop: 0}} numRows={1} />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <Text style={[styles.poppinsBlack.bold, {fontSize: 18, marginLeft: 0}]}>{'Popular Parking Places'}</Text>
          {SamplePublicParkingList.map((item, index) => {
            const image = item.placeImage == '' ? require('../../../../assets/Images/NoImage.jpg') : item.placeImage;
            const imageLength = WINDOW_WIDTH * 0.2;

            if (index < 3) {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    width: '100%',
                    flexDirection: 'row',
                    marginBottom: 10,
                    padding: 10,
                    backgroundColor: '#f5f5f5',
                    borderWidth: 1,
                    borderColor: '#EEE',
                    borderRadius: 12,
                  }}>
                  <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#EEE'}}>
                    <Image source={image} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
                  </View>
                  <View style={{flex: 1, justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 10}}>
                    <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}} numberOfLines={1}>
                      {item.placeName}
                    </Text>
                    <Text style={{color: '#000', fontFamily: 'Poppins-Regular'}}>{item.placeAddress}</Text>
                    {/* <NmButton
                      buttonTheme={'dark'}
                      style={{paddingHorizontal: 10, height: 28}}
                      titleStyle={{}}
                      title="Book Appointment"
                      onPress={() => {
                        //
                      }}
                    /> */}
                  </View>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </ScrollView>
    </View>
  );
};

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

export default ParkingHome;
