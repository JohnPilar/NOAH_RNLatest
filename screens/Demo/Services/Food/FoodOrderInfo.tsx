import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import {NmButton, LoadingPanel, LoadingScreen} from '../../../../components';
import NmStyles, {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmGetCurrencyFormat, NmGetDate, NmTicketDate} from '../../../../functions/NmFunctions';
import {AccountDetailsContext} from '../../../../functions/Contexts';
import {useNavigation} from '@react-navigation/native';

interface FoodOrderInfoProps {
  route?: {
    params?: {
      orderInfo?: any;
    };
  };
}

export default function FoodOrderInfo(props: FoodOrderInfoProps): React.JSX.Element {
  const orderInfo = props?.route?.params?.orderInfo;
  const itemList = orderInfo.items;
  const {recname} = useContext(AccountDetailsContext);
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(true);
  const [screenLoad, setScreenLoad] = useState<boolean>(false);
  const [buttonTitle, setButtonTitle] = useState<string>('Cancel Order');
  //props?.route?.params?.orders;
  let SellerList: any[] = [];

  itemList.forEach((item: any) => {
    if (SellerList.includes(item.itemSeller) == false) {
      SellerList.push(item.itemSeller);
    }
  });

  let TotalPerSeller = 0;

  let tmpTotal = itemList.reduce((accumulator: number, item: any) => accumulator + item.itemQuantity * item.itemPrice, 0);
  let tmpDF = itemList.reduce((accumulator: number, item: any) => accumulator + 30, 0);
  let itemsTotalCount = itemList.reduce((accumulator: number, item: any) => accumulator + item.itemQuantity, 0);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = (item: any, index: number): React.JSX.Element => {
    const imgDimensions = WINDOW_WIDTH * 0.16;

    TotalPerSeller += item.itemPrice * item.itemQuantity;

    return (
      <View key={index} style={{width: '100%', flexDirection: 'row', marginVertical: 5, borderRadius: 8, borderColor: '#EEE', paddingVertical: 10, borderWidth: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 5, marginLeft: 5, width: '10%'}}>
          <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{item.itemQuantity}</Text>
          <Text style={[NmStyles.poppinsRegular, {fontSize: 16}]}>{'  X'}</Text>
        </View>

        <View style={{marginLeft: 5, alignItems: 'center'}}>
          <Image source={item.itemImage} style={{width: imgDimensions, height: imgDimensions, borderRadius: 12}} resizeMode="cover" />
        </View>

        <View style={{flex: 1, justifyContent: 'center', marginLeft: 10, paddingRight: 10}}>
          <Text style={[NmStyles.poppinsBold, {fontSize: 16}]} numberOfLines={1}>
            {item.itemName}
          </Text>
          <Text style={[NmStyles.poppinsBold]}>{NmGetCurrencyFormat(item.itemPrice, 'PHP', 2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {screenLoad && <LoadingScreen />}
      {/* <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={[NmStyles.poppinsBold, {fontSize: 20, paddingVertical: 10}]}>{'Checkout'}</Text>
      </View> */}
      <View style={{flex: 1}}>
        {loading == true ? (
          <LoadingPanel />
        ) : (
          <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
              <View style={{width: '100%', paddingHorizontal: 16, marginBottom: 0, justifyContent: 'flex-start'}}>
                <View
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: '#FFF',
                    paddingTop: 10,
                    paddingHorizontal: 10,
                    paddingBottom: 5,
                    marginTop: 10,
                  }}>
                  <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons style={{padding: 5}} name={'map-marker-radius-outline'} size={28} color={'#236BEA'} />
                    <View style={{flex: 1, justifyContent: 'center', marginLeft: 10}}>
                      <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{recname}</Text>
                      <Text style={[NmStyles.poppinsRegular, {fontSize: 16}]}>{'177A Bleecker St. Brooklyn, New York'}</Text>
                    </View>
                  </View>
                  <View style={{flex: 1, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#AAA', paddingVertical: 5, marginTop: 5}}>
                    <View style={styles.ongoingDetailsRow}>
                      <Text style={[styles.ongoingRowTitle]}>{'Order No: '}</Text>
                      <Text style={[styles.ongoingRowInfo]}>{orderInfo.orderNumber}</Text>
                    </View>
                    <View style={styles.ongoingDetailsRow}>
                      <Text style={[styles.ongoingRowTitle]}>{'Date Ordered: '}</Text>
                      <Text style={[styles.ongoingRowInfo]}>{orderInfo.orderDate}</Text>
                    </View>
                    <View style={styles.ongoingDetailsRow}>
                      <Text style={[styles.ongoingRowTitle]}>{'Status: '}</Text>
                      <Text style={[styles.ongoingRowInfo]}>{orderInfo.orderStatus}</Text>
                    </View>
                  </View>
                </View>

                {SellerList.map((seller: any, index: number) => {
                  TotalPerSeller = 0;
                  return (
                    <View key={seller} style={{width: '100%', borderRadius: 12, backgroundColor: '#FFF', paddingTop: 10, paddingHorizontal: 10, paddingBottom: 5, marginTop: 10}}>
                      <View style={{width: '100%'}}>
                        <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{seller}</Text>
                      </View>
                      {itemList.map((item: any, index: number) => {
                        if (item.itemSeller == seller) {
                          return renderItem(item, index);
                        }
                      })}
                      <View style={{width: '100%', alignItems: 'flex-end', paddingRight: 5}}>
                        <Text style={[NmStyles.poppinsMedium, {fontSize: 15}]}>{'Total: '.concat(NmGetCurrencyFormat(TotalPerSeller, 'PHP', 2))}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={{width: '100%', paddingHorizontal: 16, marginBottom: 0, justifyContent: 'flex-end'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: 12,
                    backgroundColor: '#FFF',
                    paddingTop: 10,
                    paddingHorizontal: 10,
                    paddingBottom: 5,
                    marginTop: 10,
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={[NmStyles.poppinsRegular, {fontSize: 16}]}>{'Payment Method'}</Text>
                    <TouchableOpacity activeOpacity={0.5} style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{'MasterCard [**** 0123]'}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* <MaterialCommunityIcons style={{marginLeft: 3, marginBottom: 4}} name={'greater-than'} size={14} color={'#236BEA'} /> */}
                </View>
              </View>
            </ScrollView>
            <View style={{width: '100%'}}>
              <View style={{width: '100%', borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: '#FFF', paddingTop: 10, paddingHorizontal: 16, paddingBottom: 10, marginTop: 10}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={[NmStyles.poppinsRegular, {fontSize: 16}]}>{'Item Subtotal: '.concat(itemsTotalCount).concat(' Item(s)')}</Text>
                  <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{NmGetCurrencyFormat(tmpTotal, 'PHP', 2)}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={[NmStyles.poppinsRegular, {fontSize: 16}]}>{'Delivery Fee:'}</Text>
                  <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{NmGetCurrencyFormat(tmpDF, 'PHP', 2)}</Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#AAA', paddingVertical: 5}}>
                  <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{'Total (VAT included):'}</Text>
                  <Text style={[NmStyles.poppinsBold, {fontSize: 16}]}>{NmGetCurrencyFormat(tmpTotal + tmpDF, 'PHP', 2)}</Text>
                </View>

                <NmButton
                  buttonTheme={'dark'}
                  style={{borderRadius: 12, marginTop: 5}}
                  titleStyle={{}}
                  title={buttonTitle}
                  onPress={() => {
                    //Cancel Only - Hide button when status is cancelled
                    setScreenLoad(true);
                    let orderObject = orderInfo;

                    orderObject.orderType = 'CANCELLED';
                    orderObject.orderStatus = 'Order Cancelled';
                    orderObject.orderDate = NmTicketDate(new Date()).concat(', '.concat(NmGetDate(new Date(), 'customFormat', 'hh:mm a')));

                    EventRegister.emit('updateOngoingOrders', orderObject);

                    setTimeout(() => {
                      navigation.goBack();
                    }, 1500);
                  }}
                />
              </View>
            </View>
          </View>
        )}
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
