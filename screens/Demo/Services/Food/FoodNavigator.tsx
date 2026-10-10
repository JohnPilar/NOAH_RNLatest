import {useState, useEffect, createContext} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';
import {FoodCartContext} from '../../../../functions/Contexts';

import FoodHome from './FoodHome';
import FoodOrders from './FoodOrders';
import FoodFavorites from './FoodFavorites';
import FoodChat from './FoodChat';
import FoodItems from './FoodItems';
import FoodDetails from './FoodDetails';
import FoodCheckout from './FoodCheckout';
import FoodOrderInfo from './FoodOrderInfo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function OrdersScreens(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FoodOrders" component={FoodOrders} options={{headerShown: false}} />
      <Stack.Screen name="FoodCheckout" component={FoodCheckout} options={{headerShown: false}} />
      <Stack.Screen name="FoodOrderInfo" component={FoodOrderInfo} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function ItemsScreens(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FoodItems" component={FoodItems} options={{headerShown: false}} />
      <Stack.Screen name="FoodDetails" component={FoodDetails} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const bottomTools = [
  {destination: 'FoodHome', icon: 'home-heart'},
  {destination: 'OrdersScreens', icon: 'cart-outline'},
  {destination: 'FoodFavorites', icon: 'heart-multiple-outline'},
  {destination: 'ItemsScreens', icon: 'food-outline'},
  {destination: 'FoodChat', icon: 'chat-processing-outline'},
];

export const ItemTotalContext = createContext<any>([]);
export const OngoingOrderContext = createContext<any>([]);

const FoodNavigator = (props: any): React.JSX.Element => {
  const [foodCart, setFoodCart] = useState<any[]>([]);
  const [itemsTotal, setItemsTotal] = useState<any[]>([]);

  const [ongoingOrders, setOngoingOrders] = useState<any[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateFoodOrders', (data: any) => {
      const foodItemIndex = foodCart.findIndex((item: any) => item.itemId == data.itemId);
      const totalIndex = itemsTotal.findIndex((item: any) => item.itemId == data.itemId);

      const updatedCart = [...foodCart];
      const updatedTotal = [...itemsTotal];

      if (data.itemAction == 'CLEAR') {
        setFoodCart([]);
        setItemsTotal([]);
      } else if (data.itemAction == 'DELETE') {
        updatedCart.splice(foodItemIndex, 1);
        updatedTotal.splice(totalIndex, 1);

        setFoodCart(updatedCart);
        setItemsTotal(updatedTotal);
      } else {
        let filteredCart = foodCart.filter((item: any) => item.itemId == data.itemId);

        if (filteredCart.length == 0) {
          setFoodCart([...foodCart, data]);
          setItemsTotal([...itemsTotal, {itemId: data.itemId, itemPrice: data.itemPrice, itemQuantity: data.itemQuantity}]);
        } else {
          let foodcartItem = {...foodCart[foodItemIndex]};
          let totalItem = {...itemsTotal[foodItemIndex]};

          foodcartItem.itemQuantity += 1;
          totalItem.itemQuantity += 1;

          updatedCart[foodItemIndex] = foodcartItem;
          updatedTotal[totalIndex] = totalItem;

          setFoodCart(updatedCart);
          setItemsTotal(updatedTotal);
        }
      }
    });

    return () => {
      if (typeof eventListener == 'string') EventRegister.removeEventListener(eventListener);
    };
  });

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateItemCount', (item: any) => {
      if (item.command == 'UPDATE_COUNT') {
        setItemsTotal(item.data);
      }

      if (item.command == 'UPDATE_CART') {
        if (foodCart.length > 0) {
          let tmpArray: any[] = [];

          foodCart.forEach((element: any) => {
            let priceIndex = itemsTotal.findIndex((v: any) => v.itemId == element.itemId);
            let foodItem = {...element, itemQuantity: itemsTotal[priceIndex].itemQuantity};

            tmpArray.push(foodItem);
          });

          setFoodCart(tmpArray);
        }
      }
    });

    return () => {
      if (typeof eventListener == 'string') EventRegister.removeEventListener(eventListener);
    };
  });

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateOngoingOrders', (orders: any) => {
      if (orders?.orderType == 'ONGOING') {
        const tempOngoingArray = [...ongoingOrders];
        tempOngoingArray.push(orders);
        setOngoingOrders(tempOngoingArray);
      }

      if (orders?.orderType == 'CANCELLED') {
        const tempCancelledArray = [...cancelledOrders];
        tempCancelledArray.push(orders);
        setCancelledOrders(tempCancelledArray);

        const cancelIndex = ongoingOrders.findIndex((ongoing: any) => ongoing.orderNumber == orders.orderNumber);
        let tempOngoingArray = [...ongoingOrders];
        tempOngoingArray.splice(cancelIndex, 1);

        setOngoingOrders(tempOngoingArray);
      }
    });

    return () => {
      if (typeof eventListener == 'string') EventRegister.removeEventListener(eventListener);
    };
  });

  const FoodToolbar = ({state, navigation}: any): React.JSX.Element => {
    return (
      <View style={{paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#133561'}}>
        {bottomTools.map((item: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: item.key,
                  canPreventDefault: true,
                });

                const isFocused = state.index === index;

                if (!isFocused && !event.defaultPrevented) {
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
    <FoodCartContext.Provider value={foodCart}>
      <ItemTotalContext.Provider value={itemsTotal}>
        <OngoingOrderContext.Provider value={ongoingOrders}>
          <Tab.Navigator tabBar={props => <FoodToolbar {...props} />} sceneContainerStyle={{paddingTop: useSafeAreaInsets().top, backgroundColor: '#FFF'}}>
            <Tab.Screen name="FoodHome" component={FoodHome} options={{headerShown: false}} />
            <Tab.Screen name="OrdersScreens" component={OrdersScreens} options={{headerShown: false}} />
            <Tab.Screen name="FoodFavorites" component={FoodFavorites} options={{headerShown: false}} />
            <Tab.Screen name="ItemsScreens" component={ItemsScreens} options={{headerShown: false}} />
            <Tab.Screen name="FoodChat" component={FoodChat} options={{headerShown: false}} />
          </Tab.Navigator>
        </OngoingOrderContext.Provider>
      </ItemTotalContext.Provider>
    </FoodCartContext.Provider>
  );
};

export default FoodNavigator;
