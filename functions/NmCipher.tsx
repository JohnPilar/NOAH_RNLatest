import {KEYS_AES, APP_CONST} from '../constants/NmConstants';
import {RSAKeychain, RSA} from 'react-native-rsa-native';

// const CryptJS = require('crypto-js');
import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Base64.parse(KEYS_AES.PASS);
const iv = CryptoJS.enc.Base64.parse(KEYS_AES.SALT);

export const NmRSAEncrypt = async (messageToEncrypt: string, externalPublicKey: string): Promise<string> => {
  try {
    const encryptedMessage = await RSA.encrypt(messageToEncrypt, externalPublicKey);

    return encryptedMessage;
  } catch (error) {
    return 'Encryptiun Error';
  }
};

export const NmRSADecrypt = async (messageToDecrypt: string): Promise<string> => {
  try {
    const decryptic = await RSAKeychain.decrypt(messageToDecrypt, APP_CONST.TAG_KP);
    return decryptic;
  } catch (error) {
    return 'Decryption Error';
  }
};

export const NmBasicEncrypt = (value: string, key: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(value, key).toString();
  return ciphertext;
};

export const NmBasicDecrypt = (value: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(value, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  return originalText;
};

export const NmAesEncrypt = (text: string): string => {
  const preKey = CryptoJS.lib.WordArray.random(16);
  const posKey = CryptoJS.lib.WordArray.random(16);
  const encValue = shiftEncrypt(preKey + text + posKey);

  const ciphertext = CryptoJS.AES.encrypt(encValue, key, {iv: iv}).toString();
  return ciphertext;
};

export const NmAesDecrypt = (value: string): string => {
  const bytes = CryptoJS.AES.decrypt(value, key, {iv: iv});
  const originalText = shiftDecrypt(bytes.toString(CryptoJS.enc.Utf8));
  return originalText;
};

function shiftEncrypt(value: string): string {
  const valArray: string[] = value.split('');
  const valOut: string[] = [];
  let saltValue: string | undefined;

  for (let i = 0; i < valArray.length; i++) {
    if (isCharNumber(valArray[i]) && valArray[i] > '0' && valArray[i] <= '9') {
      saltValue = valArray[i];
      break;
    }
  }

  for (let i = 0; i < valArray.length; i++) {
    const conV = valArray[i].charCodeAt(0);
    const outSign = parseInt(conV.toString()) + parseInt(saltValue ?? '0');
    const enChar = String.fromCharCode(outSign);
    valOut.push(enChar);
  }

  const finVal = valOut.join('') + (saltValue ?? '');
  return finVal;
}

function shiftDecrypt(value: string): string {
  const valArray: string[] = value.split('');
  const valOut: string[] = [];
  const saltValue: string = value.substring(value.length - 1);

  for (let i = 0; i < valArray.length; i++) {
    const conV = valArray[i].charCodeAt(0);
    const outSign = parseInt(conV.toString()) - parseInt(saltValue);
    const enChar = String.fromCharCode(outSign);
    valOut.push(enChar);
  }

  const finVal = valOut.join('');
  return finVal;
}

function isCharNumber(c: string): boolean {
  return c >= '0' && c <= '9';
}

export const NmQRDecode = (encryptedText: any) => {
  try {
    const key = CryptoJS.enc.Utf8.parse('NOAHMobileAppEpRevelationsC22V13');
    const iv = CryptoJS.enc.Utf8.parse('EcclesiastesC318');

    const bytes = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const json = bytes.toString(CryptoJS.enc.Utf8);
    const config = JSON.parse(json);
    return config;
  } catch {
    return {};
  }
};
