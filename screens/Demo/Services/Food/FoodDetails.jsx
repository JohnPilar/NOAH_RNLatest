import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

export default function FoodDetails(props) {
  const itemName = props?.route?.params?.itemName;

  return (
    <View style={styles.container}>
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{itemName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
});
