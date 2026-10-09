import React, {useState, useEffect} from 'react';
import {StyleSheet, StatusBar, View, Text, TouchableOpacity, useWindowDimensions} from 'react-native';

import {Calendar} from 'react-native-calendars';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler} from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';

import {NmGetDayOfWeek, NmGetMonthName, NmGetDate} from '../functions/NmFunctions';
import NmStyles from '../constants/NmStyles';

function Old_NmCalendar(props) {
  const {height, width} = useWindowDimensions();
  const orientation = useDeviceOrientation();
  const DeviceType = DeviceInfo.getDeviceType().toUpperCase();
  const componentPaddingH = 16;

  //Calendar dimensions must be computed manually, '100%' is not working properly
  const calendarWidth = width - componentPaddingH * 2;
  const calendarHeight = orientation == 'portrait' ? height * 0.4 : height;
  const dayHeight = orientation == 'portrait' ? height / 2 / 10 : height / 11;

  const nowDate = NmGetDate(undefined, 'dashYMD');
  const scrollY = useSharedValue(0);

  const [tmpheight, setTmpheight] = useState('100%');
  const [detailMinHeight, setDetailMinHeight] = useState(undefined);
  const [calHeight, setCalHeight] = useState(10);
  const [headerHeight, setHeaderHeight] = useState(width * 0.15);
  const [mainHeaderHeight, setMainHeaderHeight] = useState(width * 0.15);

  const [selectedDay, setSelectedDay] = useState(nowDate);
  const [agendaList, setAgendaList] = useState([]);

  const animDateOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, calHeight], [0, 1]),
    };
  });

  const sampleMarkedDates = [
    NmGetDate(undefined, 'dashYMD', undefined, -5),
    NmGetDate(undefined, 'dashYMD', undefined, -2),
    NmGetDate(undefined, 'dashYMD', undefined, 2),
    NmGetDate(undefined, 'dashYMD', undefined, 5),
  ];

  const sampleAgendas = [
    {
      date: NmGetDate(undefined, 'dashYMD', undefined, -5),
      agendaList: [
        {
          time: '10:00 am',
          duration: '1 hr',
          agenda: 'Project updates and discussion',
        },
        {
          time: '03:00 pm',
          duration: '2 hrs',
          agenda: 'Management Meeting',
        },
      ],
    },
    {
      date: NmGetDate(undefined, 'dashYMD', undefined, -2),
      agendaList: [
        {
          time: '10:00 am',
          duration: '2 hrs',
          agenda: 'System discussion',
        },
      ],
    },
    {
      date: NmGetDate(undefined, 'dashYMD', undefined, 2),
      agendaList: [
        {
          time: '10:00 am',
          duration: '2 hrs',
          agenda: 'System discussion',
        },
      ],
    },
    {
      date: NmGetDate(undefined, 'dashYMD', undefined, 5),
      agendaList: [
        {
          time: '10:00 am',
          duration: '1 hr',
          agenda: 'Project updates and discussion',
        },
        {
          time: '03:00 pm',
          duration: '2 hrs',
          agenda: 'Management Meeting',
        },
        {
          time: '03:00 pm',
          duration: '2 hrs',
          agenda: 'Management Meeting',
        },
        {
          time: '03:00 pm',
          duration: '2 hrs',
          agenda: 'Management Meeting',
        },
        {
          time: '03:00 pm',
          duration: '2 hrs',
          agenda: 'Management Meeting',
        },
        {
          time: '03:00 pm',
          duration: '2 hrs',
          agenda: 'Management Meeting',
        },
        {
          time: '03:00 pm',
          duration: '2 hrs',
          agenda: 'Management Meeting',
        },
      ],
    },
  ];

  let marked = {};

  sampleMarkedDates.forEach(day => {
    marked[day] = {
      marked: true,
      customStyles: {
        container: {
          backgroundColor: '#0000FF11',
        },
        text: {
          color: 'black',
          fontWeight: 'bold',
        },
      },
    };
  });

  marked[selectedDay] = {
    selected: true,
    dotColor: 'green',
  };

  useEffect(() => {
    var tmpIndex = -1;

    try {
      tmpIndex = sampleAgendas.findIndex(d => d.date == selectedDay);
    } catch (error) {}

    if (tmpIndex > -1) {
      setAgendaList(sampleAgendas[tmpIndex].agendaList);
    } else {
      setAgendaList([]);
    }
  }, [selectedDay]);

  useEffect(() => {
    try {
      setDetailMinHeight(tmpheight - headerHeight - mainHeaderHeight - 16);
    } catch (error) {}
  }, [tmpheight, headerHeight, mainHeaderHeight]);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const renderAgenda = (item, index) => {
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
    <View
      style={styles.container}
      onLayout={event => {
        const {x, y, width, height} = event.nativeEvent.layout;
        setTmpheight(height);
      }}>
      <StatusBar backgroundColor={'#133561'} />
      <View
        style={{width: '100%', alignItems: 'center', backgroundColor: '#133561'}}
        onLayout={event => {
          const {x, y, width, height} = event.nativeEvent.layout;
          setMainHeaderHeight(height);
        }}>
        <Text style={{color: '#FFF', fontFamily: 'Poppins-Bold', fontSize: 20, marginTop: 5, paddingVertical: 10}}>{'Calendar'}</Text>
      </View>
      <Animated.ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 16,
        }}
        stickyHeaderIndices={[1]}
        onScroll={scrollHandler}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            paddingBottom: 10,
          }}
          onLayout={event => {
            const {x, y, width, height} = event.nativeEvent.layout;
            setCalHeight(height);
          }}>
          <Calendar
            style={{
              width: calendarWidth,
              height: undefined,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: '#AAA',
              borderRadius: 12,
              paddingBottom: 5,
            }}
            enableSwipeMonths={true}
            theme={{
              backgroundColor: 'green',
              arrowColor: '#133561',
              textDisabledColor: '#DDD',
              todayTextColor: 'orange',
              selectedDayBackgroundColor: '#133561',

              textMonthFontFamily: 'Poppins-Bold',
              textDayHeaderFontFamily: 'Poppins-Medium',
              textDayFontFamily: 'Poppins-Regular',
              'stylesheet.day.basic':
                DeviceType == 'TABLET'
                  ? {
                      base: {
                        height: dayHeight,
                        width: calendarWidth / 7,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    }
                  : {},
              'stylesheet.calendar.header':
                DeviceType == 'TABLET'
                  ? {
                      header: {
                        height: dayHeight,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginTop: 6,
                        alignItems: 'center',
                      },
                      monthText: {
                        fontFamily: 'Poppins-Bold',
                        fontSize: 22,
                        margin: 10,
                      },
                      dayHeader: {
                        height: dayHeight,
                        width: calendarWidth / 7,
                        fontSize: 20,
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingTop: dayHeight / 3,
                      },
                    }
                  : {},
            }}
            onDayPress={day => {
              setSelectedDay(day.dateString);
            }}
            markingType={'custom'}
            markedDates={marked}
          />
        </View>
        <View style={{width: '100%', paddingHorizontal: 16, backgroundColor: '#FFF'}}>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}
            onLayout={event => {
              const {x, y, width, height} = event.nativeEvent.layout;
              setHeaderHeight(height);
            }}>
            <Text style={styles.componentHeader}>{'Agenda'}</Text>
            <Animated.Text style={[styles.componentHeader, animDateOpacity]}>
              {': '
                .concat(NmGetDayOfWeek(new Date(selectedDay).getDay(), true), ', ')
                .concat(NmGetMonthName(new Date(selectedDay).getMonth()), ' ')
                .concat(new Date(selectedDay).getDate(), ' ')
                .concat(new Date(selectedDay).getFullYear())}
            </Animated.Text>
          </View>
        </View>

        {agendaList.length > 0 ? (
          <View style={{flex: 1, minHeight: detailMinHeight, width: '100%', paddingHorizontal: 16}}>
            {agendaList.map((item, index) => {
              return renderAgenda(item, index);
            })}
          </View>
        ) : (
          <View style={{flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={[NmStyles.poppinsMedium, {color: '#00000055'}]}>{'No Agenda for this date'}</Text>
          </View>
        )}
      </Animated.ScrollView>
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
    fontSize: 20,
    marginTop: 5,
    paddingVertical: 10,
  },
});
