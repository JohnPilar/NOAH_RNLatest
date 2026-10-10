import React, {useContext, useState} from 'react';
import {View, Text, Image, StatusBar, TouchableOpacity, ScrollView, useWindowDimensions} from 'react-native';

import {useDeviceOrientation} from '@react-native-community/hooks';
import {useFocusEffect} from '@react-navigation/native';

import {NmShortcutsPanel} from '../../../../components';
import {NmNavigateTo, NmGetCurrencyFormat, NmGetTimeGreeting} from '../../../../functions/NmFunctions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AccountDetailsContext} from '../../../../functions/Contexts';
import {SampleRecentItems} from '../../../../Global/GlobalVariable';

const PaymentHome = props => {
  const {recname} = useContext(AccountDetailsContext);
  const {width, height} = useWindowDimensions();
  const orientation = useDeviceOrientation();
  const [screenWidth, setScreenWidth] = useState('100%');
  useFocusEffect(() => {
    StatusBar.setBackgroundColor('#FFF');
  });

  // useEffect(() => {
  //   if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
  //     if (orientation == 'portrait') {
  //       setScreenWidth('50%');
  //     } else {
  //       setScreenWidth('35%');
  //     }
  //   }
  // }, [orientation]);

  const SampleMoneyTransfer = [
    {itemName: 'Bank Transfer', icon: 'bank-transfer', screenName: 'Test'},
    {itemName: 'Pay Contacts', icon: 'human-greeting-proximity', screenName: 'Test'},
    {itemName: 'Check Balance', icon: 'bank', screenName: 'Test'},
    {itemName: 'Scan and Pay', icon: 'qrcode-scan', screenName: 'Test'},
    {itemName: 'Placeholder Item', icon: 'qrcode-scan', screenName: 'Test'},
  ];

  const SamplePayItems = [
    {itemName: 'Electricity', icon: 'lightning-bolt', itemCode: 'BILL_ELECT'},
    {itemName: 'Water Utilities', icon: 'water', itemCode: 'BILL_WATER'},
    {itemName: 'Credit Cards', icon: 'credit-card-fast-outline', itemCode: 'BILL_CARDS'},
    {itemName: 'Telecoms', icon: 'cellphone-basic', itemCode: 'BILL_COM'},
    {itemName: 'Placeholder Item', icon: 'qrcode-scan', itemCode: 'BILL_TEST'},
  ];

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF', paddingTop: useSafeAreaInsets().top}}>
      <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}}>
        {/* Name and header */}
        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 5, flexDirection: 'row'}}>
          <Image source={require('../../../../assets/testuser.png')} style={{width: 46, height: 46, borderRadius: 46, overflow: 'hidden'}} />
          <View style={{width: '100%', marginLeft: 10, justifyContent: 'center', marginTop: 0}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16}}>{NmGetTimeGreeting()}</Text>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18}}>{recname}</Text>
          </View>
        </View>

        {/* Shortcuts */}
        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <NmShortcutsPanel headerTitle={'Money Transfer'} items={SampleMoneyTransfer} containerStyle={{marginTop: 0}} />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <NmShortcutsPanel
            headerTitle={'Pay Bills'}
            items={SamplePayItems}
            containerStyle={{marginTop: 0}}
            // onPress={item => {
            //   if (item.itemName != 'More') {
            //     props.navigation.navigate('PaymentScreen', {billInfo: item});
            //   }
            // }}
          />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 10}}>
          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 0, alignItems: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Recent Transactions'}</Text>
            <Text
              style={{color: '#337DFF', fontFamily: 'Poppins-Regular', fontSize: 16}}
              onPress={() => {
                NmNavigateTo('PaymentHistory', props);
              }}>
              {'See all'}
            </Text>
          </View>

          {SampleRecentItems.slice(0, 5).map((item, index) => {
            const imageLength = width * 0.15;

            return (
              <TouchableOpacity key={index} activeOpacity={0.5} style={{width: '100%', padding: 10, marginBottom: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F6F6'}}>
                <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginRight: 10}}>
                  <Image source={item.tranIcon} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
                </View>
                <View style={{flex: 1, width: '100%'}}>
                  <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#777', fontFamily: 'Poppins-Regular'}}>{item.tranType}</Text>
                    <Text style={{color: '#555', fontFamily: 'Poppins-Bold'}}>{item.tranMerchant}</Text>
                  </View>
                  <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#777', fontFamily: 'Poppins-Regular'}}>{'Amount'}</Text>
                    <Text style={{color: '#555', fontFamily: 'Poppins-Bold'}}>{NmGetCurrencyFormat(item.tranAmount, 'PHP', 2)}</Text>
                  </View>
                  <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#777', fontFamily: 'Poppins-Regular'}}>{'Date'}</Text>
                    <Text style={{color: '#555', fontFamily: 'Poppins-Bold'}}>{item.tranDate}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
    // </TouchableWithoutFeedback>
  );
};

export default PaymentHome;
