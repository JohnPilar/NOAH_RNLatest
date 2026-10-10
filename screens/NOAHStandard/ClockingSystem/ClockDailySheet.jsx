import {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NmStyles} from '../../../constants';
import {NmLabel} from '../../../components';
import {getTimeKeepingDate, NmGetFormattedTimeDiff} from '../../DateUtils/NmDateUtils';

var XDate = require('xdate');

export default function ClockDailySheet(props) {
  const {timeSheetData} = props;

  const TimeInIndex = timeSheetData?.findIndex(row => row.Tag == 1);
  const TimeOutIndex = timeSheetData?.findIndex(row => row.Tag == 0);

  const TimeIn = timeSheetData[TimeInIndex]?.TDate != undefined && timeSheetData[TimeInIndex]?.TTime ? new XDate(getTimeKeepingDate(timeSheetData[TimeInIndex]?.TDate, timeSheetData[TimeInIndex]?.TTime)).toString('hh:mm TT') : 'N/A';
  const TimeOut = timeSheetData[TimeOutIndex]?.TDate != undefined && timeSheetData[TimeOutIndex]?.TTime ? new XDate(getTimeKeepingDate(timeSheetData[TimeOutIndex]?.TDate, timeSheetData[TimeOutIndex]?.TTime)).toString('hh:mm TT') : 'N/A';

  const [currentTimeSheet, setCurrentTimeSheet] = useState(timeSheetData);

  const [totalWorkMins, setTotalWorkMins] = useState();
  const [totalWorkMinsText, setTotalWorkMinsText] = useState();

  const [totalBreakMins, setTotalBreakMins] = useState();
  const [totalBreakText, setTotalBreakText] = useState();

  // console.log('getDaysInMonth', XDate.getDaysInMonth(2025, 4));

  useEffect(() => {
    let WorkingHours = timeSheetData.filter(row => row.Tag == 0 || row.Tag == 1);
    if (WorkingHours?.length > 1) {
      WorkingHours.sort((a, b) => a.RecDate - b.RecDate);

      let tempWorkHours = 0;
      for (let ctr = 1; ctr <= WorkingHours?.length; ctr++) {
        if (ctr % 2 == 0) {
          let startBreak = new XDate(WorkingHours[ctr - 2].RecDate);
          const breakDiff = startBreak.diffMinutes(new XDate(WorkingHours[ctr - 1].RecDate));
          tempWorkHours += breakDiff;
        }
      }
      setTotalWorkMins(tempWorkHours);
    }

    let BreakTimeRecords = timeSheetData.filter(row => row.Tag == 2 || row.Tag == 3);
    if (BreakTimeRecords?.length > 1) {
      BreakTimeRecords.sort((a, b) => a.RecDate - b.RecDate);

      let tempBreakTime = 0;
      for (let ctr = 1; ctr <= BreakTimeRecords?.length; ctr++) {
        if (ctr % 2 == 0) {
          let startBreak = new XDate(BreakTimeRecords[ctr - 2].RecDate);
          const breakDiff = startBreak.diffMinutes(new XDate(BreakTimeRecords[ctr - 1].RecDate));
          tempBreakTime += breakDiff;
        }
      }
      setTotalBreakMins(tempBreakTime);
    }

    setCurrentTimeSheet(timeSheetData);
  }, [timeSheetData]);

  useEffect(() => {
    setTotalWorkMinsText(NmGetFormattedTimeDiff(totalWorkMins));
  }, [totalWorkMins]);

  useEffect(() => {
    setTotalBreakText(NmGetFormattedTimeDiff(totalBreakMins));
  }, [totalBreakMins]);

  function getEntryType(tag) {
    switch (tag) {
      case 1:
        return 'Time In';
      case 0:
        return 'Time Out';
      case 2:
        return 'Break Out';
      case 3:
        return 'Break In';
    }
  }

  function getEntryIcon(tag) {
    switch (tag) {
      case 1:
        return 'clock-time-eight-outline';
      case 0:
        return 'clock-outline';
      case 2:
        return 'coffee-outline';
      case 3:
        return 'coffee-off';
    }
  }

  return (
    <View style={{flex: 1, width: '100%', backgroundColor: '#FFF', padding: 10, borderRadius: 12, elevation: 3}}>
      <ScrollView style={{width: '100%', flex: 1}} contentContainerStyle={{flexGrow: 1}} stickyHeaderIndices={[4]}>
        <NmLabel style={[NmStyles.poppinsBold, {fontSize: 19}]}>{'Tracked Time'}</NmLabel>
        <View style={{width: '100%', height: 0.6, backgroundColor: '#2E7FF9', marginBottom: 10}} />

        <View style={{width: '100%', flexDirection: 'row', marginBottom: 16}}>
          <View style={{flex: 1}}>
            <NmLabel style={[{marginBottom: -4, fontSize: 17}]}>{'Clock In'}</NmLabel>
            <NmLabel style={[NmStyles.poppinsBold, {marginBottom: -4, fontSize: 17}]}>{TimeIn}</NmLabel>
          </View>
          <View style={{flex: 1}}>
            <NmLabel style={[{marginBottom: -4, fontSize: 17}]}>{'Clock Out'}</NmLabel>
            <NmLabel style={[NmStyles.poppinsBold, {marginBottom: -4, fontSize: 17}]}>{TimeOut}</NmLabel>
          </View>
        </View>

        <View style={{width: '100%', flexDirection: 'row', marginBottom: 24}}>
          <View style={{flex: 1}}>
            <NmLabel style={[{marginBottom: -4, fontSize: 17}]}>{'Breaks'}</NmLabel>
            <NmLabel style={[NmStyles.poppinsBold, {marginBottom: -4, fontSize: 17}]}>{totalBreakText}</NmLabel>
          </View>
          <View style={{flex: 1}}>
            <NmLabel style={[{marginBottom: -4, fontSize: 17}]}>{'Worked Hours'}</NmLabel>
            <NmLabel style={[NmStyles.poppinsBold, {marginBottom: -4, fontSize: 17}]}>{totalWorkMinsText}</NmLabel>
          </View>
        </View>

        <View style={{width: '100%', marginBottom: 0, backgroundColor: '#FFF'}}>
          <NmLabel style={[NmStyles.poppinsBold, {fontSize: 19}]}>{'Detailed Entry'}</NmLabel>
          <View style={{width: '100%', height: 0.6, backgroundColor: '#2E7FF9', marginBottom: 10}} />
        </View>

        <View style={{width: '100%', marginBottom: 0}}>
          {currentTimeSheet.map((item, index) => {
            return (
              <View
                key={index.toString()}
                style={{width: '100%', marginBottom: index == currentTimeSheet?.length - 1 ? 0 : 10, paddingBottom: 10, borderBottomWidth: index == currentTimeSheet?.length - 1 ? 0 : StyleSheet.hairlineWidth, borderBottomColor: '#CCC'}}>
                <NmLabel>{getEntryType(item.Tag)}</NmLabel>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                  <MaterialCommunityIcons name={getEntryIcon(item.Tag)} color={'#2E7FF9'} size={18} />
                  <NmLabel style={[NmStyles.poppinsBold, {marginBottom: -4, marginLeft: 5}]}>{new XDate(item.RecDate).toString('hh:mm tt').toUpperCase()}</NmLabel>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialCommunityIcons name={'map-marker-outline'} color={'#2E7FF9'} size={18} />
                  <NmLabel style={[NmStyles.poppinsBold, {marginBottom: -4, marginLeft: 5}]}>{item.LocationCode + ' - ' + item.LocationBranch}</NmLabel>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
