import {createStackNavigator} from '@react-navigation/stack';

import WebViewerHome from '../../WebViewerHome';
import TabsNavigator from './TabsNavigator';
import MessageList from '../../Communication/MessageList';
import MessageThread from '../../Communication/MessageThread';
import ContactSearch from '../../Communication/ContactSearch';
import AssistantScreen from '../../Communication/AssistantScreen';
import WebWatsonx from '../../Communication/WebWatsonx';

const Stack = createStackNavigator();

const AppScreenContent = props => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TabsNavigator" component={TabsNavigator} options={{headerShown: false}} />

      <Stack.Screen name="MessageList" component={MessageList} options={{headerShown: false}} />
      <Stack.Screen name="MessageThread" component={MessageThread} options={{headerShown: false}} />
      <Stack.Screen name="ContactSearch" component={ContactSearch} options={{headerShown: false}} />
      <Stack.Screen name="AssistantScreen" component={AssistantScreen} options={{headerShown: false}} />
      <Stack.Screen name="WebWatsonx" component={WebWatsonx} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export default AppScreenContent;
