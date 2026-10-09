import {createContext, useState, useCallback, useEffect} from 'react';
import {APP_KEYS, APP_CONST} from '../constants';
import {NmGetSetting, NmSaveSetting} from './NmFunctions';
import {Config} from '../app.config';

var XDate = require('xdate');

let linkBaseURL = '';
let appTypeConfig: number;
let deepLink = '';

export const initConfig = async () => {
  return new Promise((resolve, reject) => {
    (async () => {
      linkBaseURL = (await NmGetSetting(APP_KEYS.APP_SYSCONFIG_BASELINK)) || '';
      deepLink = await NmGetSetting(APP_KEYS.APP_SYSCONFIG_DEEPLINK);
      resolve(true);
    })();
  });
};

export const ConfigDetails = () => {
  const details = {
    BaseLinkURL: linkBaseURL,
    AppType: appTypeConfig,
    DeepLinkRoute: deepLink,
  };

  return details;
};

export const LogConfigDetails = () => {
  const details = `
    === LINKS CONFIG ===\n
    BaseLinkURL: ${linkBaseURL}\n
    AppType: ${appTypeConfig}\n
    DeepLinkRoute: ${deepLink}
  `;

  return details;
};

export const SetConfig = (code: any, value: any) => {
  switch (code) {
    case APP_CONST.APP_TYPE_CONFIG:
      appTypeConfig = value as number;
      break;
    case APP_CONST.APP_CONFIG_DEEPLINK:
      deepLink = value;
      break;
    case APP_KEYS.APP_SYSCONFIG_BASELINK:
      linkBaseURL = value;
      break;
  }
};

export const EndpointReset = () => {
  // Update to clear saved endpoints on Encrypted storage
  // setupFinished = null;
  // cachedEndpoint = null;
  // cachedEndpointCode = null;
  // cachedSecretkey = null;
};

// TEMPORARY VARIABLES: Variables here may be deleted or made standard on future updates
export const NOAHConfig = {
  InternalAppVersion: '10.0.0.23', // 06/08/2026 - Start of version matching
  ApprovalLink: 'MW/PostingAndUtilities/ApprovalMain/ApprovalMain.aspx?',
  CompanyLogo: 'DEFAULT_LOGO_KEY',
  PLAYSTORE_ID: 'com.promptus8.noah',
  APPSTORE_ID: 'com.promptus8.noah', // Update on iOS deploy
};
