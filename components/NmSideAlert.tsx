import {StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {NmLabel} from './NmComponents';
import {NmStyles} from '../constants';

import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useContext} from 'react';
import {ThemesContext} from '../functions/ThemeContext';

interface NmSideAlertProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  alertType?: string;
  title?: string;
  message?: string;
  modalStyle?: StyleProp<ViewStyle>;
  modalContainerStyle?: StyleProp<ViewStyle>;
}

export default function NmSideAlert(props: NmSideAlertProps): React.JSX.Element {
  const {visible, setVisible, alertType, title, message, modalStyle, modalContainerStyle} = props;
  const {theme} = useContext(ThemesContext);
  let iconColor: string;
  let iconBGColor: string;
  let iconName: string;
  let alertTitle = title == undefined ? "Add your title using 'title' prop" : title;
  let alertMessage = message == undefined ? "Add your message using 'message' prop" : message;

  switch (alertType) {
    case 'TYPE_SUCCESS':
      iconColor = '#38af62';
      iconName = 'check-circle-outline';
      break;
    case 'TYPE_INFO':
      iconColor = '#2474c2';
      iconName = 'information-outline';
      break;
    case 'TYPE_WARN':
      iconColor = '#f9be2a';
      iconName = 'alert-circle-outline';
      break;
    case 'TYPE_ERROR':
      iconColor = '#f9654d';
      iconName = 'close-circle-outline';
      break;
    default:
      iconColor = '#2474c2';
      iconName = 'information-outline';
      break;
  }
  iconBGColor = iconColor + '33';

  return (
    <Modal
      isVisible={visible}
      hasBackdrop={false}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      coverScreen={false}
      animationInTiming={400}
      animationOutTiming={400}
      swipeDirection={['down', 'left', 'right']}
      swipeThreshold={30}
      onSwipeComplete={direction => {
        setVisible(false);
      }}
      backdropTransitionOutTiming={0}
      style={[styles.modalStyle, modalStyle]}>
      <View style={[styles.modalContainerStyle, {backgroundColor: theme.saBackground, borderColor: theme.saBorder, borderWidth: StyleSheet.hairlineWidth}, modalContainerStyle]}>
        <View style={{borderRadius: 6, backgroundColor: iconColor, width: 6, height: '100%'}}></View>
        <View style={{padding: 2, borderRadius: 18, backgroundColor: iconBGColor, alignItems: 'center', justifyContent: 'center', height: 30, width: 30, marginHorizontal: 5}}>
          <MaterialCommunityIcons name={iconName} style={{}} size={24} color={iconColor} />
        </View>
        <View style={{flex: 1, justifyContent: 'center', marginLeft: 5}}>
          <NmLabel style={NmStyles.poppinsBold} numberOfLines={1}>
            {alertTitle}
          </NmLabel>
          <NmLabel numberOfLines={2}>{alertMessage}</NmLabel>
        </View>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
          }}
          style={{justifyContent: 'center', marginHorizontal: 5}}>
          <MaterialCommunityIcons name={'close'} style={{}} size={22} color={theme.saCloseButton} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainerStyle: {
    flexDirection: 'row',
    width: '84%',
    padding: 6,
    borderRadius: 6,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
});
