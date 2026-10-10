import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default function FoodChat(props) {
  return (
    <View style={styles.container}>
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Messages'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
