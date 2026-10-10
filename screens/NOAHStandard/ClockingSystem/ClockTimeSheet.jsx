import {useContext, useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, Image, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MonthPicker from 'react-native-month-year-picker';

import {NmLabel, NmDropdown, NmDateModal, LoadingPanel, NmModal} from '../../../components';
import {NmGetTodayTimeRecords} from '../../../functions/NmNetwork';
import {AccountDetailsContext, TimeSheetContext} from '../../../functions/Contexts';
import NmStyles from '../../../constants/NmStyles';
import {NmGetSQLDate, NmGetDateTimeSplit, NmGetFormattedTimeDiff} from '../../DateUtils/NmDateUtils';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import ClockDailySheet from './ClockDailySheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UIConfig} from '../../../Global/UIConfig';
import {NmHardwareBackPress} from '../../../functions/NmFunctions';

var XDate = require('xdate');

export default function ClockTimeSheet(props) {
  const {recuser, loginToken} = useContext(AccountDetailsContext);
  const timesheetContext = useContext(TimeSheetContext);
  const insets = useSafeAreaInsets();

  const TimeSheetData = timesheetContext?.TimeSheetTable;
  const [currentTimeData, setCurrentTimeData] = useState(TimeSheetData);

  const filterList = [
    {
      label: 'Daily',
      value: 'FILTER_DAILY',
    },
    {
      label: 'Monthly',
      value: 'FILTER_MONTHLY',
    },
    {
      label: 'Select Range',
      value: 'FILTER_RANGE',
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState(filterList[0].value);
  const [dateDailyValue, setDateDailyValue] = useState(new XDate());

  const [dateMonthlyValue, setDateMonthlyValue] = useState(new XDate());
  const [showMonthlyPicker, setShowMonthlyPicker] = useState(false);

  const [dateFromFilter, setDateFromFilter] = useState(new XDate());
  const [dateToFilter, setDateToFilter] = useState(new XDate());

  const [dateRangeData, setDateRangeData] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showPicker = useCallback(value => setShow(value), []);

  NmHardwareBackPress();

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || dateMonthlyValue;

      setShowMonthlyPicker(false);
      setDateMonthlyValue(selectedDate);
    },
    [dateMonthlyValue, showPicker],
  );

  useEffect(() => {
    setLoadingMessage('Loading...');
    setCurrentTimeData();
    if (selectedFilter == 'FILTER_DAILY') {
      setDateDailyValue(new XDate());
    } else if (selectedFilter == 'FILTER_MONTHLY') {
      setDateMonthlyValue(new XDate());
    } else if (selectedFilter == 'FILTER_RANGE') {
      setDateFromFilter(new XDate());
      setDateToFilter(new XDate());
    }
  }, [selectedFilter]);

  useEffect(() => {
    setCurrentTimeData(TimeSheetData);
  }, [TimeSheetData]);

  useEffect(() => {
    if (currentTimeData?.length == 0) {
      setLoadingMessage('No Records Found');
    }
  }, [currentTimeData]);

  useEffect(() => {
    setLoading(true);

    let fromDate = NmGetSQLDate(new XDate());
    let toDate = NmGetSQLDate(new XDate());

    if (selectedFilter == 'FILTER_DAILY') {
      fromDate = NmGetSQLDate(new XDate(dateDailyValue));
      toDate = NmGetSQLDate(new XDate(dateDailyValue));
    } else if (selectedFilter == 'FILTER_MONTHLY') {
      fromDate = new XDate(dateMonthlyValue).setDate(1);
      toDate = new XDate(dateMonthlyValue);
      toDate = toDate.setDate(XDate.getDaysInMonth(toDate.getFullYear(), toDate.getMonth()));

      fromDate = NmGetSQLDate(fromDate);
      toDate = NmGetSQLDate(toDate);
    } else if (selectedFilter == 'FILTER_RANGE') {
      const tempFromDate = new XDate(dateFromFilter).toString('yyyy-MM-dd');
      const tempToDate = new XDate(dateToFilter).toString('yyyy-MM-dd');

      fromDate = NmGetSQLDate(dateFromFilter.toString('yyyy-MM-dd'));
      toDate = NmGetSQLDate(dateToFilter.toString('yyyy-MM-dd'));

      if (tempFromDate > tempToDate) {
        fromDate = toDate;
        setDateFromFilter(dateToFilter);
      }
    }

    NmGetTodayTimeRecords(recuser, loginToken, fromDate, toDate).then(response => {
      setLoading(false);

      if (response.status == '200') {
        const parseClockData = JSON.parse(response.data);
        const clockData = parseClockData?.TimeSheetTable;

        if (selectedFilter == 'FILTER_MONTHLY' || selectedFilter == 'FILTER_RANGE') {
          const UniqueDates = [...new Set(clockData.map(item => item.TDate))];
          let tempRangeData = [];
          UniqueDates.forEach(item => {
            const tempClockData = clockData.filter(row => row.TDate == item);
            const tempDate = new XDate(item).toString('ddd, MMM dd');

            const tempClockIn = clockData.filter(row => row.TDate == item && row.Tag == 1) || [];
            const tempClockOut = clockData.filter(row => row.TDate == item && row.Tag == 0) || [];

            let tempTimeIn = undefined;
            let tempTimeOut = undefined;

            if (tempClockIn.length > 0) {
              tempTimeIn = NmGetDateTimeSplit(item, tempClockIn[0].TTime);
            }

            if (tempClockOut.length > 0) {
              tempTimeOut = NmGetDateTimeSplit(item, tempClockOut[0].TTime);
            }

            tempRangeData.push({
              rowDate: tempDate,
              rowRecords: tempClockData,
              rowTimeIn: tempTimeIn,
              rowTimeOut: tempTimeOut,
            });
          });
          setDateRangeData(tempRangeData);
        }

        if (clockData.length > 0) {
          setCurrentTimeData(clockData);
        }
      } else {
        //
      }
    });
  }, [dateDailyValue, dateMonthlyValue, dateFromFilter, dateToFilter]);

  const renderItem = ({item, index}) => {
    const lastIndex = index == dateRangeData.length - 1 ? true : false;
    let workHoursDiff = '',
      workHoursText = '';

    if (item.rowTimeIn == undefined) {
      workHoursDiff = 'N/A';
      workHoursText = 'Did not clock in';
    } else if (item.rowTimeIn != undefined && item.rowTimeOut == undefined) {
      workHoursDiff = 'N/A';
      workHoursText = new XDate(item.rowTimeIn).toString('hh:mm tt') + ' - ' + 'Not Clocked Out.';
    } else if (item.rowTimeIn != undefined && item.rowTimeOut != undefined) {
      workHoursDiff = NmGetFormattedTimeDiff(new XDate(item.rowTimeIn).diffMinutes(new XDate(item.rowTimeOut)));
      workHoursText = new XDate(item.rowTimeIn).toString('hh:mm tt') + ' - ' + new XDate(item.rowTimeOut).toString('hh:mm tt');
    }

    return (
      <TouchableOpacity
        style={{width: '100%', borderBottomWidth: lastIndex ? 0 : 0.2, borderColor: '#AAA', flexDirection: 'row'}}
        activeOpacity={0.5}
        onPress={() => {
          props.navigation.navigate('ClockDailySingle', {timeSheetData: JSON.stringify(item)});
        }}>
        <View style={{flex: 1, paddingVertical: 6}}>
          <NmLabel style={[NmStyles.poppinsBold, {fontSize: 15}]}>{item.rowDate}</NmLabel>
          <NmLabel style={[{fontSize: 15}]}>{workHoursText}</NmLabel>
        </View>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <NmLabel style={[{fontSize: 15, marginBottom: -3}]}>{workHoursDiff}</NmLabel>
          <MaterialCommunityIcons name={'chevron-right'} size={24} color={'#2E7FF9'} style={{marginRight: -7, marginLeft: 2}} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingPanel />}
      <View
        style={{
          backgroundColor: '#FFF',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          shadowColor: '#5b5b5b4c',
          shadowOffset: {width: 0, height: 8},
          shadowRadius: 6,
          shadowOpacity: 0.2,
          elevation: 3,
          paddingBottom: 4,
          paddingTop: insets.top + 8,
        }}>
        <NmLabel style={[NmStyles.poppinsMedium, {fontSize: 20}]}>{'TimeSheet'}</NmLabel>
      </View>
      <View style={{width: '100%', padding: 10}}>
        <View style={{backgroundColor: '#FFF', borderRadius: 12, padding: 10, elevation: 3}}>
          <NmLabel style={[NmStyles.poppinsBold, {fontSize: 19}]}>{'Filter'}</NmLabel>
          <View style={{width: '100%', height: 0.6, backgroundColor: '#2E7FF9', marginBottom: 10, marginTop: 5}}></View>
          <NmDropdown items={filterList} value={selectedFilter} setValue={setSelectedFilter} containerStyle={{}} radioContainerStyle={{paddingVertical: 0}} />
          {selectedFilter == 'FILTER_DAILY' && (
            <NmDateModal enabled={true} dateValue={dateDailyValue} setDateValue={setDateDailyValue} style={{marginTop: 10}} pickerMode={'DEVICE'} customFormat={'MMM dd, yyyy'} />
          )}

          {selectedFilter == 'FILTER_MONTHLY' && (
            <TouchableOpacity
              onPress={() => {
                setShowMonthlyPicker(true);
              }}
              style={[styles.dateContainer]}>
              <NmLabel style={[styles.dateSelectedValue]} numberOfLines={1}>
                {new XDate(dateMonthlyValue).toString('MMMM yyyy')}
              </NmLabel>
              <Image source={UIConfig.DropdownIcon} style={{height: 20, width: 20, resizeMode: 'contain', tintColor: '#466DC6', marginRight: 10}} />
            </TouchableOpacity>
          )}

          {selectedFilter == 'FILTER_RANGE' && (
            <View style={{marginTop: 10}}>
              <View style={{width: '100%', alignItems: 'center', flexDirection: 'row'}}>
                <View style={{width: 80}}>
                  <NmLabel>{'From'}</NmLabel>
                </View>
                <View style={{flex: 1}}>
                  <NmDateModal style={{}} enabled={true} dateValue={dateFromFilter} setDateValue={setDateFromFilter} pickerMode={'DEVICE'} customFormat={'MMM dd, yyyy'} />
                </View>
              </View>
              <View style={{width: '100%', alignItems: 'center', flexDirection: 'row', marginTop: 10}}>
                <View style={{width: 80}}>
                  <NmLabel>{'To'}</NmLabel>
                </View>
                <View style={{flex: 1}}>
                  <NmDateModal style={{}} enabled={true} dateValue={dateToFilter} setDateValue={setDateToFilter} pickerMode={'DEVICE'} customFormat={'MMM dd, yyyy'} />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={{flex: 1, padding: 10, paddingTop: 0, width: '100%'}}>
        {currentTimeData?.length > 0 ? (
          selectedFilter == 'FILTER_DAILY' ? (
            <ClockDailySheet timeSheetData={currentTimeData} />
          ) : selectedFilter == 'FILTER_MONTHLY' || selectedFilter == 'FILTER_RANGE' ? (
            <View style={{flex: 1, backgroundColor: '#FFF', width: '100%', borderRadius: 12, padding: 10, elevation: 3}}>
              <FlatList data={dateRangeData} renderItem={renderItem} keyExtractor={item => item.rowDate.toString()} contentContainerStyle={{flexGrow: 1}} />
            </View>
          ) : undefined
        ) : (
          // selectedFilter == 'FILTER_MONTHLY' && <FlatList data={currentTimeData} renderItem={renderItem} keyExtractor={item => item.RecDate.toString()} />
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', width: '100%', borderRadius: 12, padding: 10, elevation: 3}}>
            <NmLabel style={[NmStyles.poppinsBold, {fontSize: 18, color: '#CCC'}]}>{loadingMessage}</NmLabel>
          </View>
        )}
      </View>

      {showMonthlyPicker &&
        (Platform.OS == 'android' ? (
          <MonthPicker onChange={onValueChange} value={dateMonthlyValue} locale={'en'} />
        ) : Platform.OS == 'ios' ? (
          <NmModal customView={true} winVisible={showMonthlyPicker} setWinVisible={setShowMonthlyPicker} customAnimate={true} customAnimateIn={'fadeIn'} customAnimateOut={'fadeOut'} inTiming={100}>
            <MonthPicker onChange={onValueChange} value={dateMonthlyValue} locale={'en'} />
          </NmModal>
        ) : undefined)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    marginTop: 10,
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
