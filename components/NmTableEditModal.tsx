import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Image} from 'react-native';
import Modal from 'react-native-modal';
import NmButton from './NmButton'; // Adjust path as needed
import NmTextInput from './NmTextInput';
import NmDateModal from './NmDateModal';
import {NmTitleCase, NmGetDate} from '../functions/NmFunctions'; // Adjust path as needed
import NmDropdown from './NmDropdown';
import {TableInputConfig as TableConfig, TableInputConfig} from '../constants/NmConstants';
import {ThemesContext} from '../functions/ThemeContext';
import DatePicker from 'react-native-date-picker';
var XDate = require('xdate');

const screenWidth = Dimensions.get('window').width;

interface NmTableEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  value: any;
  setValue: (value: any) => void;
  columnName?: string;
  inputConfig?: any;
}

const NmTableEditModal = (props: NmTableEditModalProps): React.JSX.Element => {
  const {isVisible, onClose, onSave, value, setValue, columnName, inputConfig} = props;
  const {theme} = useContext(ThemesContext);
  const [timeModal, setTimeModal] = useState<boolean>(false);
  const [timeValue, setTimeValue] = useState<Date>(new Date());

  useEffect(() => {
    if (!isVisible) return;

    const type = inputConfig?.type || 'text';

    switch (type) {
      case TableConfig.TIME: {
        let parsed = new Date(value);
        const isValid = parsed instanceof Date && !isNaN(parsed.getTime());

        if (isValid) {
          setTimeValue(parsed);
        } else {
          const now = new Date();
          setTimeValue(now);
        }
        break;
      }
      case TableConfig.DROPDOWN: {
        const selectedItem = inputConfig?.data?.find((p: any) => p.value === value);
        setValue(selectedItem ? selectedItem.value : inputConfig?.data[0]?.value);
      }
    }
  }, [isVisible]);

  const renderInput = (): React.JSX.Element | null => {
    const type = inputConfig?.type || 'text';

    switch (type) {
      case TableConfig.TEXT:
        return <NmTextInput onChangeText={setValue} value={String(value || '')} autoFocus maxLength={inputConfig?.length || 100} />;
      case TableConfig.COLWIDTH:
        return (
          <NmTextInput
            onChangeText={text => {
              const cleaned = text.replace(/\D/g, '');
              const integerValue = parseInt(cleaned, 10) || inputConfig.defaultWidth;
              setValue(integerValue);
            }}
            value={String(value || '')}
            autoFocus
            maxLength={4}
          />
        );
      case TableConfig.DROPDOWN:
        return (
          <NmDropdown
            items={inputConfig?.data}
            setValue={value => {
              setValue(value);
            }}
            value={value}
            containerStyle={{flex: 1, width: '100%'}}
            //onPress={'CUSTOM'}
          />
        );
      case TableConfig.DATE:
        return (
          <NmDateModal
            setDateValue={value => {
              setValue(value);
            }}
            dateValue={value}
            pickerMode={'DEVICE'}
          />
        );
      case TableConfig.TIME:
        return (
          <>
            <DatePicker
              modal
              mode={'time'}
              open={timeModal}
              date={timeValue}
              onConfirm={date => {
                setTimeValue(date);
                setValue(date);
                setTimeModal(false);
              }}
              onCancel={() => {
                setTimeModal(false);
              }}
            />

            <TouchableOpacity
              onPress={() => {
                setTimeModal(true);
              }}>
              <NmTextInput value={timeValue ? NmGetDate(timeValue, 'customFormat', 'hh:mm a') ?? '' : ''} />
            </TouchableOpacity>
          </>
        );
      case TableConfig.REMARKS:
        return null;
      default:
        return null;
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      backdropOpacity={0.3}
      style={{alignItems: 'center', margin: 0}}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={200}
      animationOutTiming={200}
      backdropTransitionOutTiming={0}>
      <View style={[styles.modalContainer, {width: screenWidth * 0.95}]}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>{`Edit ${inputConfig?.type == TableInputConfig.COLWIDTH ? NmTitleCase(columnName || 'Cell') + ' Width' : NmTitleCase(columnName || 'Cell')}`}</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={require('../assets/Icons/component_close_icon.png')} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        <View style={[styles.contentBody, {backgroundColor: theme.notifModalBackgroundColor}]}>
          <View style={[styles.inputWrapper, {height: 45}]}>{renderInput()}</View>

          <View style={styles.buttonRow}>
            <NmButton style={styles.modalbuttonStyle} titleStyle={styles.modalButtonTextStyle} onPress={onSave} buttonTitle title="Ok" />
            <NmButton style={styles.modalbuttonStyle} titleStyle={styles.modalButtonTextStyle} onPress={onClose} buttonTitle title="Cancel" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  header: {
    height: 40,
    backgroundColor: '#1974D1',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalTitle: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  closeIcon: {
    resizeMode: 'contain',
    height: 26,
    width: 26,
  },
  contentBody: {
    padding: 15,
  },
  inputWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTrigger: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalbuttonStyle: {
    height: 40,
    flex: 1,
    backgroundColor: '#1974D1',
    marginHorizontal: 5,
    borderRadius: 6,
  },
  modalButtonTextStyle: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});

export default NmTableEditModal;
