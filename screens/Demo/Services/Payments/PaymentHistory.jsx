import React, {useEffect, useState, useRef} from 'react';
import {View, FlatList, Text, Image, TouchableOpacity, StatusBar} from 'react-native';
import {WINDOW_WIDTH} from '../../../../constants/NmStyles';

import {NmGetCurrencyFormat} from '../../../../functions/NmFunctions';
import {LoadingPanel} from '../../../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SampleRecentItems} from '../../../../Global/GlobalVariable';

const PaymentHistory = props => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });

  const histRef = useRef();

  const renderItem = ({item, index}) => {
    const imageLength = WINDOW_WIDTH * 0.15;

    return (
      <TouchableOpacity key={index} activeOpacity={0.5} style={{width: '100%', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#EEE', borderRadius: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF'}}>
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
  };

  return (
    <View style={{flex: 1, width: '100%', height: '100%'}}>
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF', paddingTop: useSafeAreaInsets().top}}>
        <Text
          style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, marginTop: 5, paddingVertical: 10}}
          onPress={() => {
            histRef.current.scrollToIndex({index: 0, animated: true});
          }}>
          {'Transaction History'}
        </Text>
      </View>

      <View style={{flex: 1, width: '100%', paddingHorizontal: 16, marginTop: 10, marginBottom: 10, alignItems: 'center'}}>
        {loading ? <LoadingPanel panelStyle={{backgroundColor: undefined}} /> : <FlatList ref={histRef} data={SampleRecentItems} renderItem={renderItem} keyExtractor={(item, index) => index} style={{width: '100%'}} />}
      </View>
    </View>
  );
};

export default PaymentHistory;
