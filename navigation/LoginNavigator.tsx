import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
//import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AccountDetailsProvider} from '../functions/Contexts';
import HomeDrawerNavigator from './HomeDrawerNavigator';
import SplashScreen from './SplashScreen';

import {CalendarScreen, DemoScreen, DemoScreenCanvas, DynamicScreen, EndpointInput, EndpointOption, LoginOptionScreen, LoginScreen, EndpointScanner, UnderConstruction} from '../screens';
import {NewEmail, NewPassword, OTPEmail, OTPMobile, RegistrationOption, RegistrationScreen, RegistrationSubmitted, ResetPasswordForm} from '../screens/AccountManagement';

import DynamicHome from '../screens/NOAHStandard/DynamicDemo/DynamicHome';

// ========= THIRD LAYOUT ========= //
import ItemScreen from '../screens/Demo/ItemScreen';
import {NmImageViewer} from '../components';
import ScheduleScreen from '../screens/Demo/ScheduleScreen';
import MapViewer from '../screens/Demo/MapViewer';

import {
  DemoNavigator,
  ShopNavigator,
  HospitalNavigator,
  PaymentNavigator,
  HandymanNavigator,
  FoodNavigator,
  LeasingNavigator,
  TransportNavigator,
  ParkingNavigator,
  DemoSingleAPI,
} from '../screens/Demo';

import ScmsNavigator from '../screens/templates/scms/ScmsNavigator';
import ClockingNavigator from '../screens/NOAHStandard/ClockingSystem/ClockingNavigator';
import LoginVariantOne from '../screens/NOAHStandard/LoginVariantOne';
import UpdatesWebview from '../screens/NOAHStandard/UpdatesWebview';

import {IDVerificationFlow} from '../screens/NOAHStandard/IDScanner';

import {V3_LoginNavigatorWrapper} from '../screens/layout/third_layout/V3_LoginNavigator';
import V3_DashboardNavigator from '../screens/layout/third_layout/V3_DashboardNavigator';

import {MenuItemNavContext} from '../screens/layout/third_layout/NavWrapper';
import {ACTIVE_LAYOUT, Config} from '../app.config';
import {ThemesContext} from '../functions/ThemeContext';
import {NmDevTools} from '../components';
import {RootStackParamList} from './NavigationTypes';

const Stack = createStackNavigator<RootStackParamList>();
//const Stack = createNativeStackNavigator();

const LoginNavigator: React.FC = () => {
  const {theme} = useContext(ThemesContext);

  function getLoginComponent() {
    switch (ACTIVE_LAYOUT) {
      case 'third_layout':
        return V3_LoginNavigatorWrapper;
      default:
        return LoginOptionScreen;
    }
  }

  const LoginOptionComponent = getLoginComponent();

  return (
    <AccountDetailsProvider>
      <Stack.Navigator
      //screenOptions={{contentStyle: {backgroundColor: theme.screenBackground}}}
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="HomeDrawer"
          component={HomeDrawerNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="DemoSingleAPI"
          component={DemoSingleAPI}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="NmDevTools"
          component={NmDevTools}
          options={{
            headerShown: false,
          }}
        />

        {Config.APP_INCLUDE_DEMO_V1 && (
          <>
            <Stack.Screen
              name="DemoNavigator"
              component={DemoNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ShopNavigator"
              component={ShopNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="HospitalNavigator"
              component={HospitalNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="PaymentNavigator"
              component={PaymentNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="HandymanNavigator"
              component={HandymanNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="FoodNavigator"
              component={FoodNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="LeasingNavigator"
              component={LeasingNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="TransportNavigator"
              component={TransportNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ParkingNavigator"
              component={ParkingNavigator}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}

        <Stack.Screen
          name="V3_LoginNavigator"
          component={V3_LoginNavigatorWrapper}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="V3_DashboardNavigator"
          component={V3_DashboardNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="MenuItemNavContext"
          component={MenuItemNavContext}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ClockingHome"
          component={ClockingNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ScmsNavigator"
          component={ScmsNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="DemoScreen"
          component={DemoScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CalendarScreen"
          component={CalendarScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ItemScreen"
          component={ItemScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ScheduleScreen"
          component={ScheduleScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="NmImageViewer"
          component={NmImageViewer}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="MapViewer"
          component={MapViewer}
          options={{
            headerShown: false,
          }}
        />

        {/* <Stack.Screen
            name="LoginOption"
            component={LoginAnimatedScreen}
            options={{
              headerShown: false,
            }}
          /> */}

        <Stack.Screen
          name="LoginOptionScreen"
          component={LoginOptionComponent}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="LoginVariantOne"
          component={LoginVariantOne}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />

        {/* <Stack.Screen
            name="ClockingHome"
            component={ClockingHome}
            options={{
              gestureEnabled: false,
              headerShown: false,
            }}
          /> */}

        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
            //animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="UpdatesWebview"
          component={UpdatesWebview}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="DemoScreenCanvas"
          component={DemoScreenCanvas}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UnderConstruction"
          component={UnderConstruction}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="DynamicScreen"
          component={DynamicScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EndpointOption"
          component={EndpointOption}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EndpointInput"
          component={EndpointInput}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EndpointScanner"
          component={EndpointScanner}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationAnimatedScreen}
            options={{
              headerShown: false,
            }}
          /> */}

        <Stack.Screen
          name="RegistrationOption"
          initialParams={undefined}
          component={RegistrationOption}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="RegistrationSubmitted"
          component={RegistrationSubmitted}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OTPMobile"
          component={OTPMobile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OTPEmail"
          component={OTPEmail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResetPasswordForm"
          component={ResetPasswordForm}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="NewPassword"
          component={NewPassword}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="NewEmail"
          component={NewEmail}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="DynamicHome"
          component={DynamicHome}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="NoahOCR"
          component={IDVerificationFlow}
          options={{
            headerShown: false,
          }}
        />

        {/* <Stack.Screen
            name="ShopDemo"
            component={ShopHome}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="ItemScreen"
            component={ItemScreen}
            options={{
              headerShown: false,
            }}
          /> */}
      </Stack.Navigator>
    </AccountDetailsProvider>
  );
};

export default LoginNavigator;
