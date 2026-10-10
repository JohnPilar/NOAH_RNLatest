import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';

import {LoadingPanel} from '../../../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {carColors, SampleGroupLayout as GetSampleGroupLayout, SampleSlotGroups as GetSampleSlotGroups} from '../../../../Global/GlobalVariable';
import {NmHardwareBackPress} from '../../../../functions/NmFunctions';

const ParkingLayout = props => {
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('A');

  const propertyFloorInfo = props?.route?.params?.propertyFloorInfo;
  const numParkSlot = props?.route?.params?.numParkSlot;
  const privateParking = props?.route?.params?.privateParking;
  const numParkSections = props?.route?.params?.numParkSections;

  const SampleSlotGroups = GetSampleSlotGroups(numParkSections);
  const SampleGroupLayout = GetSampleGroupLayout(numParkSlot);

  NmHardwareBackPress();

  function getRandomCarColor() {
    return Math.floor(Math.random() * 7);
  }

  const renderGroup = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setActiveIndex(index);
          setActiveSection(item.substr(0, 1));
        }}
        style={{marginHorizontal: 14, paddingVertical: 14}}>
        <Text style={{color: index == activeIndex ? '#FFF' : 'rgba(255,255,255,0.2)', fontFamily: 'Poppins-Medium', fontSize: 16}}>{item}</Text>
      </TouchableOpacity>
    );
  };

  function isOdd(num) {
    return num % 2;
  }

  const renderLayout = ({item, index}) => {
    const leftStyle = {borderLeftWidth: 1, borderTopWidth: 1};
    const rightStyle = {borderRightWidth: 1, borderTopWidth: 1};

    const parkStatus = Math.floor(Math.random() * 2);
    let stringIndex = index + 1;
    stringIndex = (stringIndex + '').length < 2 ? '0'.concat(stringIndex) : stringIndex;
    const parkId = activeSection.concat(stringIndex);

    const car = carColors[getRandomCarColor()];
    const indexOdd = isOdd(index);

    return (
      <View key={index} style={{width: '50%', paddingLeft: indexOdd == true ? 48 : 16, paddingRight: indexOdd == true ? 16 : 48, marginBottom: 0}}>
        <TouchableOpacity
          onPress={() => {
            if (privateParking == true) {
              if (parkStatus == 1) {
                propertyFloorInfo.parkId = parkId;
                props.navigation.navigate('ParkingBookPrivate', {parkingInfo: propertyFloorInfo});
              } else {
                //
              }
            } else {
              console.log('public parking');
            }
          }}
          activeOpacity={0.6}
          style={[
            indexOdd == true ? rightStyle : leftStyle,
            index >= SampleGroupLayout.length - 2 && {borderBottomWidth: 1},
            {borderColor: '#133561', alignItems: 'center', justifyContent: 'center', height: 80, backgroundColor: '#EEE'},
          ]}>
          {parkStatus == 1 ? (
            <Text style={{color: '#000', fontFamily: 'Poppins-Medium', fontSize: 20}}>{parkId}</Text>
          ) : (
            <View style={{width: 100, height: 40}}>
              <Image source={car} style={[{flex: 1, width: undefined, height: undefined}, indexOdd == false && {transform: [{rotate: '180deg'}]}]} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#133561', paddingTop: useSafeAreaInsets().top}}>
        <Text style={{color: '#FFF', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Select Slot'}</Text>
      </View>
      <View style={{width: '100%'}}>
        <FlatList data={SampleSlotGroups} renderItem={renderGroup} horizontal={true} style={{elevation: 5, backgroundColor: '#133561'}} showsHorizontalScrollIndicator={false} />
      </View>
      <View style={{flex: 1, width: '100%'}}>
        {loading && <LoadingPanel />}
        <View style={{paddingHorizontal: 16, width: '100%', height: 80, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: '#133561', fontFamily: 'Poppins-Medium', fontSize: 20}}>{'Section '.concat(activeSection).concat(' Entrance')}</Text>
        </View>
        <FlatList data={SampleGroupLayout} renderItem={renderLayout} numColumns={2} />
      </View>
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
});

export default ParkingLayout;
