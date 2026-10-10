import React, {useState, useCallback, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, DimensionValue, LayoutChangeEvent} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../../functions/NmFunctions';

import {sameMonth, page, isDateNotInRange} from './NmDateUtils';
import {NmGetMonthName} from '../../functions/NmFunctions';
import {ThemesContext} from '../../functions/ThemeContext';

var XDate = require('xdate');

export default function NmCalendar(props: any): React.JSX.Element {
  const {theme} = useContext(ThemesContext);
  const {currentDate, markedDates, onDatePress, dayTextStyle, dayContainerStyle, containerStyle, LocaleEN, weekHeaderStyle, monthHeaderStyle, renderMonthStyle} = props;

  const orientation = useDeviceOrientation();
  const DeviceType = DeviceInfo.getDeviceType().toUpperCase();

  const [currentMonth, setCurrentMonth] = useState<any>(currentDate == undefined ? new XDate() : new XDate(currentDate));
  const [dayWidth, setDayWidth] = useState<DimensionValue>();

  const todayDate = LocaleEN == true ? new XDate().toString('MM/dd/yyyy') : new XDate().toString('yyyy-MM-dd');

  const updateMonth = useCallback(
    (newMonth: any): void => {
      if (sameMonth(newMonth, currentMonth)) {
        return;
      }
      setCurrentMonth(newMonth);
    },
    [currentMonth],
  );

  const addMonth = useCallback(
    (count: number): void => {
      const newMonth = currentMonth.clone().addMonths(count, true);
      updateMonth(newMonth);
    },
    [currentMonth, updateMonth],
  );

  const renderMonth = (): React.JSX.Element => {
    const days = page(currentMonth, 0, true);
    const weeks: React.JSX.Element[] = [];

    while (days.length) {
      weeks.push(renderWeek(days.splice(0, 7), weeks.length));
    }

    return <View style={[{flex: 1, width: '100%', backgroundColor: theme.calendarBackground}, renderMonthStyle]}>{weeks}</View>;
  };

  const renderWeek = (days: any[], id: number): React.JSX.Element => {
    const week: React.JSX.Element[] = [];

    days.forEach((day, id2) => {
      week.push(renderDay(day, id2));
    });

    return (
      <View style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between'}} key={id}>
        {week}
      </View>
    );
  };

  const renderDay = (day: any, id: number): React.JSX.Element => {
    const markerSize = DeviceType == 'TABLET' ? 11 : 7;
    const markerBottom = DeviceType == 'TABLET' ? (orientation == 'portrait' ? 2 : 9) : 4;
    const stringDate = LocaleEN == true ? new XDate(day).toString('MM/dd/yyyy') : new XDate(day).toString('yyyy-MM-dd');
    const selected = markedDates?.[stringDate]?.selected;
    const marked = markedDates?.[stringDate]?.marked;
    const markedColor = isDateNotInRange(day, currentMonth) == true ? '#13356133' : '#55FF0077';
    const textColor =
      isDateNotInRange(day, currentMonth) == true
        ? selected == true
          ? '#FFF'
          : theme.calendarDayDiffMonth
        : todayDate == stringDate
        ? selected == true
          ? '#FFF'
          : 'orange'
        : selected == true
        ? '#FFF'
        : theme.calendarDay;

    return (
      <TouchableOpacity
        key={id}
        onPress={() => {
          updateMonth(day);
          onDatePress?.(stringDate);
        }}
        style={[
          {
            width: dayWidth,
            padding: 2,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.calendarDayBorder,
            backgroundColor: selected ? (isDateNotInRange(day, currentMonth) == true ? theme.calendarDaySelectedDiffMonth : theme.calendarDaySelected) : undefined,
          },
          dayContainerStyle,
        ]}>
        <Text style={[{fontFamily: 'Poppins-Medium', color: textColor, fontSize: 16}, dayTextStyle]}>{new XDate(day).getDate()}</Text>
        {marked && <View style={{width: markerSize, height: markerSize, backgroundColor: markedColor, borderRadius: 20, position: 'absolute', bottom: 4, zIndex: 0}}></View>}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[{flex: 1, width: '100%', height: '100%', backgroundColor: '#CCC'}, containerStyle]}
      onLayout={(event: LayoutChangeEvent) => {
        const {x, y, width, height} = event.nativeEvent.layout;
        setDayWidth(width / 7);
      }}>
      <MonthHeader theme={theme} updateMonth={addMonth} monthName={NmGetMonthName(currentMonth.getMonth(), true).concat(' ', currentMonth.getFullYear())} containerStyle={monthHeaderStyle} />
      <WeekHeader theme={theme} upperCase={true} dayWidth={dayWidth} textContainerStyle={weekHeaderStyle} />
      {renderMonth()}
    </View>
  );
}

const MonthHeader = ({iconSize, iconColor, updateMonth, iconStyle, textStyle, containerStyle, monthName, theme}: any) => {
  const iSize = iconSize || 25;
  const iColor = iconColor || theme.calendarArrows;

  const addMonth = useCallback((): void => {
    updateMonth?.(1);
  }, [updateMonth]);

  const subtractMonth = useCallback((): void => {
    updateMonth?.(-1);
  }, [updateMonth]);

  const styles = StyleSheet.create({
    monthChange: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      paddingHorizontal: 14,
    },
  });

  return (
    <View style={[{width: '100%', height: 52, backgroundColor: theme.panelBackground, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, containerStyle]}>
      <TouchableOpacity onPress={subtractMonth} style={styles.monthChange}>
        <MaterialCommunityIcons style={[iconStyle]} name={'arrow-left'} size={iSize} color={iColor} />
      </TouchableOpacity>
      <TouchableOpacity style={{flex: 1, height: '100%', marginHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={[{fontFamily: 'Poppins-Bold', color: theme.calendarMonth, fontSize: 18, marginBottom: -2}, textStyle]}>{monthName}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={addMonth} style={styles.monthChange}>
        <MaterialCommunityIcons style={[iconStyle]} name={'arrow-right'} size={iSize} color={iColor} />
      </TouchableOpacity>
    </View>
  );
};

const WeekHeader = ({containerStyle, textContainerStyle, textStyle, upperCase, dayWidth, theme}: any) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={[{width: '100%', backgroundColor: theme.calendarWeek, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, containerStyle]}>
      {days.map((item, index) => {
        return (
          <View
            key={index}
            style={[
              {
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                width: dayWidth,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.calendarWeekBorder,
              },
              textContainerStyle,
            ]}>
            <Text style={[{fontFamily: 'Poppins-Medium', color: theme.calendarMonth, fontSize: 14}, textStyle]}>{upperCase ? item.toUpperCase() : item}</Text>
          </View>
        );
      })}
    </View>
  );
};
