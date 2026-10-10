import React, {useState} from 'react';
import {View, StatusBar, Text, FlatList, TouchableOpacity, ImageBackground} from 'react-native';

import {NmModalOptions} from '../../../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ParkingUnits = props => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [unitData, setUnitData] = useState();

  // useFocusEffect(() => {
  //   setUnitData(); //
  // });

  const SampleFreeFloors = [
    {
      label: '1st Floor',
      value: 'PARKING_1GD',
    },
    {
      label: '2nd Floor',
      value: 'PARKING_2GD',
    },
    {
      label: '3rd Floor',
      value: 'PARKING_3GD',
    },
  ];

  const SampleOwnerUnits = [
    {
      unitName: 'Noah Towers',
      unitAddress: 'Monserrat St., Gil Puyat Ave. Makati City',
      unitImage: require('../../../../assets/Images/Parking/reserved.jpg'),
      unitParkingStatus: 1,
    },
    {
      unitName: 'Noah Condominium',
      unitAddress: '8 Gov I Rodriguez, Taguig City',
      unitImage: require('../../../../assets/Images/Parking/condo_2.jpg'),
      unitParkingStatus: 1,
    },
  ];

  const renderItem = ({item, index}) => {
    return (
      <View key={index} style={{width: '100%', paddingVertical: 10}}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (item.unitParkingStatus == 1) {
              setUnitData(item);
              setOptionsVisible(true);
            }
          }}
          style={{height: 200, backgroundColor: '#EEE', borderRadius: 12, overflow: 'hidden'}}>
          <ImageBackground style={{width: '100%', height: '100%', justifyContent: 'flex-end'}} source={item.unitImage} resizeMode="cover">
            <View style={{padding: 5, paddingLeft: 10, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.8)'}}>
              <Text style={{fontFamily: 'Poppins-Bold', fontSize: 18, color: '#000'}} numberOfLines={1}>
                {item.unitName}
              </Text>
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 16, color: '#000'}} numberOfLines={1}>
                {item.unitAddress}
              </Text>
              <Text style={{fontFamily: 'Poppins-Bold', fontSize: 18, color: item.unitParkingStatus == 1 ? '#30c219' : '#c21919'}} numberOfLines={1}>
                {item.unitParkingStatus == 1 ? 'Parking Available' : 'Parking Full'}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF', paddingTop: useSafeAreaInsets().top}}>
      <NmModalOptions
        items={SampleFreeFloors}
        onPress={value => {
          const propertyFloorInfo = {unitData: unitData, floorData: value};

          setOptionsVisible(false);
          props.navigation.navigate('ParkingLayout', {numParkSlot: 14, numParkSections: 5, privateParking: true, propertyFloorInfo: propertyFloorInfo});
        }}
        optionsVisible={optionsVisible}
        setOptionsVisible={setOptionsVisible}
        mainContainerStyle={{borderRadius: 12}}
        HeaderTitle={'Select Floor'}
        headerStyle={{marginLeft: 10, paddingVertical: 10, fontSize: 20, marginTop: 2}}
        headerContainerStyle={{backgroundColor: '#DDD'}}
      />
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'My Units'}</Text>
      </View>

      <View style={{flex: 1, width: '100%', paddingHorizontal: 16}}>
        <FlatList data={SampleOwnerUnits} renderItem={renderItem} keyExtractor={(item, index) => index} />
      </View>
    </View>
  );
};

export default ParkingUnits;
