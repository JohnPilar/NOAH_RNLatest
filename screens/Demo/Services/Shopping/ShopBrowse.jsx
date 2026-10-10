import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NmStyles from '../../../../constants/NmStyles';
import NmColors from '../../../../constants/NmColors';
import {NmItemGallery} from '../../../../components';
import {SampleGridItems} from '../../../../Global/GlobalVariable';

const ShopBrowse = props => {
  const [searchValue, setSearchValue] = useState();

  const dashboardType = 'GRID';

  return (
    <View style={{flex: 1}}>
      <View style={{marginBottom: 0, paddingVertical: 10, paddingBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {}} style={{marginLeft: 16, marginRight: 16}}>
          <MaterialCommunityIcons style={{}} name={'menu'} size={35} color={'#133561'} />
        </TouchableOpacity>

        <View style={[{flex: 1}, NmStyles.textInputContainer, {borderRadius: 12, borderWidth: 0, marginRight: 16}]}>
          <View style={{paddingLeft: 10, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <MaterialCommunityIcons style={{paddingHorizontal: 0}} name={'magnify'} size={30} color={'#CCC'} />
          </View>
          <TextInput style={[NmStyles.textInput, {marginLeft: -2}]} placeholderTextColor={NmColors.placeholderTextColor} onChangeText={value => setSearchValue(value)} value={searchValue} placeholder="Search product" />
        </View>
      </View>
      <View style={{backgroundColor: '#f4f4f4', flex: 1, alignItems: 'center', width: '100%'}}>
        <NmItemGallery data={SampleGridItems} containerStyle={{}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  gridContainer: {
    backgroundColor: '#F0F4F9',
  },
  greetingsContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  greetings: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
    textShadowColor: '#FFF',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
  },
  subGreetings: {
    color: '#A4A8B0',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textShadowColor: '#FFF',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderColor: '#DDD',
    borderWidth: StyleSheet.hairlineWidth,
  },
  gridItemBrand: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
  },
  gridItemName: {
    color: '#777',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  gridItemPrice: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  boxLabel: {
    color: '#36559B',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  rowStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //justifyContent: DeviceInfo.getDeviceType().toUpperCase() == 'TABLET' ? 'flex-start' : 'space-between',
  },
});

export default ShopBrowse;
