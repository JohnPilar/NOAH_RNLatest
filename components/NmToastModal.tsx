import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {ThemesContext} from '../functions/ThemeContext';
import {NmLabel} from './NmComponents';

interface NmToastModalProps {
  toastVisible: boolean;
  setToastVisible: (visible: boolean) => void;
  text?: string;
  containerStyle?: any;
  hideDelay?: number;
}

const NmToastModal = (props: NmToastModalProps): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);
  const {toastVisible, setToastVisible, text, containerStyle, hideDelay} = props || {};

  useEffect(() => {
    if (toastVisible) {
      let defaultHideDelay = 2500; //ms
      if (hideDelay && isValidNumber(hideDelay)) {
        defaultHideDelay = hideDelay;
      }

      setTimeout(() => {
        setToastVisible(false);
      }, defaultHideDelay);
    }
  }, [toastVisible]);

  const isValidNumber = (value: any): boolean => {
    return typeof value === 'number' && Number.isFinite(value);
  };

  return (
    <Modal
      isVisible={toastVisible}
      onBackdropPress={() => setToastVisible(false)}
      onBackButtonPress={() => setToastVisible(false)}
      //backdropOpacity={0.5}
      coverScreen={false}
      hasBackdrop={false}
      animationIn="fadeIn"
      animationOut="fadeOut"
      useNativeDriver={true}
      style={{pointerEvents: 'box-none'}}>
      <View style={[styles.toastContainer, {backgroundColor: theme.toastBackground, borderColor: theme.toastBorder}, containerStyle]}>
        <NmLabel style={{textAlign: 'justify'}}>{text}</NmLabel>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 40,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
  },
});

export default NmToastModal;
