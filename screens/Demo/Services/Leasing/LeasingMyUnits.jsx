import React, {useState, useContext} from 'react';
import {View, StatusBar, Text, FlatList, TouchableOpacity, ImageBackground} from 'react-native';

import {LeasingContext} from '../../../../functions/Contexts';

const LeasingMyUnits = props => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [unitData, setUnitData] = useState();

  const SampleOwnerUnits = useContext(LeasingContext);

  const renderItem = ({item, index}) => {
    const statusColor = getStatusColor(item.unitStatus);

    return (
      <View key={index} style={{width: '100%', paddingVertical: 10}}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            props.navigation.navigate('LeasingInfo', {unitInfo: item.unitCode});
          }}
          style={{height: 250, backgroundColor: '#EEE', borderRadius: 12, overflow: 'hidden'}}>
          <ImageBackground style={{width: '100%', height: '100%', justifyContent: 'flex-end'}} source={item.unitImage} resizeMode="cover">
            <View style={{padding: 5, paddingLeft: 10, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.8)'}}>
              <Text style={{fontFamily: 'Poppins-Bold', fontSize: 18, color: '#000'}} numberOfLines={1}>
                {item.unitName}
              </Text>
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 18, color: '#000', marginTop: -4}} numberOfLines={1}>
                {item.unitNumber}
              </Text>
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 16, color: '#000', marginTop: -3}} numberOfLines={1}>
                {item.unitAddress}
              </Text>
              <Text style={{fontFamily: 'Poppins-Bold', fontSize: 18, color: statusColor}} numberOfLines={1}>
                {item.unitStatus}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  function getStatusColor(unitStatus) {
    switch (unitStatus) {
      case 'Active': {
        return '#30c219';
      }
      case 'Open for Lease': {
        return '#1d44ef';
      }
      case 'Idle': {
        return '#000';
      }
    }
  }

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF'}}>
      <StatusBar backgroundColor={'#FFF'} />
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'My Units'}</Text>
      </View>

      <View style={{flex: 1, width: '100%', paddingHorizontal: 16}}>
        <FlatList data={SampleOwnerUnits} renderItem={renderItem} keyExtractor={(item, index) => index} />
      </View>

      {/* <View style={{width: '100%', paddingHorizontal: 10, paddingVertical: 10, borderTopColor: '#FFF', borderTopWidth: StyleSheet.hairlineWidth}}>
        <NmButton
          buttonTheme={'dark'}
          style={{borderRadius: 12}}
          titleStyle={{}}
          title="Add New Property"
          onPress={() => {
            props.navigation.navigate('LeasingAddUnits');
          }}
        />
      </View> */}
    </View>
  );
};

export default LeasingMyUnits;
