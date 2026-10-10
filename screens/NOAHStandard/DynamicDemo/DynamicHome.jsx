import {StyleSheet, View, BackHandler} from 'react-native';
import DynamicView from './DynamicView';
import {useEffect} from 'react';
import {NmHardwareBackPress} from '../../../functions/NmFunctions';

export default function DynamicHome(props) {
  NmHardwareBackPress();

  const sampleObject = [
    {
      id: 'txtName',
      type: 'TextInput',
      label: 'Name',
      required: true,
      style: {},
      data: undefined,
    },
    {
      id: 'cmbMonths',
      type: 'Dropdown',
      label: 'Birth Month',
      required: true,
      style: {},
      data: [
        {value: '01', label: 'January'},
        {value: '02', label: 'February'},
        {value: '03', label: 'March'},
      ],
    },
    {
      id: 'dtpDate',
      type: 'DatePicker',
      label: 'Lucky Date?',
      required: false,
      style: {},
      data: undefined,
    },
  ];

  return (
    <View style={styles.container}>
      <DynamicView miComponents={sampleObject} menuTitle={'Menu Item #1'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    width: '100%',
  },
});
