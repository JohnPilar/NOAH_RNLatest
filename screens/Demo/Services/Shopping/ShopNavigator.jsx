import {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ShopCartContext} from '../../../../functions/Contexts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import ShopHome from './ShopHome';
import ShopBrowse from './ShopBrowse';
import ShopCart from './ShopCart';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const ShopNavigator = props => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateCartItems', data => {
      setCartItems(data);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  const bottomTools = [
    {destination: 'ShopHome', icon: 'store'},
    {destination: 'ShopBrowse', icon: 'format-list-bulleted'},
    {destination: 'ShopCart', icon: 'cart-outline'},
    {destination: 'test', icon: 'heart-outline'},
    {destination: 'test', icon: 'account-outline'},
  ];

  const ShopToolbar = ({state, navigation}) => {
    return (
      <View style={{paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#133561'}}>
        {bottomTools.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={() => {
                if (item.destination == 'test') {
                  let tmpItems = {
                    shopId: '100001',
                    items: [{productId: '100001', productName: 'Nokia 6220 Classic', productVariation: 'Black', productPrice: '$200.29', productQty: 1}],
                  };

                  //Adding item logic - start
                  let tmpShopIdIndex = -1;
                  try {
                    tmpShopIdIndex = cartItems.findIndex(k => k.shopId == '100001');
                  } catch (error) {} //Check if cart contains same shop

                  if (tmpShopIdIndex != -1) {
                    //shop already exists
                    let tmpShopItems = cartItems[tmpShopIdIndex].items;

                    let tmpShopItemIndex = -1;
                    try {
                      tmpShopItemIndex = tmpShopItems.findIndex(k => k.productId == '100002');
                    } catch (error) {} //check if same product with same shop exists in cart

                    if (tmpShopItemIndex != -1) {
                      //product exists, increase qty (or show error if there is a purchase limit per order)
                      tmpShopItems[tmpShopItemIndex].productQty += 1;
                    } else {
                      //product does not exist yet with the same shop, add it
                      tmpShopItems.push({productId: '100002', productName: 'Nokia 6220 Classic', productVariation: 'White', productPrice: '$200.29', productQty: 1});
                    }

                    tmpItems.items = tmpShopItems;
                  }

                  setCartItems([...cartItems, tmpItems]);
                  //Adding item logic - end
                } else {
                  navigation.navigate(item.destination);
                }
              }}
              style={{}}>
              {item.icon == 'cart-outline' && (
                <Text
                  style={{
                    position: 'absolute',
                    marginLeft: 1,
                    top: -10,
                    zIndex: 1,
                    color: index == state.index ? '#FFF' : 'rgba(255,255,255,0.4)',
                    fontFamily: 'Poppins-Bold',
                    width: '100%',
                    textAlign: 'center',
                  }}></Text>
              )}
              <MaterialCommunityIcons style={{padding: 10}} name={item.icon} size={28} color={index == state.index ? '#FFF' : 'rgba(255,255,255,0.4)'} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ShopCartContext.Provider value={cartItems}>
      <Tab.Navigator tabBar={props => <ShopToolbar {...props} />} sceneContainerStyle={{paddingTop: useSafeAreaInsets().top, backgroundColor: '#EEE'}}>
        <Tab.Screen name="ShopHome" component={ShopHome} options={{headerShown: false}} />
        <Tab.Screen name="ShopBrowse" component={ShopBrowse} options={{headerShown: false}} />
        <Tab.Screen name="ShopCart" component={ShopCart} options={{headerShown: false}} />
      </Tab.Navigator>
    </ShopCartContext.Provider>
  );
};

export default ShopNavigator;
