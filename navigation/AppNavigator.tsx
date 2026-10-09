import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import WebViewerHome from '../screens/WebViewerHome';

import EndpointScanner from '../screens/EndpointScanner';
import NotificationScreen from '../screens/NotificationScreen';
import HomepageScreen from '../screens/HomepageScreen';

import SettingsScreen from '../screens/SettingsScreen';
import BillingHistory from '../screens/PMO/BillingHistory';
import BasicInformation from '../screens/PMO/BasicInformation';
import TransactionHistory from '../screens/PMO/TransactionHistory';
import PaymentHistory from '../screens/PMO/PaymentHistory';
import NoticeHistory from '../screens/PMO/NoticeHistory';
import RequestEntry from '../screens/PMO/RequestEntry';
import OtherRequests from '../screens/PMO/OtherRequests';
import NotificationDemo from '../screens/Communication/NotificationDemo';

import MessageList from '../screens/Communication/MessageList';
import MessageThread from '../screens/Communication/MessageThread';
import ContactSearch from '../screens/Communication/ContactSearch';
import AssistantScreen from '../screens/Communication/AssistantScreen';
import WebWatsonx from '../screens/Communication/WebWatsonx';

import UnderConstruction from '../screens/UnderConstruction';

import {RootStackParamList} from './NavigationTypes';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = (): React.JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomepageScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="MessageList" component={MessageList} options={{headerShown: false}} />

      <Stack.Screen name="MessageThread" component={MessageThread} options={{headerShown: false}} />

      <Stack.Screen name="WebViewerHome" component={WebViewerHome} options={{headerShown: false}} />

      <Stack.Screen name="ContactSearch" component={ContactSearch} options={{headerShown: false}} />

      {/* <Stack.Screen name="ClockingHome" component={ClockingHome} options={{headerShown: false}} /> */}

      <Stack.Screen name="AssistantScreen" component={AssistantScreen} options={{headerShown: false}} />

      <Stack.Screen name="WebWatsonx" component={WebWatsonx} options={{headerShown: false}} />

      <Stack.Screen
        name="BasicInformation"
        component={BasicInformation}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="BillingHistory"
        component={BillingHistory}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="NoticeHistory"
        component={NoticeHistory}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="RequestEntry"
        component={RequestEntry}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="OtherRequests"
        component={OtherRequests}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ScanQR"
        component={EndpointScanner}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="NotificationDemo" component={NotificationDemo} options={{headerShown: false}} />

      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UnderConstructionAN"
        component={UnderConstruction}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
