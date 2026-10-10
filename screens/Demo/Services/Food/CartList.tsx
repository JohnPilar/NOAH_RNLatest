import React, {memo, useCallback, useEffect, useState, useContext} from 'react';
import {View, Text, FlatList, ListRenderItem} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import CartItem from './CartItem';
import {FoodCartContext} from '../../../../functions/Contexts';
import {LoadingPanel} from '../../../../components';
import {useIsFocused} from '@react-navigation/native';
import NmStyles from '../../../../constants/NmStyles';

type CartItemData = {
  itemId: string | number;
  itemPrice: number | string;
  itemQuantity: number;
  [key: string]: any;
};

type CartContextValue = CartItemData[];

type CartItemId = string;

const CartList = () => {
  const isFocused = useIsFocused();
  const foodContext = useContext(FoodCartContext) as CartContextValue;

  const [myOrders, setMyOrders] = useState<Record<string, CartItemData>>({});
  const [itemIDS, setItemIDS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFocused) {
      EventRegister.emit('updateItemCount', {
        data: undefined,
        command: 'UPDATE_CART',
      });
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [isFocused]);

  useEffect(() => {
    if (foodContext.length !== 0) {
      const tmpArray = foodContext;
      const tmpIds: CartItemId[] = [];
      const tmpItems: Record<string, CartItemData> = {};

      tmpArray.forEach(element => {
        tmpIds.push(element.itemId.toString());
        tmpItems[element.itemId.toString()] = element;
      });

      setItemIDS(tmpIds);
      setMyOrders(tmpItems);
    } else {
      setItemIDS([]);
      setMyOrders({});
    }
  }, [foodContext]);

  useEffect(() => {
    const tmpItems: Array<{
      itemId: CartItemId;
      itemPrice: number | string;
      itemQuantity: number;
    }> = [];

    if (Object.keys(myOrders).length > 0) {
      Object.values(myOrders).forEach(value => {
        tmpItems.push({
          itemId: value.itemId.toString(),
          itemPrice: value.itemPrice,
          itemQuantity: value.itemQuantity,
        });
      });
    }

    EventRegister.emit('updateItemCount', {
      data: tmpItems,
      command: 'UPDATE_COUNT',
    });
  }, [myOrders]);

  const renderItem: ListRenderItem<CartItemId> = useCallback(
    ({item}) => {
      return <CartItem cartItem={item} myOrders={myOrders} setMyOrders={setMyOrders} />;
    },
    [myOrders],
  );

  return (
    <View style={{flex: 1}}>
      {itemIDS.length > 0 ? (
        <FlatList
          data={isFocused ? itemIDS : []}
          renderItem={renderItem}
          keyExtractor={item => item.toString()}
          style={{width: '100%'}}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={() => {
            return <LoadingPanel panelStyle={{backgroundColor: undefined}} />;
          }}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[NmStyles.poppinsBold, {color: '#555', fontSize: 20}]}>{'Empty'}</Text>
          <Text style={[NmStyles.poppinsMedium, {color: '#AAA', fontSize: 14}]}>{'Check popular food choices!'}</Text>
        </View>
      )}
    </View>
  );
};

export default memo(CartList);
