import React, {useState, useEffect} from 'react';
import {View, StatusBar, Text, StyleSheet, FlatList} from 'react-native';

const TransportChat = props => {
  return (
    <View style={{flex: 1, width: '100%', height: '100%'}}>
      <StatusBar backgroundColor={'#FFF'} />
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Messages'}</Text>
      </View>
    </View>
  );
};

export default TransportChat;
