import React, {useState} from 'react';
import {View, StatusBar, Text, FlatList, TextInput, TouchableOpacity, ImageBackground} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import NmStyles from '../../../../constants/NmStyles';
import NmColors from '../../../../constants/NmColors';
import {NmModalOptions} from '../../../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SamplePublicParkingList} from '../../../../Global/GlobalVariable';

const ParkingOthers = props => {
  const [searchValue, setSearchValue] = useState();
  const [optionsVisible, setOptionsVisible] = useState(false);

  const SampleFreeFloors = [
    {
      label: 'Lower Ground',
      value: 'PARKING_LGD',
    },
    {
      label: 'Upper Ground',
      value: 'PARKING_UGD',
    },
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

  const renderItem = ({item, index}) => {
    const image = item.placeImage == '' ? require('../../../../assets/Images/NoImage.jpg') : item.placeImage;

    return (
      <View style={{width: '100%', paddingVertical: 10}}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (item.placeParkingStatus == 1) {
              setOptionsVisible(true);
            }
          }}
          style={{height: 200, backgroundColor: '#EEE', borderRadius: 12, overflow: 'hidden'}}>
          <ImageBackground style={{width: '100%', height: '100%', justifyContent: 'flex-end'}} source={image} resizeMode="cover">
            <View style={{padding: 5, paddingLeft: 10, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)'}}>
              <Text style={{fontFamily: 'Poppins-Bold', fontSize: 18, color: '#000'}} numberOfLines={1}>
                {item.placeName}
              </Text>
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 16, color: '#000'}} numberOfLines={1}>
                {item.placeAddress}
              </Text>
              <Text style={{fontFamily: 'Poppins-Bold', fontSize: 18, color: item.placeParkingStatus == 1 ? '#30c219' : '#c21919'}} numberOfLines={1}>
                {item.placeParkingStatus == 1 ? 'Parking Available' : 'Parking Full'}
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
          setOptionsVisible(false);
          props.navigation.navigate('ParkingLayout', {numParkSlot: 22, numParkSections: 5, privateParking: false});
        }}
        optionsVisible={optionsVisible}
        setOptionsVisible={setOptionsVisible}
        mainContainerStyle={{borderRadius: 12}}
        HeaderTitle={'Select Floor'}
        headerStyle={{marginLeft: 10, paddingVertical: 10, fontSize: 20, marginTop: 2}}
        headerContainerStyle={{backgroundColor: '#DDD'}}
      />
      <StatusBar backgroundColor={'#FFF'} />
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Public Parking'}</Text>
      </View>
      <View style={{paddingHorizontal: 16, width: '100%'}}>
        <View style={[NmStyles.textInputContainer, {borderRadius: 12, borderWidth: 0, backgroundColor: '#f4f4f4'}]}>
          <View style={{paddingLeft: 10, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <MaterialCommunityIcons style={{paddingHorizontal: 0}} name={'magnify'} size={30} color={'#CCC'} />
          </View>
          <TextInput style={[NmStyles.textInput, {marginLeft: -2}]} placeholderTextColor={NmColors.placeholderTextColor} onChangeText={value => setSearchValue(value)} value={searchValue} placeholder="Search by Location" />
        </View>
      </View>
      <View style={{flex: 1, width: '100%', paddingHorizontal: 16, marginTop: 10}}>
        <FlatList data={SamplePublicParkingList} renderItem={renderItem} keyExtractor={(item, index) => index} />
      </View>
    </View>
  );
};

export default ParkingOthers;
