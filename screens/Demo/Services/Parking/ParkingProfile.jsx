import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';

import {SCREEN_WIDTH} from '../../../../constants/NmStyles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AccountDetailsContext} from '../../../../functions/Contexts';

const ParkingProfile = props => {
  const [searchValue, setSearchValue] = useState('');
  const {recname} = useContext(AccountDetailsContext);

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF'}}>
      <ScrollView style={{width: SCREEN_WIDTH}} contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 20,
            paddingTop: useSafeAreaInsets().top + 10,
            alignItems: 'center',
            backgroundColor: '#133561',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
          <Image source={require('../../../../assets/testuser.png')} style={{width: 100, height: 100, borderRadius: 100, overflow: 'hidden', marginBottom: 10}} />
          <Text style={[styles.poppinsBlack.bold, {fontSize: 18, color: '#FFF'}]}>{recname}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  activeBookingBackground: {
    flex: 1,
    backgroundColor: '#FFF',
    width: undefined,
    height: undefined,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    marginHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginBottom: 10,
  },
  poppinsBlack: {
    regular: {fontFamily: 'Poppins-Regular', color: '#000'},
    medium: {fontFamily: 'Poppins-Medium', color: '#000'},
    bold: {fontFamily: 'Poppins-Bold', color: '#000'},
  },
});

export default ParkingProfile;
