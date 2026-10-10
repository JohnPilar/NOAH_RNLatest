import React, {useState, useEffect, useRef} from 'react';
import {Text, StyleSheet, BackHandler, TouchableOpacity, ScrollView, View, TouchableWithoutFeedback, Keyboard, FlatList} from 'react-native';

import {useStyles} from '../../functions/Orientation';

import {resendOTPCode} from '../../unctions/NmFunctions';
import {NmHardwareBackPress} from '../../functions/NmFunctions';

const TransactionHistory = props => {
  NmHardwareBackPress(() => {
    props.navigation.navigate('Home');
    return true;
  });

  const nonBillableList = [
    {
      'Request Docno': '001',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Draft',
    },
    {
      'Request Docno': '002',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Ongoing',
    },
    {
      'Request Docno': '003',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Completed',
    },
    {
      'Request Docno': '004',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Draft',
    },
    {
      'Request Docno': '005',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Ongoing',
    },
    {
      'Request Docno': '006',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Completed',
    },
    {
      'Request Docno': '007',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Draft',
    },
    {
      'Request Docno': '008',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Ongoing',
    },
    {
      'Request Docno': '009',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Completed',
    },
    {
      'Request Docno': '010',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Draft',
    },
    {
      'Request Docno': '011',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Ongoing',
    },
    {
      'Request Docno': '012',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Transaction Date': '07/04/2023',
      Status: 'Completed',
    },
  ];

  const billableList = [
    {
      'Request Docno': '0001',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Net Amount': '10,000.00',
      'Transaction Date': '07/04/2023',
      Status: 'Draft',
    },
    {
      'Request Docno': '0002',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Net Amount': '10,000.00',
      'Transaction Date': '07/04/2023',
      Status: 'For Approval',
    },
    {
      'Request Docno': '0003',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Net Amount': '10,000.00',
      'Transaction Date': '07/04/2023',
      Status: 'Completed',
    },
    {
      'Request Docno': '0004',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Net Amount': '10,000.00',
      'Transaction Date': '07/04/2023',
      Status: 'Ongoing',
    },
    {
      'Request Docno': '0005',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Net Amount': '10,000.00',
      'Transaction Date': '07/04/2023',
      Status: 'Draft',
    },
    {
      'Request Docno': '0006',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Net Amount': '10,000.00',
      'Transaction Date': '07/04/2023',
      Status: 'For Approval',
    },
    {
      'Request Docno': '0007',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Net Amount': '10,000.00',
      'Transaction Date': '07/04/2023',
      Status: 'Completed',
    },
    {
      'Request Docno': '0008',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'Net Amount': '10,000.00',
      'Transaction Date': '07/04/2023',
      Status: 'Ongoing',
    },
  ];

  const allList = nonBillableList.concat(billableList);

  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(5);

  const [renderList, setRenderList] = useState(allList.slice(sliceStart, sliceEnd));

  //--------------------------------------------------------

  const [listRefreshing, setListRefreshing] = useState(false);

  const NwClass = useStyles();
  const flatListRef = useRef();

  const [reqType, setReqType] = useState();
  const [reqTypeVisible, setReqTypeVisible] = useState(false);
  const [displayReqType, setDisplayReqType] = useState();

  const [reqs, setReqs] = useState();
  const [reqsVisible, setReqsVisible] = useState(false);
  const [displayReqs, setDisplayReqs] = useState();

  const [status, setStatus] = useState();
  const [statusVisible, setstatusVisible] = useState(false);
  const [displayStatus, setDisplayStatus] = useState();

  const [itemList, setItemList] = useState();

  const loadmoreItems = () => {
    let newStart = sliceEnd;
    let newEnd = sliceEnd + 5;

    setSliceStart(newStart);
    setSliceEnd(newEnd);
    setRenderList([...renderList, ...allList.slice(newStart, newEnd)]);

    setListRefreshing(false);
    //console.log(renderList);
  };

  const renderItem = ({item}) => {
    //console.log(item);
    let titleHeader = true;

    return (
      <TouchableOpacity style={{width: '100%'}} onPress={() => {}}>
        <View style={{borderRadius: 6, borderColor: '#D1D1D1', borderWidth: StyleSheet.hairlineWidth, marginBottom: 10, padding: 5, width: '100%'}}>
          {Object.entries(item).map((itemObj, index) => {
            return (
              <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: index === 0 ? '#DCE2FF' : '#FFF', paddingHorizontal: 5, paddingVertical: 3}}>
                <Text style={[styles.itemName]} numberOfLines={1}>
                  {itemObj[0]}
                </Text>
                <Text style={styles.itemDesc} numberOfLines={1}>
                  {itemObj[1]}
                </Text>
              </View>
            );
          })}
          {/* <NkButton
            style={[styles.actionButtons]}
            titleStyle={[NwClass.btnText_default, styles.buttonTextStyle]}
            buttonTitle
            title="View"
            customClick={() => {
              //
            }}
          /> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}} style={{width: '100%', paddingHorizontal: 16}} keyboardShouldPersistTaps="handled"> */}
        {/* <View style={{flex: 1}}> */}
        <View style={{width: '100%'}}>
          <Text style={{fontFamily: 'Poppins-Bold', fontSize: 22, color: '#000', marginTop: 5, marginBottom: 0}}>Service Request Tracker</Text>
        </View>

        <View style={{width: '100%'}}>
          <Text style={styles.inputTitle}>Request Type</Text>
          {/* <NkDropdown
            items={ReqTypes}
            selectedValue={reqType}
            onValueChange={setReqType}
            displayValue={displayReqType}
            setDisplayValue={setDisplayReqType}
            isVisible={reqTypeVisible}
            setVisibility={setReqTypeVisible}
            style={styles.dropdown}
          />
          <Text style={styles.inputTitle}>Request</Text>
          <NkDropdown
            items={Reqs}
            selectedValue={reqs}
            onValueChange={setReqs}
            displayValue={displayReqs}
            setDisplayValue={setDisplayReqs}
            isVisible={reqsVisible}
            setVisibility={setReqsVisible}
            style={styles.dropdown}
          />
          <Text style={styles.inputTitle}>Status</Text>
          <NkDropdown
            items={Status}
            selectedValue={status}
            onValueChange={setStatus}
            displayValue={displayStatus}
            setDisplayValue={setDisplayStatus}
            isVisible={statusVisible}
            setVisibility={setstatusVisible}
            style={styles.dropdown}
          /> */}
        </View>
        <View style={{width: '100%', flexShrink: 1, flex: 1}} onStartShouldSetResponder={() => true}>
          <FlatList
            ref={flatListRef}
            data={renderList}
            renderItem={renderItem}
            keyExtractor={item => item['Request Docno']}
            contentContainerStyles={{flexGrow: 0, height: '100%'}}
            horizontal={false}
            onEndReached={({distanceFromEnd}) => {
              // console.log(distanceFromEnd);
              // if (distanceFromEnd > 0) return;
              setListRefreshing(true);
              loadmoreItems();
            }}
            refreshing={listRefreshing}
          />
        </View>
        {/* </View> */}
        {/* </ScrollView> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dropdown: {
    marginBottom: 5,
  },
  itemName: {
    fontFamily: 'Poppins-Regular',
    color: '#848484',
    fontSize: 15,
  },
  itemDesc: {
    fontFamily: 'Poppins-Bold',
    color: '#000',
    fontSize: 15,
  },
  actionButtons: {
    paddingVertical: 5,
    backgroundColor: '#1974D1',
    borderRadius: 2,
    width: '100%',
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFF',
  },
  inputTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#6D6D6D',
  },
});

export default TransactionHistory;
