import React, {useState} from 'react';
import {View, StatusBar, Text, FlatList, TextInput} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import NmStyles from '../../../../constants/NmStyles';
import NmColors from '../../../../constants/NmColors';

const TransportSchedule = props => {
  const [searchValue, setSearchValue] = useState();

  const SampleBusSchedules = [
    {
      locFrom: 'Antipolo',
      locTo: 'Quiapo',
      locvia: 'Aurora Boulevard',
      locSched: '06:00 AM - 11:00 PM',
    },
    {
      locFrom: 'PITx',
      locTo: 'BGC',
      locvia: 'Buendia Avenue',
      locSched: '05:00 AM - 08:00 PM',
    },
    {
      locFrom: 'Angono',
      locTo: 'Quiapo',
      locvia: 'Ortigas Avenue',
      locSched: '05:00 AM - 06:00 PM',
    },
    {
      locFrom: 'Angat',
      locTo: 'Divisoria',
      locvia: '',
      locSched: '04:00 AM - 05:00 PM',
    },
    {
      locFrom: 'Ayala',
      locTo: 'Alabang',
      locvia: '',
      locSched: '05:00 AM - 05:00 PM',
    },
    {
      locFrom: 'Balagtas',
      locTo: 'PITx',
      locvia: '',
      locSched: '05:00 AM - 06:00 PM',
    },
    {
      locFrom: 'Fairview',
      locTo: 'Ayala',
      locvia: 'Quezon Avenue',
      locSched: '04:00 AM - 07:00 PM',
    },
    {
      locFrom: 'Biñan',
      locTo: 'Plaza Lawton',
      locvia: '',
      locSched: '04:30 AM - 07:00 PM',
    },
  ];

  const renderItem = ({item, index}) => {
    return (
      <View key={index} style={{width: '100%', marginBottom: 10}}>
        <View style={{width: '100%', padding: 10, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', borderRadius: 12}}>
          <MaterialCommunityIcons name={'bus'} size={30} color={'#28396f'} style={{marginHorizontal: 10}} />
          <View style={{flex: 1, marginLeft: 10}}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}></View> */}
            <Text style={{fontFamily: 'Poppins-Bold', color: '#000', fontSize: 16}}>{item.locFrom + ' to ' + item.locTo}</Text>
            {item.locvia != '' && <Text style={{fontFamily: 'Poppins-Regular', color: '#AAA'}}>{'via ' + item.locvia}</Text>}
            <Text style={{fontFamily: 'Poppins-Medium', color: '#000', fontSize: 15}}>{item.locSched}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, width: '100%'}}>
      <StatusBar backgroundColor={'#FFF'} />

      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Bus Schedule'}</Text>
      </View>

      <View style={{width: '100%', paddingHorizontal: 16, marginTop: 0, backgroundColor: '#FFF'}}>
        <View style={[NmStyles.textInputContainer, {borderRadius: 12, borderWidth: 0, backgroundColor: '#f4f4f4', marginBottom: 10}]}>
          <View style={{paddingLeft: 10, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <MaterialCommunityIcons style={{paddingHorizontal: 0}} name={'magnify'} size={30} color={'#CCC'} />
          </View>
          <TextInput
            style={[NmStyles.textInput, {marginLeft: -2}]}
            placeholderTextColor={NmColors.placeholderTextColor}
            onChangeText={value => setSearchValue(value)}
            value={searchValue}
            placeholder="Search by location"
          />
        </View>
      </View>

      <View style={{flex: 1, width: '100%', paddingHorizontal: 16, marginTop: 10}}>
        <FlatList data={SampleBusSchedules} renderItem={renderItem} keyExtractor={(item, index) => index} />
      </View>
    </View>
  );
};

export default TransportSchedule;
