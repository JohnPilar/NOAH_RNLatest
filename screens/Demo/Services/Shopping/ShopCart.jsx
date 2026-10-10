import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Dimensions, FlatList} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {ShopCartContext} from '../../../../functions/Contexts';

const ShopCart = props => {
  const cartContext = useContext(ShopCartContext);
  const [cartItems, setCartItems] = useState(cartContext);

  const SCREEN_WIDTH = Dimensions.get('window').width;

  useEffect(() => {
    setCartItems(cartContext);
  }, [cartContext]);

  const renderItem = ({item, index}) => {
    //
  };

  return (
    <View style={{flex: 1, width: '100%', height: '100%'}}>
      {cartItems.length == 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <MaterialCommunityIcons style={{padding: 10}} name={'cart'} size={50} color={'#777'} />
          <Text style={{color: '#777', fontFamily: 'Poppins-Medium', fontSize: 18}}>{'Your cart is empty'}</Text>
          <Text style={{color: '#777', fontFamily: 'Poppins-Regular', fontSize: 12}}>{"Looks like you haven't decided yet"}</Text>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <FlatList data={cartItems} renderItem={renderItem} keyExtractor={(item, index) => index} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} />
        </View>
      )}
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

export default ShopCart;
