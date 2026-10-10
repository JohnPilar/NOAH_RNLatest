import React, {useState, useContext} from 'react';
import {useWindowDimensions, View, StyleSheet, Text, Image, StatusBar, TouchableOpacity, ImageBackground, ScrollView, DimensionValue} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NmSlidingBanner, NmImageSlider} from '../../../../components';
import {OngoingOrderContext} from './FoodNavigator';
import {NmGetCurrencyFormat} from '../../../../functions/NmFunctions';
import {AccountDetailsContext} from '../../../../functions/Contexts';
import {SampleFoodItems} from '../../../../Global/GlobalVariable';

interface FoodHomeProps {
  imageStyle?: any;
}

const FoodHome = (props: FoodHomeProps): React.JSX.Element => {
  const {recname} = useContext(AccountDetailsContext);
  const {width} = useWindowDimensions();
  const ongoingOrders = useContext(OngoingOrderContext);
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');

  const SampleAdItems = [
    {backgroundImage: require('../../../../assets/Images/Food/fads_1.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Food/fads_2.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Food/fads_3.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Food/fads_4.jpg'), url: ''},
  ];

  const SampleFoodCategories = [
    {itemName: 'Snacks', backgroundImage: require('../../../../assets/Images/Food/cat_snack.jpg'), url: '', screenName: ''},
    {itemName: 'Full Meals', backgroundImage: require('../../../../assets/Images/Food/cat_fullmeal.jpg'), url: '', screenName: ''},
    {itemName: 'Beverages', backgroundImage: require('../../../../assets/Images/Food/cat_beverages.jpg'), url: '', screenName: ''},
    {itemName: 'Burger', backgroundImage: require('../../../../assets/Images/Food/cat_burger.jpg'), url: '', screenName: ''},
    {itemName: 'Pizza', backgroundImage: require('../../../../assets/Images/Food/cat_pizza.jpg'), url: '', screenName: ''},
    {itemName: 'Noodles', backgroundImage: require('../../../../assets/Images/Food/cat_noodles.jpg'), url: '', screenName: ''},
    {itemName: 'Appetizer', backgroundImage: require('../../../../assets/Images/Food/cat_appetizer.jpg'), url: '', screenName: ''},
    {itemName: 'Salads', backgroundImage: require('../../../../assets/Images/Food/cat_salads.jpg'), url: '', screenName: ''},
  ];

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF'}}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}}>
        {/* Name and header */}
        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../../assets/testuser.png')} style={{width: 46, height: 46, borderRadius: 46, overflow: 'hidden'}} />
          <View style={{flex: 1, width: '100%', marginLeft: 10, justifyContent: 'center', marginTop: 5}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16}}>{'Good Morning'}</Text>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18}}>{recname}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.5} style={{borderRadius: 60, borderWidth: 1, borderColor: '#236BEA'}}>
            <MaterialCommunityIcons name={'bell-badge-outline'} color={'#236BEA'} size={28} style={{padding: 8}} />
          </TouchableOpacity>
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 10}}>
          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Active Order'}</Text>
          </View>

          {ongoingOrders.length > 0 ? (
            <View style={[{width: '100%', justifyContent: 'center'}]}>
              <ImageBackground
                style={[
                  {
                    flex: 1,
                    backgroundColor: '#FFF',
                    width: undefined,
                    height: undefined,
                    borderRadius: 12,
                    overflow: 'hidden',
                    padding: 10,
                    justifyContent: 'flex-end',
                  },
                ]}
                imageStyle={[{resizeMode: 'cover', opacity: 0.8}, props.imageStyle]}
                source={require('../../../../assets/Images/Food/order_background.jpg')}>
                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderRadius: 12,
                    paddingVertical: 5,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                    <Text style={styles.activeOrderTitle}>{'Order No: '}</Text>
                    <Text style={styles.activeOrderInfo}>{ongoingOrders[0].orderNumber}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                    <Text style={styles.activeOrderTitle}>{'Quantity: '}</Text>
                    <Text style={styles.activeOrderInfo}>
                      {ongoingOrders[0].totalItemCount
                        .toString()
                        .concat(' ')
                        .concat(ongoingOrders[0].totalItemCount > 1 ? 'items' : 'item')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                    <Text style={styles.activeOrderTitle}>{'Total Amount: '}</Text>
                    <Text style={styles.activeOrderInfo}>{NmGetCurrencyFormat(ongoingOrders[0].totalAmount, 'PHP', 2)}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                    <Text style={styles.activeOrderTitle}>{'Status: '}</Text>
                    <Text style={styles.activeOrderInfo}>{ongoingOrders[0].orderStatus}</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          ) : (
            <View>
              <Text style={{color: '#AAA', fontFamily: 'Poppins-Regular', fontSize: 18}}>{'No active orders'}</Text>
            </View>
          )}
        </View>

        <NmSlidingBanner
          data={SampleAdItems}
          containerStyle={{marginTop: 20, paddingHorizontal: 16}}
          onPress={() => {
            //
          }}
        />

        <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center', paddingHorizontal: 16}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Categories'}</Text>
          <Text style={{color: '#337DFF', fontFamily: 'Poppins-Regular', fontSize: 16}}>{'See all'}</Text>
        </View>
        <NmImageSlider
          hideHeader={true}
          data={SampleFoodCategories}
          removeLastItemMarginRight={true}
          containerStyle={{marginTop: 0, paddingHorizontal: 16}}
          headerContainerStyle={{backgroundColor: undefined}}
          mainContainerStyle={{paddingHorizontal: 0, marginHorizontal: 0}}
          itemContainerStyle={{backgroundColor: '#FFF', margin: 0, marginTop: 0, marginRight: 10}}
          textContainerStyle={{alignItems: 'center'}}
          textStyle={{fontSize: 14}}
        />

        <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center', paddingHorizontal: 16}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Popular'}</Text>
          <Text style={{color: '#337DFF', fontFamily: 'Poppins-Regular', fontSize: 16}}>{'See all'}</Text>
        </View>

        <View style={{width: '100%', paddingHorizontal: 16}}>
          {SampleFoodItems.slice(0, 3).map((item, index) => {
            const imageDimensions = width * 0.2;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={{width: '100%', padding: 10, flexDirection: 'row', backgroundColor: '#f4f4f4', borderWidth: StyleSheet.hairlineWidth, borderColor: '#DDD', borderRadius: 12, marginBottom: 10}}>
                <View
                  style={{
                    width: imageDimensions,
                    height: imageDimensions,
                    borderRadius: 12,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: '#DDD',
                    marginRight: 10,
                    overflow: 'hidden',
                    backgroundColor: '#FFF',
                  }}>
                  <Image source={item.itemImage} style={{flex: 1, width: undefined, height: undefined}} />
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}} numberOfLines={1}>
                    {item.itemName}
                  </Text>
                  <Text style={{color: '#AAA', fontFamily: 'Poppins-Medium'}} numberOfLines={1}>
                    {item.itemSeller}
                  </Text>
                  <Text style={{color: '#000', fontFamily: 'Poppins-Bold'}} numberOfLines={1}>
                    {item.itemPrice}
                  </Text>
                  {/* <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                    <MaterialCommunityIcons name={'star'} color={'#ffe234'} size={20} />
                    <Text style={{color: '#000', fontFamily: 'Poppins-Medium', marginTop: 3}}>{item.rating}</Text>
                  </View> */}
                </View>
                <View style={{justifyContent: 'center'}}>
                  <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                    <MaterialCommunityIcons name={'star'} color={'#ffe234'} size={24} />
                    <Text style={{color: '#000', fontFamily: 'Poppins-Medium', marginTop: 5, fontSize: 16}}>{item.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  activeOrderTitle: {
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  activeOrderInfo: {
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
});

export default FoodHome;
