import React, {useEffect, useState, useContext} from 'react';
import {useWindowDimensions, View, Text, FlatList, StatusBar, StyleSheet, Image, TouchableOpacity, ListRenderItem} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import NmStyles from '../../../../constants/NmStyles';
import {ItemTotalContext, OngoingOrderContext} from './FoodNavigator';
import {NmButton} from '../../../../components';
import NmColors from '../../../../constants/NmColors';
import {NmGetCurrencyFormat} from '../../../../functions/NmFunctions';
import CartList from './CartList';

type OrderTab = 'In Cart' | 'Ongoing' | 'Completed';

interface FoodOrdersProps {
  navigation: any;
}

const ORDER_TABS: OrderTab[] = ['In Cart', 'Ongoing', 'Completed'];

function FoodOrders(props: FoodOrdersProps): React.JSX.Element {
  const {width} = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<OrderTab>('In Cart');

  const ongoingContext = useContext(OngoingOrderContext);
  const ongoingItems = ongoingContext.filter((k: any) => k.orderType === 'ONGOING');
  const completedItems: any[] = [];

  const InCartList = (): React.JSX.Element => {
    return (
      <View style={{flex: 1, width: '100%'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              width: '100%',
              backfaceVisibility: 'visible',
              paddingHorizontal: 16,
              marginTop: 10,
            }}>
            <CartList />
          </View>
        </View>

        <BottomComponent />
      </View>
    );
  };

  const renderOngoing: ListRenderItem<any> = ({item, index}) => {
    const count = item.totalItemCount;
    const itemString = count > 1 ? ' items' : ' item';
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: 10,
          marginBottom: 10,
          borderWidth: 1,
          backgroundColor: '#FFF',
          borderColor: '#EEE',
          borderRadius: 12,
        }}
        onPress={() => {
          props.navigation.navigate('FoodOrderInfo', {orderInfo: item});
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 15,
          }}>
          <MaterialCommunityIcons name={'basket-outline'} size={28} color={'#133561'} />
        </View>

        <View style={{flex: 1}}>
          <View style={styles.ongoingDetailsRow}>
            <Text style={[styles.ongoingRowTitle]}>{'Order No: '}</Text>
            <Text style={[styles.ongoingRowInfo]}>{item.orderNumber}</Text>
          </View>
          <View style={styles.ongoingDetailsRow}>
            <Text style={[styles.ongoingRowTitle]}>{'Date Ordered: '}</Text>
            <Text style={[styles.ongoingRowInfo]}>{item.orderDate}</Text>
          </View>
          <View style={styles.ongoingDetailsRow}>
            <Text style={[styles.ongoingRowTitle]}>{'Total (' + count + itemString + '): '}</Text>
            <Text style={[styles.ongoingRowInfo]}>{NmGetCurrencyFormat(item.totalAmount, 'PHP', 2)}</Text>
          </View>
          <View style={styles.ongoingDetailsRow}>
            <Text style={[styles.ongoingRowTitle]}>{'Status: '}</Text>
            <Text style={[styles.ongoingRowInfo]}>{item.orderStatus}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const OngoingList = (): React.JSX.Element => {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {ongoingItems.length > 0 ? (
          <FlatList data={ongoingItems} renderItem={renderOngoing} keyExtractor={(_, index) => index.toString()} style={{width: '100%'}} contentContainerStyle={{flexGrow: 1}} />
        ) : (
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#555', fontFamily: 'Poppins-Bold', fontSize: 20}}>{'Empty'}</Text>
            <Text style={{color: '#AAA', fontFamily: 'Poppins-Medium', fontSize: 14}}>{"You don't have any active orders"}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderCompleted: ListRenderItem<any> = ({item, index}) => {
    const imageLength = width * 0.2;

    return (
      <TouchableOpacity
        key={index}
        style={{
          flexDirection: 'row',
          width: '100%',
          padding: 10,
          marginBottom: 10,
          backgroundColor: '#f5f5f5',
          borderWidth: 1,
          borderColor: '#EEE',
          borderRadius: 12,
        }}>
        <View
          style={{
            width: imageLength,
            height: imageLength,
            overflow: 'hidden',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#EEE',
          }}>
          <Image source={item.photo} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
        </View>
        <View style={{marginLeft: 10, justifyContent: 'center'}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}}>{item.name}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Medium'}}>{item.specialty}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 12}}>{item.date}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 12}}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const CompletedList = (): React.JSX.Element => {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {completedItems.length > 0 ? (
          <FlatList data={completedItems} renderItem={renderCompleted} keyExtractor={(_, index) => index.toString()} style={{width: '100%'}} />
        ) : (
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#555', fontFamily: 'Poppins-Bold', fontSize: 20}}>{'Empty'}</Text>
            <Text style={{color: '#AAA', fontFamily: 'Poppins-Medium', fontSize: 14}}>{'Start shopping now'}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={[NmStyles.poppinsBold, {fontSize: 20, paddingVertical: 10}]}>{'My Orders'}</Text>
      </View>

      {/* Top Tab Bar */}
      <View style={styles.tabBarContainer}>
        {ORDER_TABS.map(tab => {
          const isFocused = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, {borderBottomColor: isFocused ? NmColors.buttonLight : '#EEE'}]}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isFocused ? NmColors.buttonDark : 'gray',
                    opacity: isFocused ? 1 : 0.6,
                  },
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Screen Views */}
      <View style={{flex: 1}}>
        <View style={{flex: 1, display: activeTab === 'In Cart' ? 'flex' : 'none'}}>
          <InCartList />
        </View>

        <View style={{flex: 1, display: activeTab === 'Ongoing' ? 'flex' : 'none'}}>
          <OngoingList />
        </View>

        <View style={{flex: 1, display: activeTab === 'Completed' ? 'flex' : 'none'}}>
          <CompletedList />
        </View>
      </View>
    </View>
  );
}

const BottomComponent = (): React.JSX.Element | undefined => {
  const itemsContext = useContext(ItemTotalContext);
  const navigation = useNavigation();

  const [subtotal, setSubtotal] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  useEffect(() => {
    let tmpSubtotal = 0;
    let tmpDf = 0;

    itemsContext.forEach((element: any) => {
      tmpSubtotal += element.itemQuantity * element.itemPrice;
      tmpDf += 30;
    });

    setSubtotal(tmpSubtotal);
    setDeliveryFee(tmpDf);
  }, [itemsContext]);

  return itemsContext.length > 0 ? (
    <View>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          paddingTop: 10,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: '#AAA',
          backgroundColor: '#FFF',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[NmStyles.poppinsRegular, {fontSize: 16}]}>{'Subtotal:'}</Text>
          <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{NmGetCurrencyFormat(subtotal, 'PHP', 2)}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[NmStyles.poppinsRegular, {fontSize: 16}]}>{'Delivery Fee:'}</Text>
          <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{NmGetCurrencyFormat(deliveryFee, 'PHP', 2)}</Text>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: '#FFF',
        }}>
        <NmButton
          buttonTheme={'dark'}
          style={{borderRadius: 12}}
          titleStyle={{}}
          title="Checkout Items"
          onPress={() => {
            navigation.navigate('FoodCheckout' as never);
          }}
        />
      </View>
    </View>
  ) : undefined;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  tabBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 3,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
  },
  ongoingDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ongoingRowTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000',
  },
  ongoingRowInfo: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#000',
  },
});

export default FoodOrders;
