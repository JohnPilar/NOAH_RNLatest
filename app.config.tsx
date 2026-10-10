import {APP_CONST} from './constants';

export const Config = {
  //NOAH/SCMS STANDARD
  APP_ENABLE_NOTIFICATION: true, // Asks for notification permission (creates notification token)
  APP_INCLUDE_DEMO_V1: true, // Controls whether demo is included in navigator (for package optimization)
  APP_COMP_LOCKED: true, // true is default for client based deployments, set to false when using QR Code for endpoint
  APP_NAME: 'NOAH', // Change according to client
  APP_SHOW_LOADMSG: false, // (Developer setting) show/hide loading message in splash screen
  APP_WEBTHEME: false, // For V10 only, change menu item theme based on app theme
  APP_MODE_DEV: false, // Activate shortcuts to functions under development
  APP_ENDPOINTMODE: APP_CONST.EDP_LONGP, // EDP_LONGP or EDP_MORSE - Method to show endpoint switch window (for live app dev testing)
  APP_EP_DEF: APP_CONST.ENDPOINT_SIT,
  APP_EPCODE_DEF: APP_CONST.ENDPOINT_CODE_SIT,
  APP_EPKEY_DEF: APP_CONST.ENDPOINTKEY_SIT_UAT,
  APP_LIVE: false, // For Live implementation (developer use)
  HOME_SHOW_ANNOUNCEMENT: true, // Hide/show announcement banner on standard layout home page screen
  HOME_SHOW_NEWS: true, // Hide/show news banner in home page screen
  HOME_CLOCKINGSYSTEM: true, // Hide/show clocking system inside standard home page screen
  APP_DISABLE_MOCKCHECK: true, //Disable checking of mock location

  // FPMC CONFIG
  // APP_ENABLE_NOTIFICATION: false,
  // APP_INCLUDE_DEMO_V1: false,
  // APP_COMP_LOCKED: true,
  // APP_NAME: 'WeConnect',
  // APP_SHOW_LOADMSG: true,
  // APP_WEBTHEME: true,
  // APP_MODE_DEV: false,
  // APP_ENDPOINTMODE: APP_CONST.EDP_LONGP,
  // APP_EP_DEF: APP_CONST.ENDPOINT_SIT,
  // APP_EPCODE_DEF: APP_CONST.ENDPOINT_CODE_SIT,
  // APP_EPKEY_DEF: APP_CONST.ENDPOINTKEY_SIT_UAT,
  // APP_LIVE: false,
  // HOME_SHOW_ANNOUNCEMENT: false,
  // HOME_SHOW_NEWS: false,
  // HOME_CLOCKINGSYSTEM: false,
  // APP_DISABLE_MOCKCHECK: true,

  // HRMS CONFIG
  // APP_ENABLE_NOTIFICATION: true,
  // APP_INCLUDE_DEMO_V1: false,
  // APP_COMP_LOCKED: true,
  // APP_NAME: 'NOAH',
  // HOME_SHOW_ANNOUNCEMENT: true,
  // HOME_SHOW_NEWS: true,
  // HOME_CLOCKINGSYSTEM: true,
};

export const CUSTOM_LAYOUT_ACTIVE = true;

// Values currently available
// Blank: default
// third_layout: Third layout
type APP_LAYOUTS = '' | 'third_layout';
export const ACTIVE_LAYOUT: APP_LAYOUTS = ''; //make blank to use default
