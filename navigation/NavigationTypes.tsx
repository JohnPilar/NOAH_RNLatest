import type {StackScreenProps as SSP, StackNavigationProp as SNP} from '@react-navigation/stack';
import {IRegProofData} from '../constructs/interfaces/AccountFunctionsInterface';

export type RootStackParamList = {
  SplashScreen:
    | {
        fromNotifClick?: boolean;
      }
    | undefined;

  LoginOptionScreen:
    | {
        linkFail?: boolean;
        message?: string;
      }
    | undefined;

  LoginScreen: {} | undefined;

  Home: {} | undefined;

  EndpointScanner: undefined | {};

  EndpointOption: undefined;

  ResetPasswordForm:
    | {
        changeType?: any;
      }
    | undefined;

  OTPEmail: {
    ChangeEmail?: boolean;
    newAccount?: boolean;
    OTPCode?: any;
    pwtku?: string;
    user: string;
    changeType?: any;
  };

  OTPMobile: {
    newAccount: boolean;
    OTPCode?: any;
    pwtku?: string;
    user?: string;
    changeType?: any;
    mobToken?: string;
    userDetails?: any;
    proofData?: IRegProofData;
    selfieData?: IRegProofData;
    userExists?: boolean;
    userLoggedIn?: boolean;
  };

  NewPassword: {
    newAccount: boolean;
    pwtku?: string;
  };

  NewEmail: {user: string};

  RegistrationScreen: {userExists?: boolean; userDetails?: any; userLoggedIn?: boolean} | undefined;
  RegistrationOption: {} | undefined;
  RegistrationSubmitted: {userLoggedIn?: boolean; regReferenceNo?: string} | undefined;
  EndpointInput: undefined;
  HomeDrawer: undefined;
  DemoSingleAPI: undefined;

  NmDevTools:
    | {
        userIntent?: boolean;
      }
    | undefined;

  DemoNavigator: undefined;
  ShopNavigator: undefined;
  HospitalNavigator: undefined;
  PaymentNavigator: undefined;
  HandymanNavigator: undefined;
  FoodNavigator: undefined;
  LeasingNavigator: undefined;
  TransportNavigator: undefined;
  ParkingNavigator: undefined;

  V3_LoginNavigator: undefined;
  V3_DashboardNavigator: undefined;
  MenuItemNavContext: undefined;
  ClockingHome: undefined;
  ScmsNavigator: undefined;
  DemoScreen: undefined;
  CalendarScreen: undefined;
  ItemScreen:
    | undefined
    | {
        ItemObject: any;
      };
  ScheduleScreen: undefined;
  NmImageViewer:
    | {
        items?: any;
        imgItems?: any[];
        imgIndex?: number;
      }
    | undefined;
  MapViewer:
    | undefined
    | {
        currentCoords?: any;
        origin: any;
      };
  LoginOption: undefined;
  LoginVariantOne: undefined;
  UpdatesWebview: {link?: string} | undefined;
  DemoScreenCanvas: undefined;
  UnderConstruction: undefined;
  DynamicScreen: undefined;
  DynamicHome: undefined;
  NoahOCR: undefined;

  // ===================================== AppNavigator ===================================== //
  MessageList: undefined | {};
  MessageThread:
    | undefined
    | {
        chatDetails?: any;
      };
  WebViewerHome: {
    link: string;
    webLink?: string;
    newPage: boolean;
    accountNo?: string;
    menuCode?: string;
    fromNotifWindow?: boolean;
    otherLink?: boolean;
    devMode?: boolean;
    notifWindow?: boolean;
  };
  ContactSearch: undefined | {};
  AssistantScreen: undefined | {};
  WebWatsonx: undefined | {};
  BasicInformation: undefined | {};
  TransactionHistory: undefined | {};
  PaymentHistory: undefined | {};
  BillingHistory: undefined | {};
  NoticeHistory: undefined | {};
  RequestEntry: undefined | {};
  OtherRequests: undefined | {};
  SettingsScreen: {thirdLayout?: boolean} | undefined;
  NotificationDemo: undefined | {};
  NotificationScreen: {thirdLayout?: boolean};
  UnderConstructionAN: undefined | {};
};

export type StackScreenProps<T extends keyof RootStackParamList> = SSP<RootStackParamList, T>;

export type StackNavigationProp = SNP<RootStackParamList>;
