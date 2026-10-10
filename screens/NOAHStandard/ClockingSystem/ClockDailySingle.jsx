import {useEffect} from 'react';
import ClockDailySheet from './ClockDailySheet';
import {StyleSheet, View, BackHandler} from 'react-native';

import {NmLabel} from '../../../components';
import {NmStyles} from '../../../constants';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NmHardwareBackPress} from '../../../functions/NmFunctions';

const ClockDailySingle = props => {
  const {timeSheetData} = props.route.params;
  const insets = useSafeAreaInsets();

  const parseData = JSON.parse(timeSheetData);
  const rowData = parseData?.rowRecords;

  NmHardwareBackPress();
  return (
    <View style={styles.container}>
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
          paddingTop: insets.top,
        }}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <NmLabel style={[NmStyles.poppinsMedium, {fontSize: 20}]}>{parseData.rowDate}</NmLabel>
        </View>
      </View>
      <View style={{flex: 1, width: '100%', padding: 10}}>
        <ClockDailySheet timeSheetData={rowData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    width: '100%',
  },
});

export default ClockDailySingle;
