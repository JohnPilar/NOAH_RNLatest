import React, {useState, useContext} from 'react';
import {Text, StyleSheet, Image, TextInput, Button, ScrollView, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, FlatList} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useStyles} from '../../functions/Orientation';

import {ThemesContext} from '../../functions/ThemeContext';

const RequestEntry = props => {
  const NwClass = useStyles();
  const {theme} = useContext(ThemesContext);
  const flatListRef = React.useRef();

  const [payTypeCode, setPayTypeCode] = useState();
  const [payTypeDesc, setPayTypeDesc] = useState();

  const [payModeCode, setPayModeCode] = useState();
  const [payModeDesc, setPayModeDesc] = useState();

  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  //
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const [remarks, setRemarks] = useState();

  const fromDateOnChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowFrom(false);
    setFromDate(currentDate);
  };

  const toDateOnChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowTo(false);
    setToDate(currentDate);
  };

  const showFromDatepicker = () => {
    if (Platform.OS === 'android') {
      setShowFrom(true);
      // for iOS, add a button that closes the picker
    }
  };

  const showToDatepicker = () => {
    if (Platform.OS === 'android') {
      setShowTo(true);
      // for iOS, add a button that closes the picker
    }
  };

  // TEMPORARY DATA SOURCE FOR DROPDOWN LIST
  let MobRToken;

  const [propertyType, setPropertyType] = useState(PropertyType[0].value);
  const [customerType, setCustomerType] = useState(CustomerType[0].value);
  //

  const toolbarActions = [
    {
      id: 'action-new',
      title: 'New',
      icon: ToolbarNew,
    },
    {
      id: 'action-save',
      title: 'Save',
      icon: ToolbarSave,
    },
    {
      id: 'action-delete',
      title: 'Delete',
      icon: ToolbarDelete,
    },
    {
      id: 'action-inquire',
      title: 'Inquire',
      icon: ToolbarInquire,
    },
    {
      id: 'action-process',
      title: 'Process',
      icon: ToolbarProcess,
    },
  ];

  const panelItems = [
    {
      id: 'panel-main',
      title: 'Main',
      icon: 'file-document-outline',
    },
    {
      id: 'panel-linedetails',
      title: 'Line Details',
      icon: 'table',
    },
  ];

  const renderToolbar = ({item}) => {
    return (
      <TouchableOpacity
        style={{width: 74, height: 60, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'white', padding: 5}}
        key={item.id}
        onPress={() => {
          initiateAction(item.id);
        }}>
        <Image
          source={item.icon}
          style={{
            resizeMode: 'cover',
            width: 20,
            height: 20,
          }}
        />
        <Text style={{color: 'black', fontSize: 12, fontWeight: '500', marginTop: 5, marginBottom: 3}}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const initiateAction = actionType => {
    switch (actionType) {
      case 'action-new':
        setButtonsEnabled(true);
        break;

      case 'action-refresh':
        setButtonsEnabled(false);
        break;
    }
  };

  const renderPanel = ({item}) => {
    return (
      <TouchableOpacity style={{width: 80, height: 60, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 5}} key={item.id} onPress={() => {}}>
        <MaterialCommunityIcons name={item.icon} size={24} color={'#62618C'} />
        <Image source={item.icon} />
        <Text numberOfLines={1} style={{color: 'black', fontSize: 12, marginTop: 5}}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={{width: '100%', backgroundColor: 'white', elevation: 5, shadowColor: '#BBB'}}>
          <FlatList horizontal={true} ref={flatListRef} data={toolbarActions} renderItem={renderToolbar} keyExtractor={item => item.id} />
          {/* <View style={styles.horizontalBottomLine}></View> */}
        </View>

        <ScrollView style={{width: '100%'}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
          <View style={styles.detailsContainer} onStartShouldSetResponder={() => true}>
            <View style={[styles.panelContainer, styles.panelShadow]}>
              <Text style={[styles.infoTitle, {marginBottom: 10}]}>Transaction/Type of Activity</Text>
              {/* <NkPicker
                pickerLabel="Select..."
                items={PropertyType}
                selectedValue={propertyType}
                onValueChange={(itemValue, itemIndex) => setPropertyType(PropertyType[itemIndex].value)}
                style={{height: 40, borderColor: '#AAA', borderWidth: StyleSheet.hairlineWidth, marginBottom: 15}}
              /> */}
              <Text style={styles.infoTitle}>Account No.</Text>
              <Text style={styles.info}>STC00043</Text>
              <Text style={styles.infoTitle}>Location</Text>
              <Text style={styles.info}>STC</Text>
              <Text style={styles.infoTitle}>Unit No.</Text>
              <Text style={styles.info}>Noah-Tower1-10H</Text>
              <Text style={[styles.infoTitle, {marginBottom: 10}]}>
                Request<Text style={styles.required}> *</Text>
              </Text>
              {/* <NkPicker
                pickerLabel="Select..."
                items={PropertyType}
                selectedValue={propertyType}
                onValueChange={(itemValue, itemIndex) => setPropertyType(PropertyType[itemIndex].value)}
                style={{height: 40, borderColor: '#AAA', borderWidth: StyleSheet.hairlineWidth, marginBottom: 10}}
              /> */}
              <Text style={styles.infoTitle}>Proposed Date</Text>
              <Text style={styles.info}>6/15/2023 12:00:00 AM</Text>
            </View>

            <View style={[styles.panelContainer, styles.panelShadow]}>
              <Text style={styles.infoTitle}>Transaction No.</Text>
              <Text style={styles.info}>STC-REQAME-00000041</Text>
              <Text style={styles.infoTitle}>Transaction Date</Text>
              <Text style={styles.info}>6/15/2023 12:00:00 AM</Text>
              <Text style={styles.infoTitle}>Date Submitted</Text>
              <Text style={styles.info}>6/15/2023 9:43:00 AM</Text>
              <Text style={styles.infoTitle}>Date Posted</Text>
              <Text style={styles.info}>6/15/2023 9:43:04 AM</Text>
              <Text style={styles.infoTitle}>
                Remarks <Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={[styles.textInputStyle, {textAlignVertical: 'top'}]}
                  placeholderTextColor="#b6becc"
                  multiline
                  numberOfLines={4}
                  returnKeyType="next"
                  value={remarks}
                  onChangeText={value => setRemarks(value)}
                  focus
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={[styles.panelContainer, styles.panelShadow]}>
              <Text style={styles.infoTitle}>Basis for Billing</Text>
              <Text style={styles.info}>Hourly</Text>
              <Text style={styles.infoTitle}>No. of Consumption</Text>
              <Text style={styles.info}>2.00</Text>
              <Text style={styles.infoTitle}>Cost per Unit/SQM/Consumption</Text>
              <Text style={styles.info}>5,000.00</Text>
              <Text style={styles.infoTitle}>Amount</Text>
              <Text style={styles.info}>10,000.00</Text>
              <Text style={styles.infoTitle}>VAT Amount</Text>
              <Text style={styles.info}>0.00</Text>
              <Text style={styles.infoTitle}>EWT Amount</Text>
              <Text style={styles.info}>0.00</Text>
              <Text style={styles.infoTitle}>NET Amount</Text>
              <Text style={styles.info}>10,000.00</Text>
            </View>

            <View style={[styles.panelContainer, styles.panelShadow]}>
              <Text style={styles.infoTitle}>Document Status</Text>
              <Text style={styles.info}>Approved</Text>
              <Text style={styles.infoTitle}>Reason for Disapproval</Text>
              <Text style={styles.info}>Reason for Disapproval Goes here</Text>
              <Text style={styles.infoTitle}>Remarks for Disapproval</Text>
              <Text style={styles.info}>Remarks for Disapproval goes here</Text>

              {/* <NkButton
                style={[NwClass.btn_default, styles.actionButtons, {backgroundColor: '#3885d2'}]}
                titleStyle={[NwClass.btnText_default, styles.selectFile]}
                buttonTitle
                title="Review Attachment"
                customClick={() => {}}
              />

              <NkButton
                style={[NwClass.btn_default, styles.actionButtons]}
                titleStyle={[NwClass.btnText_default, styles.selectFile]}
                buttonTitle
                title="Requirements Compliance"
                customClick={() => {}}
              /> */}

              <View></View>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#F0F4F9',
    backgroundColor: '#f1f2f6',
    alignItems: 'center',
  },
  detailsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    //paddingTop: 5,
    width: '100%',
  },
  panelContainer: {
    marginVertical: 5,
    paddingVertical: 15,
    paddingBottom: 5,
    paddingHorizontal: 18,
    borderRadius: 5,
    justifyContent: 'center',
    //backgroundColor: '#2ca5b111',
    backgroundColor: '#FDFDFD',
    //borderWidth: StyleSheet.hairlineWidth,
    //borderColor: '#2474c2',
  },
  panelShadow: {
    elevation: 5,
    shadowColor: '#BBB',
  },
  groupHeader: {
    color: '#06214D',
    marginBottom: 10,
    fontWeight: '600',
    fontSize: 20,
  },
  horizontalBottomLine: {
    borderBorderColor: '#AAA',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  horizontalTopLine: {
    borderTopColor: '#AAA',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  buttonIconContainer: {
    marginLeft: 10,
    backgroundColor: '#EEE',
    borderRadius: 5,
  },
  buttonIcon: {},
  infoTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  info: {
    flex: 1,
    fontSize: 17,
    color: '#506abd',
    marginBottom: 15,
  },
  textInputContainer: {
    padding: 2,
    borderColor: '#AAA',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 15,
    borderRadius: 10,
  },
  datepickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInputStyle: {
    maxHeight: 84,
    fontSize: 16,
    flex: 4,
    color: '#555',
    paddingBottom: 0,
    paddingTop: 0,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#AAA',
  },
  required: {
    color: 'red',
  },
  actionButtons: {
    height: 40,
    width: '100%',
    marginBottom: 15,
    //backgroundColor: '#205295',
    backgroundColor: '#F4A74B',
  },
});

export default RequestEntry;
