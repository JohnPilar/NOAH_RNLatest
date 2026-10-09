import {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';

import {NmGetDate} from '../functions/NmFunctions';
import NmCalendar from '../screens/DateUtils/NmCalendar';
import {ThemesContext} from '../functions/ThemeContext';
import {UIConfig} from '../Global/UIConfig';
var XDate = require('xdate');

interface NmDateModalProps {
  setDateValue: (value: any) => void;
  dateValue?: any;
  pickerMode?: string;
  customFormat?: string;
  enabled?: boolean;
  style?: any;
  selectedValueStyle?: any;
  iconStyle?: any;
}

export default function NmDateModal(props: NmDateModalProps): React.JSX.Element {
  const {setDateValue, dateValue, pickerMode, customFormat, enabled} = props || {};
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [finalDate, setFinalDate] = useState<Date>(new Date(NmGetDate(undefined, 'dashYMD')));
  const {theme} = useContext(ThemesContext);

  useEffect((): void => {
    let propDate: Date;
    let parsed = new Date(NmGetDate(dateValue, 'dashYMD'));

    if (parsed instanceof Date && !isNaN(parsed.getTime())) {
      propDate = parsed;
    } else {
      propDate = new Date(NmGetDate(undefined, 'dashYMD'));
    }

    setFinalDate(propDate);
  }, [dateValue]);

  const resetCalendarModal = (): void => {
    setModalVisible(false);
  };

  return (
    <View>
      {pickerMode == 'DEVICE' ? (
        <DatePicker
          modal
          mode={'date'}
          open={modalVisible}
          date={finalDate}
          onConfirm={date => {
            setModalVisible(false);
            setDateValue(new XDate(date));
          }}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      ) : (
        <Modal
          propagateSwipe={true}
          isVisible={modalVisible}
          backdropOpacity={0.3}
          onBackdropPress={() => resetCalendarModal()}
          style={[{alignItems: 'center', justifyContent: 'center', margin: 0, width: '100%', paddingHorizontal: 6}]}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropTransitionOutTiming={0}
          onBackButtonPress={() => resetCalendarModal()}>
          <View style={{flex: 1, width: '100%', maxHeight: 400, alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 12}}>
            <NmCalendar
              LocaleEN={true}
              containerStyle={{borderRadius: 12, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: theme.calendarBorder}}
              onDatePress={(day: any) => {
                setDateValue(day);
                resetCalendarModal();
              }}
              currentDate={new Date(dateValue.getFullYear(), finalDate.getMonth(), finalDate.getDate())}
              markedDates={{[new XDate(finalDate).toString('MM/dd/yyyy')]: {selected: true}}}
            />
          </View>
        </Modal>
      )}

      <TouchableOpacity
        disabled={!enabled}
        onPress={() => {
          setModalVisible(true);
        }}
        style={[styles.dateContainer, props.style, {backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}]}>
        <Text style={[styles.dateSelectedValue, {color: theme.textColor}, props.selectedValueStyle]} numberOfLines={1}>
          {new XDate(finalDate).toString(customFormat == undefined ? 'MM/dd/yyyy' : customFormat)}
        </Text>
        <Image source={UIConfig.DropdownIcon} style={[{height: 20, width: 20, resizeMode: 'contain', tintColor: '#466DC6', marginRight: 10}, props.iconStyle]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 6,
    overflow: 'hidden',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelectedValue: {
    flex: 1,
    paddingLeft: 10,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginTop: 3,
  },
});
