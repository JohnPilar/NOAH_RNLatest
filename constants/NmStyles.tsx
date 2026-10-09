import {useContext, useState} from 'react';
import {StyleSheet, Dimensions, useWindowDimensions, DimensionValue, FlexAlignType} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';

import NmColors from './NmColors';
import {ThemesContext} from '../functions/ThemeContext';

export const DEVICE_TYPE = DeviceInfo.getDeviceType().toUpperCase();

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export function DIM_OBJ() {
  const {width, height} = useWindowDimensions();
  return {width: width, height: height};
}

export const DIM_HEIGHT = () => {
  const {height} = useWindowDimensions();
  return height;
};

export const SCREEN_WIDTH = () => {
  const orientation = useDeviceOrientation();
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const DeviceType = DeviceInfo.getDeviceType().toUpperCase();

  return screenWidth;
};

export default {
  poppinsRegular: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  poppinsMedium: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  poppinsBold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  fontRoboto: {
    light: {
      fontFamily: 'Roboto-Light',
      color: '#000',
      fontSize: 18,
    },
    regular: {
      fontFamily: 'Roboto-Regular',
      color: '#000',
      fontSize: 18,
    },
    medium: {
      fontFamily: 'Roboto-Medium',
      color: '#000',
      fontSize: 18,
    },
    bold: {
      fontFamily: 'Roboto-Bold',
      color: '#000',
      fontSize: 18,
    },
  },
  fontOpenSans: {
    bold: {
      fontFamily: 'OpenSans-Bold',
      color: '#000',
      fontSize: 18,
    },
    italic: {
      fontFamily: 'OpenSans-Italic',
      color: '#000',
      fontSize: 18,
    },
    light: {
      fontFamily: 'OpenSans-Light',
      color: '#000',
      fontSize: 18,
    },
    medium: {
      fontFamily: 'OpenSans-Medium',
      color: '#000',
      fontSize: 18,
    },
    regular: {
      fontFamily: 'OpenSans-Regular',
      color: '#000',
      fontSize: 18,
    },
  },
  buttonLight: {
    borderRadius: 6,
    width: '100%',
    height: 45,
    backgroundColor: NmColors.buttonLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDark: {
    borderRadius: 6,
    width: '100%',
    height: 45,
    backgroundColor: NmColors.buttonDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    marginTop: 1, //for button alignment
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'white',
  },
  textInputContainer: {
    backgroundColor: '#FFF',
    width: '100%' as DimensionValue,
    height: 45,
    borderWidth: 1,
    borderColor: NmColors.textinputBorderColor,
    borderRadius: 6,
    flexDirection: 'row' as 'row',
    alignItems: 'center' as FlexAlignType,
    padding: 0,
  },
  textInput: {
    marginTop: 2,
    padding: 0,
    paddingVertical: 0,
    paddingLeft: 10,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'center' as 'center',
  },
  fileUploadContainerStyle: {
    width: '100%' as DimensionValue,
    height: 45,
    borderWidth: 1,
    borderColor: NmColors.textinputBorderColor,
    borderRadius: 6,
    flexDirection: 'row' as 'row',
    alignItems: 'center' as FlexAlignType,
    padding: 0,
    backgroundColor: NmColors.fileUploadBackgroundColor,
  },
  fileUploadStyle: {
    flex: 1,
    color: NmColors.fileUploadPlaceholder,
    marginLeft: 10,
  },
  fileUploadButtonStyle: {
    height: 26,
    paddingHorizontal: 5,
    alignItems: 'center' as FlexAlignType,
    justifyContent: 'center' as 'center',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: NmColors.fileUploadButtonBorderColor,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  fileUploadButtonTextStyle: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
  },
};
