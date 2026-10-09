import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

interface NmHelpTipProps {
  isVisible: boolean;
  onBackButtonPress?: () => void;
  backdropOpacity?: number;
  style?: any;
  customView?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  buttonIconVisible?: boolean;
  buttonTitle?: string;
}

export default function NmHelpTip(props: NmHelpTipProps): React.JSX.Element {
  const {isVisible, onBackButtonPress, backdropOpacity, style, customView, children, onPress, buttonIconVisible, buttonTitle} = props;

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onBackButtonPress}
      backdropOpacity={backdropOpacity}
      hasBackdrop={false}
      coverScreen={false}
      style={style}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={700}
      animationOutTiming={700}
      backdropTransitionOutTiming={0}>
      {customView ? (
        children
      ) : (
        <View style={styles.container}>
          {children}
          <TouchableOpacity onPress={onPress} style={{width: '100%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopWidth: 0.2, paddingTop: 10}}>
              {buttonIconVisible && <MaterialCommunityIcons name="close-circle-outline" size={24} color={'#4c5d72'} />}
              <Text style={{color: 'black', marginLeft: 5}}>{buttonTitle}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
  },
  title: {
    color: '#333',
  },
  message: {
    color: 'black',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.2,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
    elevation: 3,
  },
});
