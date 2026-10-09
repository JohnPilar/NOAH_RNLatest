import DeviceInfo from 'react-native-device-info';
import JailMonkey from 'jail-monkey';
import {generateHardwareKey, getAttestation, generateHardwareSignatureWithAssertion, isPlayServicesAvailable, prepareIntegrityToken, requestIntegrityToken} from '@pagopa/io-react-native-integrity';

export const NmSecCheck = () => {
  let securityCheck = {
    all: {
      jailbroken: false,
      trustFall: false,
    },
    android: {
      suspiciousApps: false,
      adbStatus: false,
      rootDetectors: undefined,
      devMode: false,
      debugMode: false,
    },
  };

  //IOS and ANDROID function
  if (JailMonkey.isJailBroken()) {
    securityCheck.all.jailbroken = true; //console.log('root/jailbreak enabled');
  } else {
    console.log('No Threats');
  }

  if (JailMonkey.trustFall()) {
    securityCheck.all.trustFall = true; //console.log('Violates either isJailBroken or canMockLocation');
  } else {
    console.log('No security violations');
  }

  //Android ONLY function
  if (JailMonkey.hookDetected()) {
    securityCheck.android.suspiciousApps = true; //console.log('suspicious app(s) installed');
  } else {
    console.log('NO suspicious app(s) detected');
  }

  //console.log('ADB Status:', JailMonkey.AdbEnabled());
  securityCheck.android.adbStatus = JailMonkey.AdbEnabled();

  //console.log('androidRootedDetectionMethods', JailMonkey.androidRootedDetectionMethods);
  securityCheck.android.rootDetectors = JailMonkey.androidRootedDetectionMethods();

  JailMonkey.isDevelopmentSettingsMode().then(r => {
    securityCheck.android.devMode = r; //console.log('isDevelopmentSettingsMode', r.toString());
  });

  JailMonkey.isDebuggedMode().then(r => {
    securityCheck.android.debugMode = r; //console.log('isDebuggedMode', r.toString());
  });

  return securityCheck;
};

export const NmPlayCheck = async () => {
  try {
    const isServiceAvailable = await isPlayServicesAvailable();
    if (isServiceAvailable) {
      console.log('PlayServices Found');
    } else {
      console.log('PlayServices NOT Found');
    }
  } catch (e) {
    console.log(JSON.stringify(e));
  }

  try {
    prepIntegrityToken().then(() => {
      reqIntegrityToken().then(async token => {
        //
      });
    });
  } catch (e) {
    console.log(JSON.stringify(e));
  }
};

// UserRequest = request parameters and values THAT NEEDS to be encrypted
// 1. Hash the UserRequest then include it in the INTEGRITY TOKEN request
// 2. Send the UserRequest along with the INTEGRITY TOKEN
// 3. Hash the UserRequest in the server then compare it with the hash inside the INTEGRITY TOKEN
// 4. REJECT the request when hash is not equal

const requestHash = 'CODE_SENSITIVE_INFO_LOL'; //Hash then send
async function reqIntegrityToken() {
  try {
    const token = await requestIntegrityToken(requestHash);
    console.log('IntegrityToken', token);
    return token;
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}

async function prepIntegrityToken() {
  const GOOGLE_CLOUD_PROJECT_NUMBER = '376822429150';
  await prepareIntegrityToken(GOOGLE_CLOUD_PROJECT_NUMBER);
}

export const NmExec = (func, params) => {
  const {funcParams} = params;

  const type = func.toUpperCase();

  switch (type) {
    case 'LOG': {
      console.log(funcParams);
    }
  }
};

export async function setupAppAttest() {
  try {
    const keyId = await generateHardwareKey();
    // const challenge = await fetchChallengeFromServer(); // Get from API
    const attestation = await getAttestation(challenge, keyId);

    //  await sendAttestationToBackend(keyId, attestation); // Get from API
  } catch (error) {
    console.error('Attestation failed:', error);
  }
}

/* Example function when sending secure requests */
async function secureApiCall(data) {
  // 4. For every sensitive request, sign the data (Assertion)
  const clientData = JSON.stringify(data);
  const keyId = await getSavedKeyId(); // Retrieve from storage

  const signature = await generateHardwareSignatureWithAssertion(clientData, keyId);

  // Send the signature in your headers
  return fetch('https://api.yoursite.com/data', {
    method: 'POST',
    headers: {'X-App-Assertion': signature},
    body: clientData,
  });
}

export const getIntegrityToken = async (data, keyId) => {
  if (await DeviceInfo.isEmulator()) {
    return 'MOCK_ASSERTION_TOKEN_FOR_TESTING';
  }
  return await generateHardwareSignatureWithAssertion(data, keyId);
};
