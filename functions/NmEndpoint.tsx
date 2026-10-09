import {APP_KEYS, APP_CONST} from '../constants';
import {NmGetSetting, NmSaveSetting} from './NmFunctions';
import {Config} from '../app.config';

interface Istate {
  endpoint: string | undefined;
  endpointCode: string | undefined;
  secretKey: string | undefined;
  setupDone: boolean | undefined;
  standardEndpoint: boolean | undefined;
}

const state: Istate = {
  endpoint: undefined,
  endpointCode: undefined,
  secretKey: undefined,
  setupDone: undefined,
  standardEndpoint: true, // To be removed
};

export const initEndpoint = async () => {
  if (state.setupDone) return true;

  try {
    state.setupDone = await NmGetSetting(APP_KEYS.APP_SETUP_FINISHED);
    state.endpoint = await NmGetSetting(APP_KEYS.ENDPOINT_URL);
    state.endpointCode = await NmGetSetting(APP_KEYS.ENDPOINT_CODE);
    state.secretKey = await NmGetSetting(APP_KEYS.ENDPOINT_KEY);

    state.standardEndpoint = await NmGetSetting(APP_KEYS.ENDPOINT_STANDARD); // To be removed

    if (Config.APP_COMP_LOCKED == true && !state.setupDone) {
      state.endpoint = Config.APP_LIVE ? APP_CONST.ENDPOINT_LIVE : Config.APP_EP_DEF;
      state.endpointCode = Config.APP_LIVE ? APP_CONST.ENDPOINT_CODE_LIVE : Config.APP_EPCODE_DEF;
      state.secretKey = Config.APP_LIVE ? APP_CONST.ENDPOINTKEY_LIVE : Config.APP_EPKEY_DEF;

      await Promise.all([
        NmSaveSetting(APP_KEYS.ENDPOINT_URL, state.endpoint),
        NmSaveSetting(APP_KEYS.ENDPOINT_CODE, state.endpointCode),
        NmSaveSetting(APP_KEYS.ENDPOINT_KEY, state.secretKey),
        NmSaveSetting(APP_KEYS.APP_SETUP_FINISHED, true),
      ]);

      state.setupDone = true; // For first launch
    }

    return true;
  } catch (err) {
    console.error('Endpoint Init Error:', err);
    return false;
  }
};

export const getEndpointDetails = () => {
  if (!state.setupDone) {
    // On iOS, sometimes functions fire before the JS bridge is fully ready.
    // This warning helps you debug race conditions.
    console.warn('getEndpointDetails called before initEndpoint finished!');
  }

  return {
    Endpoint: state.endpoint,
    EndpointCode: state.endpointCode,
    Secretkey: state.secretKey,
    SetupDone: state.setupDone,
    StandardEndpoint: state.standardEndpoint,
  };
};

export const LogEndpointDetails = () => {
  const details = `
    === ENDPOINT CONFIG ===\n
    Endpoint: ${state.endpoint}\n
    EndpointCode: ${state.endpointCode}\n
    Secretkey: ${state.secretKey}\n
    SetupDone: ${state.setupDone}\n
    Standard Endpoint: ${state.standardEndpoint}
  `;

  return details;
};

export const EndpointReset = () => {
  state.endpoint = undefined;
  state.endpointCode = undefined;
  state.secretKey = undefined;
  state.setupDone = undefined;
  state.standardEndpoint = true;
};

export const EndpointSet = (code: string, value: any) => {
  switch (code) {
    case APP_KEYS.ENDPOINT_URL:
      state.endpoint = value;
      break;
    case APP_KEYS.ENDPOINT_CODE:
      state.endpointCode = value;
      break;
    case APP_KEYS.ENDPOINT_KEY:
      state.secretKey = value;
      break;
    case APP_KEYS.APP_SETUP_FINISHED:
      state.setupDone = value;
      break;
    case APP_KEYS.ENDPOINT_STANDARD:
      state.standardEndpoint = value;
      break;
  }
};
