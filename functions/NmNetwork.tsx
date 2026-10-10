import ReactNativeBlobUtil from 'react-native-blob-util';
import {APP_KEYS, APP_CONST, KEYS_AES} from '../constants/NmConstants.js';
import {NmGetSetting, NmReplaceAll} from './NmFunctions.tsx';
import {Platform} from 'react-native';
import {NmBasicEncrypt} from './NmCipher.tsx';
import XDate from 'xdate';
import {getEndpointDetails} from './NmEndpoint.tsx';

const localMode = false;

const ApiConfig = {
  get url() {
    return getEndpointDetails().Endpoint;
  },
  get key() {
    return getEndpointDetails().Secretkey;
  },
};

interface ApiResponse extends Record<string, any> {
  status: string | number;
}

//======================================================================//
//============================  NOAH API's =============================//
//======================================================================//

export async function NmEndpointCheck(url: string): Promise<boolean> {
  const normalizedUrl = url.replace(/\/$/, '');

  try {
    const response = await ReactNativeBlobUtil.config({}).fetch('GET', `${normalizedUrl}/APIM/TestAPI`);

    if (!response) {
      return false;
    }

    try {
      const result = (await response.json()) as Record<string, unknown>;
      if (response.info().status == 200 && result?.message == 'Connected!') {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export async function NmLogin(credUser: string, credPass: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const url = new URL('api/get/NOAHAuth', ApiConfig.url).href;

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', url, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      username: `${credUser}`,
      password: `${credPass}`,
      secretkey: `${ApiConfig.key}`,
    })
    .catch((error: any) => {
      json.status = '404';
      json.message = 'Unknown error occured.';
      json.error = error.message;
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch {
    json.status = '404';
    json.message = 'Mobile Assets';
    json.detailmsg = 'Parse Failed';
  }

  return json;
}

export async function NmRecordLogin(loginDetails: any): Promise<ApiResponse> {
  const stringObj = JSON.stringify(loginDetails);
  const json: ApiResponse = {
    status: '200',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/NewDeviceLogin', {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
      loginInfo: stringObj,
    })
    .catch((error: any) => {
      return json;
    });

  if (!response) {
    return json;
  }

  return json;
}

export const NmCheckEndpoint = async (code: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/VerifyEndpoint?_code=' + code, {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
    })
    .catch((error: any) => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch {}

  return json;
};

export const NmGetMobileUpdates = async ({user, token, compcode, datatype}: {user: string; token?: string; compcode?: string; datatype: string}) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetMobileUpdates', {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
      _user: user,
      _accesstoken: token ?? '',
      _compcode: compcode ?? '',
      _datatype: datatype,
    })
    .catch((error: any) => {
      return json;
    });

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch {}

  return json;
};

export async function NmChangePassword(userProps: any): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
    message: 'Something went wrong. Please try again later',
  };

  const _userProps = JSON.stringify(userProps);

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + `APIM/ResetPassword?nwtku=${userProps.nwtku}&NewPass=${userProps.NewPass}&Confirm=${userProps.Confirm}`, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _userProps: _userProps, // For New API
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
    json.message = error.message;
  }

  return json;
}

//============================  OTP API's ==============================//

export async function NmResendRegOTPCode(user: string, mobile: string, property: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/ResendRegOTP?_account=' + user + '&_mobile=' + mobile + '&_property=' + property, {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch {
    json.status = '404';
  }

  return json;
}

export async function NmResendOTPCode(type: number, user?: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/GetNewOTP?_account=' + user + '&_type=' + type, {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch {
    json.status = '404';
  }

  return json;
}

export async function NmResendEmailOTP(type: number, user: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/GetNewOTP?_account=' + user + '&_type=' + type + '&_emailChange=OTP_CHANGE_EMAIL', {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch {
    json.status = '404';
  }

  return json;
}

export async function NmValidateOTP(user: string, OTPCode: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/ValidateOTP?_account=' + user + '&_OTPCode=' + OTPCode, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch {
    json.status = '404';
  }

  return json;
}

// export const NmValidateOTP = async (user, OTPCode) => {
//   let json = {};

//   const response = await ReactNativeBlobUtil.config({})
//     .fetch('POST', ApiConfig.url + 'APIM/ValidateOTP?_account=' + user + '&_OTPCode=' + OTPCode, {
//       //method: 'POST',
//       //headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       //},
//     })
//     .catch(err => {
//       json.status = '404';
//     });

//   try {
//     json = await response.json();
//   } catch (error) {
//     json.status = '404';
//   }

//   return json;
// };

//============================  APP API's ==============================//

export async function NmGetEndpointsList(): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetEndpoints', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = APP_CONST.RESPONSE_OK;
  } catch {
    json.status = APP_CONST.RESPONSE_ERR;
  }

  return json;
}

export async function NmGetMobileAssets(): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetMobileAssets', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = '200';
  } catch {
    json.status = '404';
    json.message = 'Mobile Assets';
    json.detailmsg = 'Parse Failed';
  }

  return json;
}

export async function NmGetUserDetails(usercode: string, loginToken: string, noahStandard?: any): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetUserDescription?_user=' + usercode, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: loginToken,
      _noahstandard: noahStandard,
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = '200';
  } catch (error: any) {
    json.status = '404';
    json.message = 'Unknown error occured.';
    json.error = error.message;
  }

  return json;
}

export async function NmValidateAccountNo(user?: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/ValidateAccNo?_account=' + user, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
    json.message = 'Unknown error occured.';
    json.error = error.message;
  }

  return json;
}

export async function NmValidatePropertyInfo(accno: string, property: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/ValidateProperty?_account=' + accno + '&_property=' + property, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
}

export async function NmTermsConditions(user: string, type: number): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/TACStatus', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _user: `${user}`,
      _ttype: `${type}`,
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = '200';
  } catch (error: any) {
    json.status = '404';
    json.message = 'Unknown error occured.';
    json.error = error.message;
  }

  return json;
}

// export const NmTermsConditions = async (user, type) => {
//   let result = {status: '404'};

//   try {
//     const response = await ReactNativeBlobUtil.config({}).fetch('GET', ApiConfig.url + 'APIM/TACStatus', {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       _user: `${user}`,
//       _ttype: `${type}`,
//     });

//     result = await response.json();
//   } catch (error) {
//     result.status = '404';
//     result.message = 'Unknown error occured.';
//     result.error = error.message;
//   }

//   return result;
// };

export const NmSendRegConfirmation = async (user: string, refNo: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/SendRegConfirmation', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _user: `${user}`,
      _refcode: `${refNo}`,
    })
    .catch(err => {
      return json;
    });

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

export const NmSendNewPassConfirmation = async (nwtku?: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/SendPWConfirmation', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _user: `${nwtku}`,
    })
    .catch(err => {
      return json;
    });

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
    json.message = 'Unknown error occured.';
  }

  return json;
};

export async function NmGetUserInfo(email: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/UserLoginCheck?_account=' + email, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '500';
    json.message = 'Unknown error occured.';
  }

  return json;
}

export async function NmCheckRegCount(email?: string, mobile?: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/UserRegCheck?_email=' + email + '&_mobile=' + mobile, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
}

export async function NmGetUserApprovals(user?: string): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetUserApprovals', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      user: `${user}`,
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
}

export const NmCheckUserToken = async (user: string, token: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/CheckLoginToken?_user=' + user + '&_token=' + token, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

export const NmGetServerDatestamp = async () => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetServerDateStamp', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(err => {
      json.status = '404';
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

export const NmGetTodayTimeRecords = async (
  logUser: string,
  logUserToken: string,
  dateFilterFrom = new XDate().toString('yyyy/MM/dd HH:mm:ss.fff'),
  dateFilterTo = new XDate().toString('yyyy/MM/dd HH:mm:ss.fff'),
) => {
  const json: ApiResponse = {
    status: '404',
  };

  console.log('NmGetTodayTimeRecords', logUser, logUserToken);

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetTodayTimeRecs', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _logUser: logUser,
      _logUserToken: logUserToken,
      _dateFilterFrom: dateFilterFrom,
      _dateFilterTo: dateFilterTo,
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

export const NmSendClockAction = async (logUser: string, logUserToken: string, actionType: string, actionData: any) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/SendClockAction', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _logUser: logUser,
      _logUserToken: logUserToken,
      _logAction: actionType,
      _logData: actionData,
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

export const NmStoreUserToken = async (user: string, token: string, deviceInfo: string, accessToken?: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/SaveUserToken', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _tokenprime: accessToken || '',
      _recuser: user,
      _token: token,
      _deviceinfo: deviceInfo,
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

export const NmGrantMultiAccess = async (user: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/GrantMultiAccessAsync', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _recuser: user,
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

export const NmStorePublicKey = async (user: string, pubkey: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const keyObj = {pkey: pubkey};
  const STR = JSON.stringify(keyObj);

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/SavePublicKey?pk=' + pubkey, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _userCode: user,
      _publicKey: STR,
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = '200';
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

export const NmGetPublicKey = async (user: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetPublicKey', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _userCode: user,
    })
    .catch(err => {
      return json;
    });

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = '200';
  } catch (error: any) {
    json.status = '404';
  }

  return json;
};

//============================  NOTIFICATION API's ==============================//

export async function NmGetNotifications(user: string = '', type: number, notifManager?: any): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  let UpperUser = user.toUpperCase();
  let requestUrl = ApiConfig.url + 'APIM/';

  switch (type) {
    case APP_CONST.NOTIF_GET_ALL:
      requestUrl += 'GetNotifications?_user=' + UpperUser + '&_customdate=0';
      break;
    case APP_CONST.NOTIF_GET_MORE:
      requestUrl += 'GetNotifications?_user=' + UpperUser + '&_customdate=1&_notifdate=' + notifManager.minDateNotification;
      break;
    case APP_CONST.NOTIF_GET_UNREAD:
      requestUrl += 'GetUnreadNotifications?_user=' + UpperUser + '&_customdate=0';
      break;
    case APP_CONST.NOTIF_GET_MORE_UNREAD:
      requestUrl += 'GetUnreadNotifications?_user=' + UpperUser + '&_customdate=1&_notifdate=' + notifManager.minDateUnreadNotification;
      break;
  }

  requestUrl = Platform.OS == 'ios' ? NmReplaceAll(requestUrl, ' ', '%20') : requestUrl;

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', requestUrl, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
    json.status = 200;
  } catch {
    json.status = '404';
  }

  return json;
}

// export const NmGetNotifications = async (user: string = '', type: number, notifManager?: any) => {
//   let UpperUser = user.toUpperCase();
//   let json = {};
//   let requestUrl = ApiConfig.url + 'APIM/';

//   switch (type) {
//     case APP_CONST.NOTIF_GET_ALL:
//       requestUrl += 'GetNotifications?_user=' + UpperUser + '&_customdate=0';
//       break;
//     case APP_CONST.NOTIF_GET_MORE:
//       requestUrl += 'GetNotifications?_user=' + UpperUser + '&_customdate=1&_notifdate=' + notifManager.minDateNotification;
//       break;
//     case APP_CONST.NOTIF_GET_UNREAD:
//       requestUrl += 'GetUnreadNotifications?_user=' + UpperUser + '&_customdate=0';
//       break;
//     case APP_CONST.NOTIF_GET_MORE_UNREAD:
//       requestUrl += 'GetUnreadNotifications?_user=' + UpperUser + '&_customdate=1&_notifdate=' + notifManager.minDateUnreadNotification;
//       break;
//   }

//   requestUrl = Platform.OS == 'ios' ? NmReplaceAll(requestUrl, ' ', '%20') : requestUrl;

//   const response = await ReactNativeBlobUtil.config({})
//     .fetch('GET', requestUrl, {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     })
//     .catch(err => {
//       json.status = 'Catch 404';
//     });

//   try {
//     json = await response.json();
//   } catch (error) {
//     json.status = 'Try 404';
//   }

//   return json;
// };

export const NmSendDemoNotif = async (notifData: any) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/MobileUserNotif', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _notifObject: notifData,
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch {
    json.status = '404';
  }

  return json;
};

export const NmSearchUser = async (recipient: string) => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/CheckUserID', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _RcvUser: recipient,
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
    json.status = '200';
  } catch {
    json.status = '404';
  }

  return json;
};

export const NmSendMessage = async (msgData: any, dvmd?: boolean) => {
  const json: ApiResponse = {
    status: '404',
  };
  let msgObject = JSON.stringify(msgData);

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/SendChatMessage', {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      _msgData: msgObject,
      ...(dvmd ? {_devkey: APP_CONST.TAG_DVMD} : {}),
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
  } catch {
    json.status = '404';
  }

  return json;
};

export const NmMarkNotificationRead = (referenceID: string, recuser?: string) => {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.config({})
      .fetch('POST', ApiConfig.url + 'APIM/MarkNotificationRead?_user=' + recuser + '&_referenceID=' + referenceID, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .then(response => response.json())
      .then(responseData => {
        resolve(true);
      });
  });
};

//============================  SQL API's ==============================//

export async function NmGetMobileAppData(): Promise<ApiResponse> {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetUserData', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = 200;
  } catch {
    json.status = '404';
  }

  return json;
}

// export async function NmGetMobileAppData(): Promise<unknown> {
//   let json = {};

//   const response = await ReactNativeBlobUtil.config({})
//     .fetch('GET', ApiConfig.url + 'APIM/GetUserData', {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     })
//     .catch(err => {
//       json.status = '404';
//     });

//   try {
//     json = await response.json();
//     json.status = 200;
//   } catch (error) {
//     json.status = '404';
//   }

//   return json;
// }

export const NmExecButtonSP = async (_notifID: string | any, _notifAction: string | any) => {
  const json: ApiResponse = {
    status: '404',
  };

  let primeAccessToken = await NmGetSetting(APP_KEYS.ACCESS_TOKEN);
  let recuser = await NmGetSetting(APP_KEYS.ACCESS_USER);

  const response = await ReactNativeBlobUtil.config({})
    .fetch('POST', ApiConfig.url + 'APIM/SendNotifAction', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _tokenPrime: primeAccessToken,
      _notifId: _notifID,
      _recuser: recuser,
      _notifAction: _notifAction,
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = '200';
  } catch {
    json.status = '404';
  }

  return json;
};

// export const NmExecButtonSP = async (_notifID: string | any, _notifAction: string | any) => {
//   let json = {};

//   const response = await ReactNativeBlobUtil.config({})
//     .fetch('POST', ApiConfig.url + 'APIM/SendNotifAction', {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       _tokenPrime: primeAccessToken,
//       _notifId: _notifID,
//       _recuser: recuser,
//       _notifAction: _notifAction,
//     })
//     .catch(err => {
//       json.status = '404';
//     });

//   try {
//     json = await response.json();
//     json.status = 200;
//   } catch (error) {
//     json.status = '404';
//   }

//   return json;
// };

export const NmGetNotificationColumns = async () => {
  const json: ApiResponse = {
    status: '404',
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetNotificationColumns', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
    .catch(err => {
      return json;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;
    Object.assign(json, result);
    json.status = '200';
  } catch {
    json.status = '404';
  }

  return json;
};

export const NmGetMobileData = async ({_actoken = '', _compcode = '', qid, qpr = {}}: {_actoken?: string; _compcode?: string; qid: string; qpr?: any}) => {
  const sqpr = JSON.stringify(qpr);
  const json: ApiResponse = {
    status: '404',
    data: null,
  };

  const response = await ReactNativeBlobUtil.config({})
    .fetch('GET', ApiConfig.url + 'APIM/GetMobileData', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      _actoken: _actoken,
      _compcode: _compcode,
      _devkey: APP_CONST.TAG_DVMD,
      _qid: qid,
      _qpr: sqpr,
    })
    .catch(() => {
      json.status = '404';
      return null;
    });

  if (!response) {
    return json;
  }

  try {
    const result = (await response.json()) as Record<string, unknown>;

    Object.assign(json, result);
    json.status = '200';
  } catch {
    json.status = '404';
  }

  return json;
};

// export const NmGetMobileData = async ({_actoken = '', _compcode = '', qid, qpr = {}}) => {
//   const sqpr = JSON.stringify(qpr);
//   let result = {status: '404', data: null};

//   try {
//     const response = await ReactNativeBlobUtil.config({}).fetch('GET', ApiConfig.url + 'APIM/GetMobileData', {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       _actoken: _actoken,
//       _compcode: _compcode,
//       _devkey: APP_CONST.TAG_DVMD,
//       _qid: qid,
//       _qpr: sqpr,
//     });

//     result = await response.json();
//   } catch (error) {
//     result.status = '404';
//     result.error = error.message;
//   }

//   return result;
// };

//======================================================================//
//============================  OPEN API's =============================//
//======================================================================//

export const NmGetPublicIP = () => {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.config({})
      .fetch('GET', 'https://api-bdc.net/data/client-ip', {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .then(response => response.json())
      .then(responseData => {
        resolve(responseData.ipString);
      })
      .catch(err => {
        resolve(false);
      });
  });
};

export const NmGetEstLocation = () => {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.config({})
      .fetch('GET', 'https://api.bigdatacloud.net/data/reverse-geocode-client', {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .then(response => response.json())
      .then(responseData => {
        resolve(responseData.city + ', ' + responseData.principalSubdivision + ', ' + responseData.countryCode);
      })
      .catch(err => {
        resolve(false);
      });
  });
};

// export const NmGPTTest = () => {
//   return new Promise((resolve, reject) => {
//     ReactNativeBlobUtil.config({})
//       .fetch(
//         'POST',
//         'https://api.openai.com/v1/chat/completions',
//         {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer sk-noahbot-VgpElWucAL4w19T5hJIMT3BlbkFJpAmNcW0dfpRDV6MuH1b4',

//         },
//         [{model: 'gpt-3.5-turbo-16k', prompt: 'Hello there'}],
//       )
//       .then(response => response.json())
//       .then(responseData => {
//         console.log(responseData);
//       })
//       .catch(err => {
//         resolve(false);
//       })
//       .done(responseData => {
//         resolve(true);
//       });
//   });
// })
// };

export const NmGetNewsAPI = () => {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.config({})
      .fetch('GET', 'https://newsapi.org/v2/everything?q=real%20estate&language=en&apiKey=7bd6e083c6a6426b8b872ab3246490cb', {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .then(response => response.json())
      .then(responseData => {
        resolve(responseData);
      })
      .catch(err => {
        resolve(false);
      });
  });
};

export const NmGetStandardNews = () => {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.config({})
      .fetch('GET', 'https://noahapplication.com/reads/data.json', {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .then(response => response.json())
      .then(responseData => {
        resolve(responseData);
      })
      .catch(err => {
        resolve(false);
      });
  });
};

// export const NmGetGeoAddress = (lat: string, lng: string) => {
//   return new Promise((resolve, reject) => {
//     ReactNativeBlobUtil.config({})
//       .fetch('GET', 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + KEYS_AES.GEO, {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       })
//       .then(response => response.json())
//       .then(responseData => {
//         resolve(responseData);
//       })
//       .catch(err => {
//         resolve(false);
//       });
//   });
// };
