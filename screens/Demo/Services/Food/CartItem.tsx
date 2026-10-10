import React, {memo, Dispatch, SetStateAction} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity, ImageSourcePropType} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NmStyles, {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmGetCurrencyFormat} from '../../../../functions/NmFunctions';

const imgDimensions = WINDOW_WIDTH * 0.2;

type CartItemData = {
  itemId: string | number;
  itemName: string;
  itemImage: ImageSourcePropType;
  itemSeller: string;
  itemPrice: number;
  itemQuantity: number;
};

type CartItemProps = {
  cartItem: string;
  myOrders: Record<string, any>;
  setMyOrders: Dispatch<SetStateAction<Record<string, any>>>;
  thisItem?: CartItemData;
};

const CartItem = ({cartItem, myOrders, setMyOrders, thisItem}: CartItemProps) => {
  const {itemId, itemName, itemImage, itemSeller, itemPrice, itemQuantity} = myOrders[cartItem];

  return (
    <View
      key={itemId}
      style={{
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        alignItems: 'center',
      }}>
      <Image
        source={itemImage}
        style={{
          width: imgDimensions,
          height: imgDimensions,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#EEE',
          marginHorizontal: 5,
        }}
        resizeMode="cover"
      />

      <View style={{flex: 1, marginLeft: 10, justifyContent: 'center'}}>
        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={[NmStyles.poppinsBold, {fontSize: 16}]} numberOfLines={1}>
            {itemName}
          </Text>

          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                const tmpItem = {
                  itemId: cartItem,
                  itemAction: 'DELETE',
                };

                EventRegister.emit('updateFoodOrders', tmpItem);
              }}>
              <MaterialCommunityIcons style={{padding: 2}} name={'close'} size={20} color={'#AAA'} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[NmStyles.poppinsMedium, {color: '#777'}]} numberOfLines={1}>
          {itemSeller}
        </Text>

        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{NmGetCurrencyFormat(itemPrice, 'PHP', 2)}</Text>

          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '35%'}}>
            <TouchableOpacity
              onPress={() => {
                if (itemQuantity > 1) {
                  const existingItem = {
                    ...myOrders[cartItem],
                    itemQuantity: myOrders[cartItem].itemQuantity - 1,
                  };

                  setMyOrders({...myOrders, [cartItem]: existingItem});
                }
              }}>
              <MaterialCommunityIcons style={{padding: 2}} name={'minus'} size={20} color={'#AAA'} />
            </TouchableOpacity>

            <Text
              style={[
                NmStyles.poppinsRegular,
                {
                  width: 34,
                  fontSize: 16,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderRadius: 6,
                  borderColor: '#DDD',
                  paddingHorizontal: 10,
                  paddingTop: 3,
                  textAlign: 'center',
                },
              ]}>
              {itemQuantity}
            </Text>

            <TouchableOpacity
              onPress={() => {
                const existingItem = {
                  ...myOrders[cartItem],
                  itemQuantity: myOrders[cartItem].itemQuantity + 1,
                };

                setMyOrders({...myOrders, [cartItem]: existingItem});
              }}>
              <MaterialCommunityIcons style={{padding: 2}} name={'plus'} size={20} color={'#AAA'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(CartItem);
