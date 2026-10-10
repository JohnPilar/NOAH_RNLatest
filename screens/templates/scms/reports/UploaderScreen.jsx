import React, {useContext, useState} from 'react';
import {View, StyleSheet, FlatList, Text, StatusBar, TouchableOpacity} from 'react-native';

import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated from 'react-native-reanimated';

import {NmGetDate} from '../../../../functions/NmFunctions';
import {NmStyles} from '../../../../constants';
import {NmTextInput} from '../../../../components';
import {AccountDetailsContext} from '../../../../functions/Contexts';

export default function UploaderScreen(props) {
  const {recname} = useContext(AccountDetailsContext);
  const [selector, setSelector] = useState();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [dpModal, setDpModal] = useState(false);

  const sampleDataX = [
    {
      uploader: recname,
      date: NmGetDate(undefined, 'slashMDY').concat('  ', NmGetDate(new Date(), 'customFormat', 'hh:mm a')),
      company: 'Federal Land',
      project: 'FPMC Mobile',
      module: 'PMO',
      menuGroup: 'DocumentEntry',
      menuItemCode: 'PMORegistration',
      menuItemDesc: 'Registration Approval',
      version: '9.0.0.5',
      status: 'Approved',
      expanded: false,
    },
    {
      uploader: 'Dean Pilacan',
      date: NmGetDate(new Date('2024-10-04'), 'slashMDY').concat('  ', NmGetDate(new Date(), 'customFormat', 'hh:mm a')),
      company: 'APMC',
      project: 'APMC PREPROD',
      module: 'PMO',
      menuGroup: 'DataSetup',
      menuItemCode: 'PMOCustomerInformation',
      menuItemDesc: 'PMOCustomerInformation',
      version: '9.0.0.48',
      status: 'Approved',
      expanded: false,
    },
    {
      uploader: recname,
      date: NmGetDate(undefined, 'slashMDY').concat('  ', NmGetDate(new Date(), 'customFormat', 'hh:mm a')),
      company: 'Federal Land',
      project: 'FPMC Mobile',
      module: 'PMO',
      menuGroup: 'DocumentEntry',
      menuItemCode: 'PMORegistration',
      menuItemDesc: 'Registration Approval long text longer than the screen',
      version: '9.0.0.5',
      status: 'Approved',
      expanded: false,
    },
    {
      uploader: 'Dean Pilacan',
      date: NmGetDate(new Date('9/2/2024'), 'slashMDY').concat('  ', NmGetDate(new Date(), 'customFormat', 'hh:mm a')),
      company: 'APMC',
      project: 'APMC PREPROD',
      module: 'PMO',
      menuGroup: 'DataSetup',
      menuItemCode: 'PMOCustomerInformation',
      menuItemDesc: 'PMOCustomerInformation',
      version: '9.0.0.48',
      status: 'Approved',
      expanded: false,
    },
  ];

  const [sampleData, setSampleData] = useState(sampleDataX);

  const renderItem = ({item, index}) => {
    return (
      <View style={{paddingVertical: 10}}>
        <View style={{backgroundColor: '#FFF', width: '100%', paddingVertical: 10, borderRadius: 12, overflow: 'hidden'}}>
          <View style={styles.detailRow}>
            <Text style={styles.rowTitle}>{'Uploaded by'}</Text>
            <Text style={styles.rowInfo}>{item.uploader}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.rowTitle}>{'Date'}</Text>
            <Text style={styles.rowInfo}>{item.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.rowTitle}>{'Company'}</Text>
            <Text style={styles.rowInfo}>{item.company}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.rowTitle}>{'Project'}</Text>
            <Text style={styles.rowInfo}>{item.project}</Text>
          </View>
          <View style={{width: '100%', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#CCC'}}>
            <TouchableOpacity
              onPress={() => {
                const tmpData = [...sampleData];
                tmpData[index].expanded = !item.expanded;
                setSampleData(tmpData);
              }}
              style={[styles.detailRow, {alignItems: 'center'}]}>
              <Text style={styles.rowTitle}>{'Menu Item Details'}</Text>
              <MaterialCommunityIcons style={{transform: [{rotate: '0deg'}]}} name={item.expanded ? 'menu-up' : 'menu-down'} size={30} color={'#133561'} />
            </TouchableOpacity>
            {item.expanded && (
              <Animated.View style={{backgroundColor: '#F8F8F8'}}>
                <View style={[styles.detailRow, {flexDirection: 'column', marginTop: 5}]}>
                  <Text style={styles.rowTitle}>{'Module'}</Text>
                  <Text style={[styles.rowInfo, {marginLeft: 0}]}>{item.module}</Text>
                </View>
                <View style={[styles.detailRow, {flexDirection: 'column'}]}>
                  <Text style={styles.rowTitle}>{'Menu Group'}</Text>
                  <Text style={[styles.rowInfo, {marginLeft: 0}]}>{item.menuGroup}</Text>
                </View>
                <View style={[styles.detailRow, {flexDirection: 'column'}]}>
                  <Text style={styles.rowTitle}>{'Menu Item Code'}</Text>
                  <Text style={[styles.rowInfo, {marginLeft: 0}]}>{item.menuItemCode}</Text>
                </View>
                <View style={[styles.detailRow, {flexDirection: 'column', marginBottom: 5}]}>
                  <Text style={styles.rowTitle}>{'Menu Item Description'}</Text>
                  <Text style={[styles.rowInfo, {marginLeft: 0}]}>{item.menuItemDesc}</Text>
                </View>
              </Animated.View>
            )}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.rowTitle}>{'Version'}</Text>
            <Text style={styles.rowInfo}>{item.version}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.rowTitle}>{'Status'}</Text>
            <Text style={styles.rowInfo}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DatePicker
        modal
        mode={'date'}
        open={dpModal}
        date={selector == '000' ? fromDate : toDate}
        onConfirm={date => {
          if (selector == '000') {
            setFromDate(date);
          } else {
            setToDate(date);
          }
          setDpModal(false);
        }}
        onCancel={() => {
          setDpModal(false);
        }}
      />
      <StatusBar backgroundColor={'#133561'} />
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#133561'}}>
        <Text style={{color: '#FFF', fontFamily: 'Poppins-Bold', fontSize: 20, marginTop: 5, paddingVertical: 10}}>{'Uploaded Source Code'}</Text>
      </View>
      <View style={{flex: 1}}>
        <View style={{paddingHorizontal: 16}}>
          <Text style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'Start Date'}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelector('000');
              setDpModal(true);
            }}>
            <NmTextInput value={fromDate != undefined && NmGetDate(fromDate, 'slashMDY')} editable={false} containerStyle={{}} />
          </TouchableOpacity>
          <Text style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'End Date'}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelector('101');
              setDpModal(true);
            }}>
            <NmTextInput value={toDate != undefined && NmGetDate(toDate, 'slashMDY')} editable={false} containerStyle={{marginBottom: 15}} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, paddingHorizontal: 16, backgroundColor: '#EEE'}}>
          <FlatList
            ListHeaderComponent={() => {
              //return <View style={{width: '100%', backgroundColor: 'green', height: 100}}></View>;
            }}
            data={sampleData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            style={{marginVertical: 5}}
          />
        </View>
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
  detailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  rowTitle: {
    ...NmStyles.poppinsRegular,
    fontSize: 15,
    marginTop: 1,
  },
  rowInfo: {
    ...NmStyles.poppinsBold,
    fontSize: 15,
    marginLeft: 5,
  },
});
