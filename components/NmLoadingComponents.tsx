import React, {useState, useEffect, useContext} from 'react';
import {View, Image, StyleSheet, DimensionValue} from 'react-native';

import {useDeviceOrientation} from '../functions/NmFunctions';
import DeviceInfo from 'react-native-device-info';
import {ProgressBar, ActivityIndicator} from 'react-native-paper';

import {useStyles} from '../functions/Orientation';
import {NmLabel, NmStatusBar} from './NmComponents';
import {ThemesContext} from '../functions/ThemeContext';

interface LoadingScreenProps {
  loadingMessage?: React.ReactNode;
  containerStyle?: any;
  imageStyle?: any;
  progressBarStyle?: any;
}

export const LoadingScreen = (props: LoadingScreenProps): React.JSX.Element => {
  const NwClass = useStyles();
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);

  const {loadingMessage} = props;

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('70%');

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() === 'TABLET') {
      if (orientation === 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.loadingContainer, props.containerStyle, {backgroundColor: theme.splashBackground}]}>
      <NmStatusBar barColor="transparent" translucent={true} />
      <Image
        source={theme.logo.loadingComp}
        style={[
          {
            height: 140,
            width: '80%',
            resizeMode: 'contain',
            marginBottom: 0,
            marginTop: 0,
          },
          props.imageStyle,
        ]}
      />

      <View
        style={[
          NwClass.progressBar,
          styles.progressBarWrapper,
          {
            width: screenWidth,
            borderColor: theme.splashBorder,
            backgroundColor: theme.splashLoading,
          },
          props.progressBarStyle,
        ]}>
        <ProgressBar indeterminate={true} color={theme.splashBar} style={styles.progressBar} />
      </View>

      {loadingMessage && <NmLabel>{loadingMessage}</NmLabel>}
    </View>
  );
};

interface LoadingPanelProps {
  panelStyle?: any;
}

export const LoadingPanel = (props: LoadingPanelProps): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);

  return (
    <View style={[styles.loadingPanel, {backgroundColor: theme.loadingPanelBackground}, props.panelStyle]}>
      <ActivityIndicator animating={true} color="#466DC6" size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(256,256,256,0.95)',
    zIndex: 1,
    paddingBottom: 30,
  },
  loadingPanel: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  progressBarWrapper: {
    height: 6,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'transparent',
  },
});
