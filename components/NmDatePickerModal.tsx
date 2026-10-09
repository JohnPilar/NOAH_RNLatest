import React, {memo, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import Modal from 'react-native-modal';
import {Calendar} from 'react-native-calendars';

import {WINDOW_WIDTH} from '../constants/NmStyles';
import {NmGetDate} from '../functions/NmFunctions';
import NmButton from './NmButton';

interface NmDatePickerModalProps {
  modalVisible: boolean;
  onBackPress: () => void;
  onBackdropPress: () => void;
  setSchedDate: (date: string) => void;
  modalStyle?: any;
}

const NmDatePickerModal = (props: NmDatePickerModalProps): React.JSX.Element => {
  const {modalVisible, onBackPress, onBackdropPress, setSchedDate} = props;
  const [selectedDay, setSelectedDay] = useState<string>(NmGetDate(undefined, 'dashYMD'));

  let marked: {[key: string]: any} = {};

  marked[selectedDay] = {
    selected: true,
    dotColor: 'green',
  };

  return (
    <Modal
      isVisible={modalVisible}
      onBackButtonPress={onBackPress}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.3}
      style={[styles.modalBackdrop, props.modalStyle]}
      //backdropColor={'white'}
      animationIn={'slideInRight'}
      animationOut={'slideOutLeft'}
      animationInTiming={400}
      animationOutTiming={400}
      backdropTransitionOutTiming={0}>
      <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#FFF', overflow: 'hidden'}}>
        <Calendar
          minDate={NmGetDate(undefined, 'dashYMD')}
          style={{width: WINDOW_WIDTH - 32, borderWidth: StyleSheet.hairlineWidth, borderColor: '#AAA', borderRadius: 12, paddingBottom: 5}}
          enableSwipeMonths={true}
          theme={{
            backgroundColor: 'green',
            arrowColor: '#133561',
            textDisabledColor: '#DDD',
            todayTextColor: 'orange',
            selectedDayBackgroundColor: '#133561',

            textMonthFontFamily: 'Poppins-Medium',
            textDayHeaderFontFamily: 'Poppins-Regular',
            textDayFontFamily: 'Poppins-Regular',
          }}
          onDayPress={day => {
            setSelectedDay(day.dateString);
          }}
          markedDates={marked}
        />
        <View style={{width: '100%', padding: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
          <NmButton title="Select" buttonTheme="dark" style={{flex: 1, marginRight: 2, borderRadius: 12}} activeOpacity={0.6} onPress={() => setSchedDate(selectedDay)} />
          <NmButton title="Cancel" buttonTheme="dark" style={{flex: 1, marginLeft: 2, borderRadius: 12}} activeOpacity={0.6} onPress={onBackPress} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    margin: 0,
  },
});

export default memo(NmDatePickerModal);
