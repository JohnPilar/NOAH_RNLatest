import {useState, useEffect, useContext} from 'react';
import {View, useWindowDimensions, TouchableOpacity, Text} from 'react-native';
import NmButton from './NmButton';
import NmTextInput from './NmTextInput';
import Modal from 'react-native-modal';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NmStyles} from '../constants';
import {ThemesContext} from '../functions/ThemeContext';

interface NmModalRemarksProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  textValue: string;
  setTextValue?: (value: string) => void;
}

export default function NmModalRemarks(props: NmModalRemarksProps): React.JSX.Element {
  const {height} = useWindowDimensions();
  const {theme} = useContext(ThemesContext);
  const {visible, setVisible, textValue, setTextValue} = props;

  const [text, setText] = useState<string>(textValue);

  function hideModal(): void {
    setVisible(false);
    setText('');
  }

  useEffect(() => {
    if (visible == true) {
      setText(textValue);
    }
  }, [visible]);

  return (
    <Modal
      propagateSwipe={true}
      isVisible={visible}
      backdropOpacity={0.4}
      onBackdropPress={() => {
        hideModal();
      }}
      style={[{alignItems: 'center', justifyContent: 'center', margin: 0, width: '100%', paddingHorizontal: 6}]}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      backdropTransitionOutTiming={0}
      onBackButtonPress={() => hideModal()}>
      <View style={{width: '100%', maxHeight: height * 0.9, alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 6, overflow: 'hidden'}}>
        <View
          style={{
            height: 46,
            backgroundColor: theme.rmkHeader,
            width: '100%',
            borderTopStartRadius: 6,
            borderTopEndRadius: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            overflow: 'hidden',
          }}>
          <TouchableOpacity
            style={{height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12}}
            onPress={() => {
              hideModal();
            }}>
            <MaterialCommunityIcons name={'keyboard-backspace'} size={24} color={'#FFF'} />
          </TouchableOpacity>
          <Text style={[NmStyles.poppinsMedium, {color: '#FFF', marginBottom: -2, paddingRight: 12}]}>{'Remarks'}</Text>
        </View>
        <View style={{width: '100%', padding: 6, backgroundColor: theme.rmkBackground}}>
          <NmTextInput
            value={text}
            onChangeText={val => {
              setText(val);
            }}
            multiline={true}
            containerStyle={{height: 500, marginBottom: 6, paddingVertical: 12}}
            textInputStyle={{height: 500, textAlignVertical: 'top'}}
          />
          <NmButton
            style={{borderRadius: 6}}
            title={'Save'}
            onPress={() => {
              setTextValue?.(text);
              setVisible(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
