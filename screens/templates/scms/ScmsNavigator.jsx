import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import UploaderScreen from './reports/UploaderScreen';

const Stack = createStackNavigator();

const ScmsNavigator = props => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UploaderScreen" component={UploaderScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export default ScmsNavigator;
