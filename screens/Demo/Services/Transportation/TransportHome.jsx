import React, {useContext} from 'react';
import {useWindowDimensions, View, StatusBar, Text, StyleSheet, Image, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';

import {NmSlidingBanner} from '../../../../components';
import {AccountDetailsContext, TransportContext} from '../../../../functions/Contexts';
import {NmGetTimeGreeting} from '../../../../functions/NmFunctions';

const TransportHome = props => {
  const {recname} = useContext(AccountDetailsContext);
  const {width, height} = useWindowDimensions();
  const transportContext = useContext(TransportContext);
  const ongoingBooking = transportContext.filter(i => i.type == 'ONGOING');

  const SampleAdItems = [
    {backgroundImage: require('../../../../assets/Images/Transportation/promo_1.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Transportation/promo_2.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Transportation/promo_3.png'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Transportation/promo_4.png'), url: ''},
  ];

  const SamplePopularPlaces = [
    {
      locName: 'SM Mall of Asia',
      locImage: require('../../../../assets/Images/Transportation/place_1.jpg'),
      locAddress: 'Seaside Blvd, Pasay, 1300 Metro Manila',
    },
    {
      locName: 'Starbucks - Tagaytay',
      locImage: require('../../../../assets/Images/Transportation/place_2.jpg'),
      locAddress: 'Purok 162 Tagaytay - Calamba Rd, Tagaytay, 4120 Cavite',
    },
    {
      locName: 'NAIA Terminal 1',
      locImage: require('../../../../assets/Images/Transportation/place_3.jpg'),
      locAddress: 'Parañaque, Metro Manila',
    },
    {
      locName: 'Trinoma',
      locImage: require('../../../../assets/Images/Transportation/place_4.jpg'),
      locAddress: 'Quezon City, 1105 Metro Manila',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#FFF'} />

      <ScrollView style={{width: '100%'}} contentContainerStyle={{flexGrow: 1}}>
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
            <Text style={[styles.poppinsBlack.bold, {fontSize: 18, marginLeft: 0}]}>{'Active Booking'}</Text>
          </View>

          {ongoingBooking.length > 0 ? (
            <TouchableOpacity style={[{width: '100%', justifyContent: 'center'}]}>
              <ImageBackground
                style={[
                  {
                    flex: 1,
                    backgroundColor: '#FFF',
                    width: undefined,
                    height: undefined,
                    borderRadius: 12,
                    overflow: 'hidden',
                    padding: 10,
                    justifyContent: 'flex-end',
                  },
                ]}
                imageStyle={[{resizeMode: 'cover', opacity: 0.8}, props.imageStyle]}
                source={require('../../../../assets/Images/appointment.jpg')}>
                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    paddingVertical: 5,
                  }}>
                  <View style={{paddingHorizontal: 10}}>
                    <Text style={styles.activeBookingTitle}>{'Destination: '}</Text>
                    <Text style={styles.activeBookingInfo}>{ongoingBooking[0].destination}</Text>
                  </View>
                  <View style={{paddingHorizontal: 10}}>
                    <Text style={styles.activeBookingTitle}>{'Status: '}</Text>
                    <Text style={styles.activeBookingInfo}>{ongoingBooking[0].status}</Text>
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
          <Text style={[styles.poppinsBlack.bold, {fontSize: 18, marginLeft: 0}]}>{'Promos'}</Text>
          <NmSlidingBanner
            data={SampleAdItems}
            containerStyle={{}}
            bannerStyle={{borderWidth: 1, borderColor: '#EEE'}}
            onPress={item => {
              //
            }}
          />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <Text style={[styles.poppinsBlack.bold, {fontSize: 18, marginLeft: 0}]}>{'Popular Destinations'}</Text>
          {SamplePopularPlaces.slice(0, 5).map((item, index) => {
            const imageDimensions = width * 0.2;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={{width: '100%', padding: 10, flexDirection: 'row', backgroundColor: '#f4f4f4', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DDD', borderRadius: 12, marginBottom: 10}}>
                <View
                  style={{
                    width: imageDimensions,
                    height: imageDimensions,
                    borderRadius: 12,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: '#DDD',
                    marginRight: 10,
                    overflow: 'hidden',
                    backgroundColor: '#FFF',
                  }}>
                  <Image source={item.locImage} style={{flex: 1, width: undefined, height: undefined}} />
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}} numberOfLines={1}>
                    {item.locName}
                  </Text>
                  <Text style={{color: '#777', fontFamily: 'Poppins-Medium'}} numberOfLines={1}>
                    {item.locAddress}
                  </Text>
                </View>
              </TouchableOpacity>
            );
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
    overflow: 'hidden',
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  poppinsBlack: {
    regular: {fontFamily: 'Poppins-Regular', color: '#000'},
    medium: {fontFamily: 'Poppins-Medium', color: '#000'},
    bold: {fontFamily: 'Poppins-Bold', color: '#000'},
  },
  activeBookingTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#FFF',
  },
  activeBookingInfo: {
    fontFamily: 'Poppins-Bold',
    color: '#111',
  },
});

export default TransportHome;
