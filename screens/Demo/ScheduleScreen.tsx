import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';

import {Calendar} from 'react-native-calendars';
import {WINDOW_WIDTH} from '../../constants/NmStyles';

import {NmGetSchedString, NmGetDate, NmHardwareBackPress} from '../../functions/NmFunctions';
import {NmButton} from '../../components';
import NmColors from '../../constants/NmColors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ScheduleScreen = (props: any): React.JSX.Element => {
  const originScreen = props?.route?.params?.originScreen;
  const componentPaddingH = 16;
  const componentWidth = WINDOW_WIDTH - componentPaddingH * 2;
  const nowDate = NmGetDate(undefined, 'dashYMD');

  const [detailsComplete, setDetailsComplete] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>(nowDate);
  const [selectedDate, setSelectedDate] = useState<any[]>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const schedAvailable = {key: 'available', color: 'green', selectedDotColor: 'blue'};
  const schedHalday = {key: 'halfday', color: 'blue', selectedDotColor: 'blue'};
  const scehdLeave = {key: 'leave', color: 'red', selectedDotColor: 'blue'};

  const sampleMarkedDates = [nowDate, '2024-09-01', '2024-09-06', '2024-09-08', '2024-08-13', '2024-08-16'];

  const sampleDateTimeSched = [
    {
      date: nowDate,
      timeSched: [
        {startTime: '10:00 AM', endTime: '11:00 AM'},
        {startTime: '12:00 PM', endTime: '02:00 PM'},
        {startTime: '04:00 PM', endTime: '06:00 PM'},
      ],
    },
    {
      date: '2024-09-01',
      timeSched: [
        {startTime: '09:00 AM', endTime: '11:00 AM'},
        {startTime: '04:00 PM', endTime: '06:00 PM'},
      ],
    },
    {
      date: '2024-09-06',
      timeSched: [
        {startTime: '09:00 AM', endTime: '11:00 AM'},
        {startTime: '04:00 PM', endTime: '06:00 PM'},
      ],
    },
    {
      date: '2024-09-08',
      timeSched: [
        {startTime: '09:00 AM', endTime: '11:00 AM'},
        {startTime: '04:00 PM', endTime: '06:00 PM'},
      ],
    },
    {
      date: '2024-08-13',
      timeSched: [
        {startTime: '09:00 AM', endTime: '11:00 AM'},
        {startTime: '04:00 PM', endTime: '06:00 PM'},
      ],
    },
    {
      date: '2024-08-16',
      timeSched: [{startTime: '07:00 AM', endTime: '12:00 PM'}],
    },
  ];

  let marked: any = {};

  NmHardwareBackPress();

  sampleMarkedDates.forEach(day => {
    marked[day] = {
      marked: true,
    };
  });
  marked[selectedDay] = {
    selected: true,
    dotColor: 'green',
  };

  useEffect(() => {
    var tmpIndex = -1;

    try {
      tmpIndex = sampleDateTimeSched.findIndex(d => d.date == selectedDay);
    } catch (error) {}

    if (tmpIndex > -1) {
      setSelectedDate(sampleDateTimeSched[tmpIndex].timeSched);
    } else {
      setSelectedDate([]);
    }

    setSelectedTime(undefined);
  }, [selectedDay]);

  useEffect(() => {
    if (selectedDay != undefined && selectedTime != undefined) {
      setDetailsComplete(true);
    } else {
      setDetailsComplete(false);
    }
  }, [selectedDay, selectedTime]);

  const renderTimeItem = ({item, index}: any): React.JSX.Element => {
    const timeText = item.startTime + ' - ' + item.endTime;

    return (
      <TouchableOpacity
        key={index}
        style={{
          width: '100%',
          padding: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#AAA',
          borderRadius: 12,
          marginBottom: 10,
          backgroundColor: timeText == selectedTime ? '#236BEA' : '#FFF',
        }}
        activeOpacity={0.5}
        onPress={() => {
          setSelectedTime(timeText);
        }}>
        <Text style={{color: timeText == selectedTime ? '#FFF' : '#236BEA', fontFamily: 'Poppins-Medium', fontSize: 18, marginLeft: 5}}>{timeText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {paddingTop: useSafeAreaInsets().top}]}>
      <View style={{width: '100%', alignItems: 'center', paddingVertical: 5}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20}}>{'Select schedule'}</Text>
      </View>

      <View style={{flex: 1, width: '100%', alignItems: 'center', backgroundColor: '#f7f7f7ff'}}>
        <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center', paddingHorizontal: componentPaddingH}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Select Date'}</Text>
        </View>
        <Calendar
          minDate={nowDate}
          style={{width: componentWidth, borderWidth: StyleSheet.hairlineWidth, borderColor: '#AAA', borderRadius: 12, paddingBottom: 5}}
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

        <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center', paddingHorizontal: componentPaddingH}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Select Time'}</Text>
        </View>
        <View style={{width: '100%', paddingHorizontal: componentPaddingH, flex: 1}}>
          <FlatList
            data={selectedDate}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderTimeItem}
            ListEmptyComponent={
              <View style={{width: '100%', alignItems: 'center', padding: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: '#AAA', borderRadius: 12}}>
                <Text style={{color: '#AAA', fontFamily: 'Poppins-Medium', fontSize: 18, marginLeft: 0}}>{'No available schedule'}</Text>
              </View>
            }
          />
        </View>
      </View>
      <View style={{width: '100%', paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'flex-end'}}>
        <NmButton
          buttonTheme={'dark'}
          disabled={!detailsComplete}
          style={[{backgroundColor: detailsComplete ? NmColors.buttonDark : NmColors.buttonDisabled, borderRadius: 12}]}
          titleStyle={{}}
          title="Confirm schedule"
          onPress={() => {
            const confirmedSched = {date: NmGetSchedString(selectedDay), time: selectedTime};
            props.navigation.navigate({name: originScreen, params: {selectedSchedule: confirmedSched}, merge: false});
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default ScheduleScreen;
