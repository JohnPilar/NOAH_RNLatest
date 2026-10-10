import React, {useState, useRef} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard} from 'react-native';

import {NmGetDate, NmHardwareBackPress} from '../../functions/NmFunctions';

const BillingHistory = props => {
  NmHardwareBackPress(() => {
    props.navigation.navigate('Home');
    return true;
  });

  const billStatus = [
    {label: 'Select All', value: 0},
    {label: 'Paid', value: 1},
    {label: 'Unpaid', value: 2},
  ];

  //--------------------------------------------------------

  const nowDate = new Date();
  let nowDateString = nowDate.getMonth() + 1 + '/' + nowDate.getDate() + '/' + nowDate.getFullYear();
  nowDateString = NmGetDate(nowDateString, 'slashMDY');

  const [fromDate, setFromDate] = useState(nowDateString);
  const [fromDateVisible, setFromDateVisible] = useState(false);

  const [toDate, setToDate] = useState(nowDateString);
  const [toDateVisible, setToDateVisible] = useState(false);

  const [listRefreshing, setListRefreshing] = useState(false);
  const flatListRef = useRef();

  const [status, setStatus] = useState(billStatus[0].value);
  const [statusVisible, setstatusVisible] = useState(false);
  const [displayStatus, setDisplayStatus] = useState(billStatus[0].label);

  const [itemList, setItemList] = useState();

  const loadmoreItems = () => {
    let newStart = sliceEnd;
    let newEnd = sliceEnd + 5;

    setSliceStart(newStart);
    setSliceEnd(newEnd);
    setRenderList([...renderList, ...allList.slice(newStart, newEnd)]);

    setListRefreshing(false);
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
            titleStyle={[styles.buttonTextStyle]}
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
          <Text style={{fontFamily: 'Poppins-Bold', fontSize: 22, color: '#000', marginTop: 5, marginBottom: 0}}>Billing History</Text>
          <Text style={{fontFamily: 'Poppins-Bold', fontSize: 13, color: '#6D6D6D', marginBottom: 5}}>Date Filter</Text>
        </View>

        <View style={{width: '100%'}}>
          {/* <Text style={styles.inputTitle}>From</Text>
          <NkModernDatePicker onValueChange={setFromDate} selectedValue={fromDate} modalVisible={fromDateVisible} setModalVisible={setFromDateVisible} style={{marginBottom: 10}} />
          <Text style={styles.inputTitle}>To</Text>
          <NkModernDatePicker onValueChange={setToDate} selectedValue={toDate} modalVisible={toDateVisible} setModalVisible={setToDateVisible} style={{marginBottom: 10}} />
          <Text style={styles.inputTitle}>Status</Text> */}
          {/* <NkDropdown
            items={billStatus}
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
          {/* <FlatList
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
          /> */}
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

export default BillingHistory;
