import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

import {KeyboardProvider} from 'react-native-keyboard-controller';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainDemoContext} from '../../functions/Contexts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import DemoHome from './DemoHome';
import MessageList from '../Communication/MessageList';
import MessageThread from '../Communication/MessageThread';
import {MessageList as SampleMessageList} from '../../Global/GlobalVariable';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MessagesStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MessagesList" component={MessageList} options={{headerShown: false}} />
      <Stack.Screen name="MessageThread" component={MessageThread} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const DemoNavigator = (props: any): React.JSX.Element => {
  const [messageList, setMessageList] = useState<any[]>(SampleMessageList);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('updateCartItems', (data: any) => {
      setCartItems(data);
    });

    let messageListener = EventRegister.addEventListener('updateMessages', (data: any) => {
      let newData = data;
      const userId = newData.userId;
      delete newData.userId;

      const threadIndex = messageList.findIndex((item: any) => item.userId == userId);
      const tempList = [...messageList];

      let threadObject = {...tempList[threadIndex]};
      threadObject.messages.push(newData);
      tempList[threadIndex] = threadObject;

      setMessageList(tempList);
      //}
    });

    return () => {
      if (typeof eventListener == 'string') {
        EventRegister.removeEventListener(eventListener);
      }

      if (typeof messageListener == 'string') {
        EventRegister.removeEventListener(messageListener);
      }
    };
  });

  const bottomTools = [
    {destination: 'DemoHome', icon: 'home-assistant'},
    {destination: 'DemoMessages', icon: 'chat-processing-outline'},
    {destination: 'DemoNotifications', icon: 'bell-ring'},
    {destination: 'ShopBrowse', icon: 'format-list-bulleted'},
    {destination: 'DemoAccount', icon: 'account-outline'},
  ];

  const ShopToolbar = ({state, navigation}: any): React.JSX.Element => {
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
                    tmpShopIdIndex = cartItems.findIndex((k: any) => k.shopId == '100001');
                  } catch (error) {} //Check if cart contains same shop

                  if (tmpShopIdIndex != -1) {
                    //shop already exists
                    let tmpShopItems = cartItems[tmpShopIdIndex].items;

                    let tmpShopItemIndex = -1;
                    try {
                      tmpShopItemIndex = tmpShopItems.findIndex((k: any) => k.productId == '100002');
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

                  //setCartItems([...cartItems, tmpItems]);
                  //Adding item logic - end
                }

                if (item.destination == 'DemoMessages') {
                  navigation.navigate('DemoMessages');
                }

                if (item.destination == 'DemoHome') {
                  navigation.navigate('DemoHome');
                }
              }}
              style={{}}>
              {item.icon == 'bell-ring' && (
                <Text
                  style={{
                    position: 'absolute',
                    top: -3,
                    zIndex: 1,
                    color: index == state.index ? '#FFF' : 'rgba(255,255,255,0.4)',
                    fontFamily: 'Poppins-Bold',
                    width: '100%',
                    textAlign: 'center',
                  }}>
                  {''}
                </Text>
              )}
              <MaterialCommunityIcons style={{padding: 10}} name={item.icon} size={28} color={index == state.index ? '#FFF' : 'rgba(255,255,255,0.4)'} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <KeyboardProvider>
      <MainDemoContext.Provider value={{cartItems, messageList, setMessageList}}>
        <Tab.Navigator tabBar={props => <ShopToolbar {...props} />}>
          <Tab.Screen name="DemoHome" component={DemoHome} options={{headerShown: false}} />
          <Tab.Screen name="DemoMessages" component={MessagesStack} options={{headerShown: false}} />
        </Tab.Navigator>
      </MainDemoContext.Provider>
    </KeyboardProvider>
  );
};

export default DemoNavigator;
