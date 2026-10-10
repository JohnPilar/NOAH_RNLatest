import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, useWindowDimensions, ScrollView} from 'react-native';

import Animated, {interpolate, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';

import {NmGetDayOfWeek, NmGetMonthName, NmCheckSchedule, NmNullOrEmpty, NmGetTimeDifference, NmGetDate} from '../functions/NmFunctions';
import {NmModal, NmTextInput} from '../components';
import NmCalendar from './DateUtils/NmCalendar';
import NmStyles from '../constants/NmStyles';
import {NmColors} from '../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {sampleAgendas as sampleAgendasList} from '../Global/GlobalVariable';

export default function CalendarScreen(): React.JSX.Element {
  const {height, width} = useWindowDimensions();

  const [lowerContainerHeight, setLowerContainerHeight] = useState<number>(0);

  const nowDate = NmGetDate(undefined, 'dashYMD');
  const scrollY = useSharedValue(0);

  const [detailMinHeight, setDetailMinHeight] = useState<number | undefined>(undefined);
  const [calHeight, setCalHeight] = useState<number>(10);
  const [headerHeight, setHeaderHeight] = useState<number>(width * 0.15);

  const [selectedDay, setSelectedDay] = useState<string>(nowDate);
  const [dateText, setDateText] = useState<string | undefined>('');
  const [agendaList, setAgendaList] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newTopic, setNewTopic] = useState<string>('');

  const [selector, setSelector] = useState<any>();
  const [timeModal, setTimeModal] = useState<any>();
  const [fromTime, setFromTime] = useState<any>();
  const [toTime, setToTime] = useState<any>();
  const [schedError, setSchedError] = useState<string>('');

  const animDateOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, calHeight], [0, 1]),
    };
  });

  const [sampleAgendas, setSampleAgendas] = useState<any[]>(sampleAgendasList);

  const marked: any = {};

  sampleAgendas.forEach((day: any) => {
    marked[day.date] = {
      marked: true,
    };
  });

  marked[selectedDay] = {
    selected: true,
    dotColor: 'green',
    marked: sampleAgendas.findIndex((i: any) => i.date == selectedDay) > -1 ? true : false,
  };

  useEffect(() => {
    var tmpIndex = -1;

    try {
      tmpIndex = sampleAgendas.findIndex((d: any) => d.date == selectedDay);
    } catch (error) {}

    if (tmpIndex > -1) {
      setAgendaList(sampleAgendas[tmpIndex].agendaList);
    } else {
      setAgendaList([]);
    }

    const tmpDateText = NmGetDayOfWeek(new Date(selectedDay).getDay(), true)
      .concat(', ', NmGetMonthName(new Date(selectedDay).getMonth()), ' ')
      .concat(new Date(selectedDay).getDate().toString(), ' ')
      .concat(new Date(selectedDay).getFullYear().toString());

    setDateText(tmpDateText);
  }, [selectedDay, sampleAgendas]);

  useEffect(() => {
    try {
      setDetailMinHeight(lowerContainerHeight - headerHeight - 16);
    } catch (error) {}
  }, [lowerContainerHeight, headerHeight]);

  const scrollHandler = useAnimatedScrollHandler((event: any) => {
    scrollY.value = event.contentOffset.y;
  });

  const resetFields = (): void => {
    setModalVisible(false);
    setFromTime(undefined);
    setToTime(undefined);
    setNewTopic('');
  };

  const saveNewAgenda = (): void => {
    if (NmNullOrEmpty([newTopic, fromTime, toTime])) {
      showError('Please complete all fields');
    } else {
      const check = NmCheckSchedule(fromTime, toTime);

      switch (check) {
        case 1: {
          const tmpAgendas = [...sampleAgendas];

          const timeDiff = NmGetTimeDifference(fromTime, toTime);

          const tmpMin = timeDiff.min;
          const tmpHr = timeDiff.hr;

          const mins = tmpMin > 1 ? tmpMin.toString().concat(' mins') : tmpMin == 1 ? tmpMin.toString().concat(' min') : '';
          const hrs = tmpHr > 1 ? tmpHr.toString().concat(' hrs') : tmpHr.toString().concat(' hr');
          const dur = tmpHr == 0 ? mins : tmpMin > 0 ? hrs.toString().concat(' ', mins) : hrs;

          if (tmpAgendas.findIndex((i: any) => i.date == NmGetDate(new Date(selectedDay), 'dashYMD')) == -1) {
            tmpAgendas.push({
              date: NmGetDate(new Date(selectedDay), 'dashYMD'),
              agendaList: [
                {
                  time: NmGetDate(fromTime, 'customFormat', 'hh:mm a'),
                  duration: dur,
                  agenda: newTopic,
                },
              ],
            });
            setSampleAgendas(tmpAgendas);
          } else {
            const agendaIndex = tmpAgendas.findIndex((i: any) => i.date == NmGetDate(new Date(selectedDay), 'dashYMD'));
            const tmpAgenda = tmpAgendas[agendaIndex];
            tmpAgenda.agendaList.push({
              time: NmGetDate(fromTime, 'customFormat', 'hh:mm a'),
              duration: dur,
              agenda: newTopic,
            });

            setSampleAgendas(tmpAgendas);
          }
          resetFields();
          setModalVisible(false);
          break;
        }
        default: {
          showError('Start time cannot be greater than or equal to End time');
          break;
        }
      }
    }
  };

  function showError(error: string): void {
    setSchedError(error);
    setTimeout(() => {
      setSchedError('');
    }, 3000);
  }

  const renderAgenda = (item: any, index: number): React.JSX.Element => {
    return (
      <View key={index} style={{width: '100%', paddingVertical: 5}}>
        <TouchableOpacity activeOpacity={0.5} style={{backgroundColor: '#EEEEEE55', borderWidth: StyleSheet.hairlineWidth, borderColor: '#AAA', padding: 10, borderRadius: 12}}>
          <Text style={[NmStyles.poppinsRegular]}>{'Topic'}</Text>
          <Text style={[NmStyles.poppinsBold, {}]}>{item.agenda}</Text>
          <Text style={[NmStyles.poppinsRegular]}>{'Time'}</Text>
          <Text style={[NmStyles.poppinsBold]}>{item.time}</Text>
          <Text style={[NmStyles.poppinsRegular]}>{'Duration'}</Text>
          <Text style={[NmStyles.poppinsBold]}>{item.duration}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <NmModal
        //openTime={timeModal}
        //setOpenTime={setTimeModal}
        winVisible={modalVisible}
        setWinVisible={setModalVisible}
        title={'Add New Agenda'}
        modalType={'WIN_QUESTION'}
        YesTitle={'Save'}
        NoTitle={'Cancel'}
        actionButtonStyle={{backgroundColor: NmColors.buttonDark}}
        headerContainerStyle={{backgroundColor: NmColors.buttonDark}}
        customContent={true}
        onBackButtonPress={resetFields}
        onBackdropPress={resetFields}
        onClickClose={resetFields}
        onClickNo={resetFields}
        onClickYes={saveNewAgenda}>
        <DatePicker
          modal
          mode={'time'}
          open={timeModal}
          date={new Date()}
          onConfirm={(date: Date) => {
            if (selector == '000') {
              setFromTime(date);
            } else {
              setToTime(date);
            }
            setTimeModal(false);
          }}
          onCancel={() => {
            setTimeModal(false);
          }}
        />
        <View style={{width: '100%', backgroundColor: undefined, height: undefined, maxHeight: height / 2}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <Text style={[NmStyles.poppinsBold, {}]}>{'Date'}</Text>
            <NmTextInput value={dateText ?? ''} editable={false} containerStyle={{backgroundColor: '#EEE'}} />
            <Text style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'Topic'}</Text>
            <NmTextInput value={newTopic} onChangeText={setNewTopic} multiline={true} containerStyle={{height: undefined, minHeight: 45}} />
            <Text style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'Start Time'}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelector('000');
                setTimeModal(true);
              }}>
              <NmTextInput value={fromTime ? NmGetDate(fromTime, 'customFormat', 'hh:mm a') : ''} editable={false} containerStyle={{}} />
            </TouchableOpacity>
            <Text style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'End Time'}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelector('101');
                setTimeModal(true);
              }}>
              <NmTextInput value={toTime ? NmGetDate(toTime, 'customFormat', 'hh:mm a') : ''} editable={false} containerStyle={{marginBottom: 15}} />
              {schedError != '' && <Text style={[NmStyles.poppinsRegular, {marginTop: 0, marginBottom: 10, color: 'red', width: '100%', textAlign: 'center'}]}>{schedError}</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </NmModal>
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#133561', paddingTop: useSafeAreaInsets().top}}>
        <Text style={{color: '#FFF', fontFamily: 'Poppins-Bold', fontSize: 20, marginTop: 5, paddingVertical: 10}}>{'Calendar'}</Text>
      </View>
      <View
        style={{flex: 1}}
        onLayout={event => {
          const {height} = event.nativeEvent.layout;
          setLowerContainerHeight(height);
        }}>
        <Animated.ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 16,
          }}
          stickyHeaderIndices={[1]}
          onScroll={scrollHandler}>
          <View
            style={{height: lowerContainerHeight / 2, width: '100%', padding: 10}}
            onLayout={event => {
              const {height} = event.nativeEvent.layout;
              setCalHeight(height);
            }}>
            <NmCalendar
              containerStyle={{borderRadius: 12, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: '#AAA'}}
              onDatePress={(day: any) => {
                setSelectedDay(day);
              }}
              markedDates={marked}
            />
          </View>

          <View style={{width: '100%', paddingHorizontal: 16, backgroundColor: '#FFF'}}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
              onLayout={event => {
                const {height} = event.nativeEvent.layout;
                setHeaderHeight(height);
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.componentHeader}>{'Agenda'}</Text>
                <Animated.Text style={[styles.componentHeader, animDateOpacity]}>{': '.concat(dateText ?? '')}</Animated.Text>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(true)} style={{height: '90%', paddingLeft: 10, justifyContent: 'center'}}>
                {/* <Text style={[NmStyles.poppinsBold, {color: '#133561AA', textAlign: 'center', marginTop: 0}]}>{'Add New'}</Text> */}
                <MaterialCommunityIcons style={[]} name={'plus-circle-outline'} size={30} color={'#13356177'} />
              </TouchableOpacity>
            </View>
          </View>

          {agendaList.length > 0 ? (
            <View style={{flex: 1, minHeight: detailMinHeight, width: '100%', paddingHorizontal: 16}}>
              {agendaList.map((item: any, index: number) => {
                return renderAgenda(item, index);
              })}
            </View>
          ) : (
            <View style={{flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={[NmStyles.poppinsBold, {color: '#00000022', textAlign: 'center', fontSize: 20, marginTop: 10}]}>{'Empty'}</Text>
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  componentHeader: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    paddingVertical: 10,
  },
});
