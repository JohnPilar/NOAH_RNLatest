import React, {useState, useEffect} from 'react';
import {View, StatusBar, Dimensions, TextInput} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import NmStyles, {DEVICE_TYPE} from '../../../../constants/NmStyles.tsx';
import NmColors from '../../../../constants/NmColors.js';
import {NmSlidingBanner, NmItemGallery} from '../../../../components';
import {SampleGridItems} from '../../../../Global/GlobalVariable.js';

const ShopHome = () => {
  const orientation = useDeviceOrientation();

  const [screenWidth, setScreenWidth] = useState('100%');
  const [mainViewWidth, setMainViewWidth] = useState();

  const [searchValue, setSearchValue] = useState();

  const [rowVerticalMargin, setRowVerticalMargin] = useState(5);
  const [boxImageSize, setBoxImageSize] = useState(40);
  const [boxSize, seBoxSize] = useState(100);

  const [bottomToolbarIndex, setBottomToolbarIndex] = useState(0);

  let windowWidth = Dimensions.get('window').width;
  windowWidth = windowWidth - 32;

  const [featureNotAvailable, setFeatureNotAvailable] = useState();

  // useEffect(() => {
  //   function handleBackButton() {
  //     BackHandler.exitApp();
  //     return true;
  //   }

  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

  //   return () => backHandler.remove();
  // }, []);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        windowWidth = windowWidth / 2;
        setScreenWidth('50%');
      } else {
        windowWidth = windowWidth * 0.35;
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      setRowVerticalMargin(10);
      setBoxImageSize(60);
      seBoxSize(120);
    }
  }, [orientation]);

  const SampleAdItems = [
    {backgroundImage: require('../../../../assets/Images/ads_1.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/ads_2.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/ads_3.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/ads_4.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/ads_5.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/ads_6.jpg'), url: ''},
  ];

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#EEE'}}>
      <StatusBar backgroundColor={'#EEE'} barStyle={'light-content'} />

      <View style={{marginBottom: 0, paddingVertical: 10, paddingBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
        {/* <TouchableOpacity activeOpacity={0.5} onPress={() => {}} style={{marginLeft: 16, marginRight: 16}}>
          <MaterialCommunityIcons style={{}} name={'menu'} size={35} color={'#133561'} />
        </TouchableOpacity> */}

        <View style={[{flex: 1}, NmStyles.textInputContainer, {borderRadius: 12, borderWidth: 0, marginHorizontal: 16}]}>
          <View style={{paddingLeft: 10, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <MaterialCommunityIcons style={{paddingHorizontal: 0}} name={'magnify'} size={30} color={'#CCC'} />
          </View>
          <TextInput
            style={[NmStyles.textInput, {marginLeft: -2}]}
            placeholderTextColor={NmColors.placeholderTextColor}
            onChangeText={value => setSearchValue(value)}
            value={searchValue}
            placeholder="Search product"
          />
        </View>
      </View>

      <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
        <NmItemGallery data={SampleGridItems} numColumns={DEVICE_TYPE == 'TABLET' ? (orientation == 'portrait' ? 4 : 5) : undefined}>
          <NmSlidingBanner data={SampleAdItems} containerStyle={{paddingHorizontal: 16, marginBottom: 20}} />
        </NmItemGallery>
      </View>
    </View>
  );
};

export default ShopHome;
