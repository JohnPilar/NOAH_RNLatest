export const APP_CONST = {
  APP_TYPE_CONFIG: 'APP_TYPE_CONFIG',
  APP_TYPE_PORTAL: 101,
  APP_TYPE_APPROVER: 102,
  APP_TYPE_DEV: 707,

  APP_LOGINTYPE_TIMEKEEP: 'TIME_KEEP',
  APP_CONFIG_DEEPLINK: 'APP_CONFIG_DEEPLINK',

  APP_CLRTYP_LOGIN: 'APP_CLRTYP_LOGIN',
  APP_CLRTYP_RESET: 'APP_CLRTYP_RESET',

  // ENDPOINT_SIT: 'https://noahark.noahapplication.com/SCMS_MobileAPI/',
  // ENDPOINT_SIT: 'http://192.168.1.235/MobileAPI/', // Local dev API
  // ENDPOINT_SIT: 'http://192.168.1.235/MobileAPICore/', // Local dev API Core
  // ENDPOINT_SIT: 'https://scms.promptus8.com/SCMS_MobileAPI/',
  ENDPOINT_SIT: 'https://hrmsdemov9.noahapplication.com/NOAHHRMS_DEMOV9_MobileAPI/',

  // ENDPOINT_UAT: 'https://fpmcnoahuat.federalland.ph/fpmc_mobileapi/',
  ENDPOINT_UAT: 'https://fli.promptus8.com/FPMC_API/',
  ENDPOINT_CODE_UAT: 'MOBDEF_ENDPOINT_UAT',

  //ENDPOINT_SIT: 'https://fli.promptus8.com/FPMC_API/',
  ENDPOINT_CODE_SIT: 'MOBDEF_ENDPOINT_SIT',

  ENDPOINT_LIVE: 'https://fli.promptus8.com/FPMC_API/', // CHANGE FOR GO LIVE
  ENDPOINT_CODE_LIVE: 'ENDPOINT_LIVE',

  ENDPOINT_CANCEL: 'ENDPOINT_CANCEL',
  ENDPOINT_CODE_CANCEL: 'ENDPOINT_CODE_CANCEL',

  // ENDPOINTKEY_SIT_UAT: 'AdGraherqERpuVbcoinAC', //GENERAL SECRET KEY
  ENDPOINTKEY_LIVE: 'AdGraherqERpuVbcoinAC', //GENERAL SECRET KEY
  ENDPOINTKEY_SIT_UAT: 'Askfusqlrcopr', //HRMS SECKEY

  ENDPOINT_CUS: 'SCAN NEW',
  ENDPOINT_CODE_CUS: 'ENDPOINT_CUST',

  NOTIF_GET_ALL: 101,
  NOTIF_GET_MORE: 102,
  NOTIF_GET_UNREAD: 201,
  NOTIF_GET_MORE_UNREAD: 202,

  NOTIF_TYPE_PERMANENT: 'NOTIF_TYPE_PERMANENT',
  NOTIF_TYPE_TEMPORARY: 'NOTIF_TYPE_TEMPORARY',
  NOTIF_TYPE_CHAT: 'NOAH_CHAT',
  NOTIF_TYPE_SCMS: 'NOAH_SCMS',

  NOTIF_ID_DEFAULT: 'NOAH_IDX',
  NOTIF_ID_CHATS: 'NOAH_MessagesID',
  NOTIF_ID_NONE: 'NOAH_ISL',

  OTP_TYPE_EMAIL: 2,
  OTP_TYPE_SMS: 3,

  OTP_RESULT_VALID: 'OTP_OK',
  OTP_RESULT_INVALID: 'OTP_INVALID',
  OTP_RESULT_EXPIRED: 'OTP_EXPIRED',

  TAC_LOGIN: 5,
  TAC_OTP: 6,
  TAC_UPDATE: 7,

  CIP_ERR_DEC: 4000,
  CIP_ERR_PAR: 4001,

  TAG_KP: 'com.promptus8.noah.goa',
  TAG_DVMD: 'P8DEV_MOB',

  DRWBUTTON_MENU: 'DRWBUTTON_MENU',
  DRWBUTTON_BACK: 'DRWBUTTON_BACK',
  DRWBUTTON_ASST: 'DRWBUTTON_ASST',

  NIT_NOTCLOCKED: 'NIT_NOTCLOCKED',
  NIT_CLOCKEDIN: 'NIT_CLOCKEDIN',
  NIT_CLOCKEDOUT: 'NIT_CLOCKEDOUT',
  NIT_TEMPSTORE: 'LocationDataArray',
  NIT_TRACKID: 'NIT_TRACKID',

  PROC_FAIL: 'PROC_FAIL',

  WEB_QS_NWTKU: '?nwtku=',
  WEB_QS_NSC: '&nsc=',
  WEB_QS_POPMOB: '&nkpop=y&nkmob=y',

  SPREAD_TYPE_LIST: 'SPREAD_TYPE_LIST',
  SPREAD_TYPE_GRID: 'SPREAD_TYPE_GRID',

  MUC_NEWS: 'TYPE_NEWS',
  MUC_ANNOUNCE: 'TYPE_ANNOUNCEMENT',

  EDP_LONGP: 'EDP_LONG',
  EDP_MORSE: 'EDP_MORS',
  EDP_PATTERN: ['dash', 'dot', 'dash', 'dash', 'dash', 'dot', 'dash', 'dot', 'dot', 'dot', 'dot'],
  EDP_TAPTHRESHOLD: 300,

  APP_VERCODE_OKAY: 4,
  APP_VERCODE_HIGH: 1,
  APP_VERCODE_LOW: 3,

  RESPONSE_OK: '200',
  RESPONSE_ERR: '404',
};

export const APP_ENDPOINT_CONFIGS = [
  {
    Code: APP_CONST.ENDPOINT_CODE_SIT,
    Description: 'App Default SIT',
    EndpointLink: APP_CONST.ENDPOINT_SIT,
    SecretKey: APP_CONST.ENDPOINTKEY_SIT_UAT,
    Environment: 'SIT',
  },
  {
    Code: APP_CONST.ENDPOINT_CODE_UAT,
    Description: 'App Default UAT',
    EndpointLink: APP_CONST.ENDPOINT_UAT,
    SecretKey: APP_CONST.ENDPOINTKEY_SIT_UAT,
    Environment: 'UAT',
  },
];

export const NmComponentType = {
  LOOKUP: 'lookup', // Dynamic data, fetched via Query ID, NO CONDITIONS YET
  ADDTOLIST: 'addtolist', // Dynamic data, fetched via Query ID, NO CONDITIONS YET
  DROPDOWN: 'dropdown', // NON-Dynamic data, must provide data on load
  BUTTON: 'button', // NO Dynamic Functions yet
  TEXT: 'text',
  DATE: 'date',
  TIME: 'time',
  RADIOBUTTON: 'radiobutton',
  CHECKBOX: 'checkbox',
  TABLE: 'table', // NON-Dynamic data, must provide data on load
};

export const NmLocalDataComponents = [NmComponentType.DROPDOWN, NmComponentType.RADIOBUTTON, NmComponentType.TABLE];

export const TableInputConfig = {
  TEXT: 'text',
  DROPDOWN: 'dropdown',
  DATE: 'date',
  TIME: 'time',
  REMARKS: 'remarks',
  LOOKUP: 'lookup',
  DOCVIEW: 'docview',
  COLWIDTH: 'COLWIDTH',
};

export const NmTextInputTypes = {
  STRING: 'string',
  INTEGER: 'integer',
};

export const TICKET_VIEW = {
  COLLAPSED: 11000,
  EXPANDED: 11001,
};

export const APP_KEYS = {
  ACCESS_USER: 'ACCESS_USER_KEY',
  ACCESS_PRIME: 'ACCESS_PRIME_KEY',
  ACCESS_NAME: 'ACCESS_KEY_NAME',
  ACCESS_TOKEN: 'ACCESS_TOKEN_KEY',
  ACCESS_TOKEN_EXPIRE: 'TOKEN_EXPIRE_KEY',
  ACCESS_LOGIN_TIME: 'LOGIN_TIME_KEY',

  ACCESS_ACCOUNT_LIST: 'USER_KEY_LIST',
  ACCESS_TOKEN_CURRENT: 'TOKEN_CURRENT_KEY',
  ACCESS_COMPTOKEN_CURRENT: 'TOKEN_CURRENT_COMPTOKEN',
  ACCESS_COMPNAME_CURRENT: 'TOKEN_CURRENT_COMPNAME',

  APP_SYSCONFIG_BASELINK: 'SYSCONFIG_BASELINK_KEY',
  APP_SETUP_FINISHED: 'SETUP_FINISHED_KEY',
  APP_SYSCONFIG_DEEPLINK: 'SYSCONFIG_DEEPLINK_KEY',
  APP_SYSCONFIG_LANDING: 'APP_SYSCONFIG_LANDING',
  APP_SYSCONFIG_V9LINK: 'APP_SYSCONFIG_V9LINK',
  APP_ASSET_VERSE: 'APP_ASSET_VERSE',

  APP_DRAWER_ITEMS: 'DRAWER_ITEMS_KEY',
  APP_DASHBOARD_ITEMS: 'DASHBOARD_ITEMS_KEY',
  APP_APPROVAL_ITEMS: 'APPROVAL_ITEMS_KEY',

  APP_BIOMETRIC_ASKED: 'SETT_BIOMETRIC_ASKED',
  APP_BIOMETRIC_USE: 'SETT_BIOMETRIC_USE',

  DB_TABLES: 'DB_TABLES_KEY',
  DB_INITIALIZED: 'DB_INITIALIZED_KEY',
  DB_NOTIF: 'NOTIF_INIT_KEY',

  ENDPOINT_INIT: 'ENDPOINT_INIT',
  ENDPOINT_LIST: 'ENDPOINT_LIST',
  ENDPOINT_CREDENTIALS: 'ENDPOINT_CREDENTIALS',
  ENDPOINT_CURRENT: 'ENDPOINT_CURRENT',
  ENDPOINT_STANDARD: 'ENDPOINT_STANDARD',

  ENDPOINT_URL: 'ENDPOINT_KEY',
  ENDPOINT_CODE: 'CODE_ENDPOINT_KEY',
  ENDPOINT_KEY: 'KEY_SECURE_KEY',

  DEVOPS_DEMO_MODE: 'DEVOPS_DEMO_MODE',
  DEVOPS_CLEAR_CACHE: 'DEVOPS_CLEAR_CACHE',
  DEVOPS_CLEAR_DATA: 'DEVOPS_CLEAR_DATA',
  DEVOPS_DASHBOARD_VIEW: 'DEVOPS_DASHBOARD_VIEW',
  DEVOPS_STANDARD_NOAH: 'DEVOPS_STANDARD_NOAH',
  DEVOPS_MOCK_SETT: 'DEVOPS_MOCK_SETT',

  NOTIF_LIST_ALL: 'NOTIF_LIST_ALL_KEY',
  NOTIF_LIST_UNREAD: 'NOTIF_LIST_UNREAD_KEY',
  NOTIF_MINDATE_ALL: 'NOTIF_MINDATE_ALL_KEY',
  NOTIF_MINDATE_UNREAD: 'NOTIF_MINDATE_UNREAD_KEY',
  NOTIF_CURRENT_DATA: 'NOTIF_CURRENT_DATA',

  NOTIF_CHANNEL_HIGH: 'NOAH_IDH',
  NOTIF_CHANNEL_DEFAULT: 'NOAH_IDD',
  NOTIF_CHANNEL_NONE: 'NOAH_IDN',

  NOTIF_ACTION_CLICK: 'NOTIF_ACTION_CLICK',

  MESSAGE_SVD_DATA: 'MESSAGE_SVD_DATA',
  MESSAGE_NOTIF_DATA: 'MESSAGE_NOTIF_DATA',
  MESSAGE_CHAT_DATA: 'MESSAGE_CHAT_DATA',

  SETT_PUSHNOTIF: 'PUSHNOTIF_KEY',
  SETT_APPTHEME: 'APP_THEME_KEY',
  SETT_HIDE_ANNOUNCEMENT: 'SETT_HIDE_ANNOUNCEMENT',

  CLOCK_ACTION_CLOCKIN: '1',
  CLOCK_ACTION_CLOCKOUT: '0',
  CLOCK_ACTION_STARTBREAK: '2',
  CLOCK_ACTION_STOPBREAK: '3',

  WEB_BOOKMARKS: 'WEB_BOOKMARKS_K',
  WEB_HISTORY: 'WEB_HISTORY_K',
};

export const THEME_STYLE = {
  STYLE_ORIG: 'STYLE_ORIG',
  STYLE_THIRD: 'STYLE_THIRD',
};

export const KEYS_AES = {
  PASS: 'N0@HM0b!l3@PpjCp',
  SALT: '2023042853491200',
  GEO: 'AIzaSyAfHFidxsU4U7AtzmrD0ufsaNR6aOoUlMw',
};

export const KEYS_WEBVIEW = {
  PARAMS_SSL_WORKAROUND: '&nwbpk=nmrnslbyp', //DO NOT MODIFY THIS! WORKAROUND FOR SSL ERRORS IN WEBVIEW
};

export const FileTypes = {
  FilePicker: {
    Audio: 'AUDIO',
    CSV: 'CSV',
    DocX: 'DOC/DOCX',
    Images: 'IMAGE',
    PDF: 'PDF',
    PlainText: 'PLAINTEXT',
    PptX: 'PPT/PPTX',
    Video: 'VIDEO',
    XlsX: 'XLS/XLSX',
    Zip: 'ZIP',
  },
};

export const DevOptionKeys = [
  {
    value: 'DemoMode',
    description: 'Demo Mode',
    longDescription: 'Show Lifestyle shortcut',
  },
  {
    value: 'ShowClearCache',
    description: 'Show Clear Cache',
    longDescription: 'Show Clear cache in settings',
  },
  {
    value: 'ShowClearData',
    description: 'Show Clear Data',
    longDescription: 'Show Clear data in settings',
  },
  {
    value: 'ListView',
    description: 'List View',
    longDescription: 'Show dashboard in list view',
  },
  {
    value: 'NOAHStandard',
    description: 'NOAH Standard',
    longDescription: 'Default: true, enable if the app has custom API calls',
  },
  {
    value: 'DisableMockCheck',
    description: 'Disable Mock Check',
    longDescription: 'Disables mock check when testing Geo Location feature',
  },
];
