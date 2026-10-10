import React, {useState, useContext} from 'react';
import {Text, StyleSheet, Image, TextInput, ScrollView, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, FlatList} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useStyles} from '../../functions/Orientation';

import {ThemesContext} from '../../functions/ThemeContext';

const OtherRequests = props => {
  const NwClass = useStyles();
  const {theme} = useContext(ThemesContext);
  const flatListRef = React.useRef();

  const [activeDetail, setActiveDetail] = useState(0);

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
              <View style={styles.remarksInputContainer}>
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
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {/* <NkButton
                  style={[NwClass.btn_default, styles.actionButtonsSmall, {backgroundColor: '#3885d2'}]}
                  titleStyle={[NwClass.btnText_default, styles.selectFile]}
                  buttonTitle
                  title="Gate Pass"
                  customClick={() => {
                    setActiveDetail(1);
                  }}
                />
                <NkButton
                  style={[NwClass.btn_default, styles.actionButtonsSmall, {backgroundColor: '#3885d2'}]}
                  titleStyle={[NwClass.btnText_default, styles.selectFile]}
                  buttonTitle
                  title="Move In"
                  customClick={() => {
                    setActiveDetail(2);
                  }}
                />
                <NkButton
                  style={[NwClass.btn_default, styles.actionButtonsSmall, {backgroundColor: '#3885d2'}]}
                  titleStyle={[NwClass.btnText_default, styles.selectFile]}
                  buttonTitle
                  title="Move Out"
                  customClick={() => {
                    setActiveDetail(3);
                  }}
                /> */}
              </View>

              {activeDetail === 3 && (
                <View>
                  <View style={[styles.horizontalTopLine, {marginBottom: 10}]}></View>
                  <Text style={styles.infoTitle}>Tenant Full Name</Text>
                  <View style={styles.dataInputContainer}>
                    <TextInput
                      style={[styles.textInputStyle, {textAlignVertical: 'top'}]}
                      placeholderTextColor="#b6becc"
                      returnKeyType="next"
                      value={'Jet Lee'}
                      //onChangeText={value => setRemarks(value)}
                      focus
                      blurOnSubmit={false}
                    />
                  </View>
                  <Text style={styles.infoTitle}>Move Out Date</Text>
                  <Text style={styles.info}>6/30/2023 12:00:00 AM</Text>
                  {/* --convert to datepicker */}
                </View>
              )}
              {activeDetail === 2 && (
                <View style={{width: '100%'}}>
                  <View style={[styles.horizontalTopLine, {marginBottom: 10}]}></View>
                  <Text style={styles.infoTitle}>Tenant Full Name</Text>
                  <View style={styles.dataInputContainer}>
                    <TextInput
                      style={[styles.textInputStyle, {textAlignVertical: 'top'}]}
                      placeholderTextColor="#b6becc"
                      returnKeyType="next"
                      value={'Jet Li'}
                      //onChangeText={value => setRemarks(value)}
                      focus
                      blurOnSubmit={false}
                    />
                  </View>
                  <Text style={styles.infoTitle}>Move Out Date</Text>
                  <Text style={styles.info}>6/30/2023 12:00:00 AM</Text>
                  <Text style={[styles.infoTitle, {marginBottom: 10}]}>Unit Type</Text>
                  {/* <NkPicker
                    pickerLabel="Select..."
                    items={PropertyType}
                    selectedValue={propertyType}
                    onValueChange={(itemValue, itemIndex) => setPropertyType(PropertyType[itemIndex].value)}
                    style={{height: 40, borderColor: '#AAA', borderWidth: StyleSheet.hairlineWidth, marginBottom: 15}}
                  /> */}
                  <Text style={styles.infoTitle}>Requirements</Text>
                  <View style={{marginBottom: 10}}>
                    {/* <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Pay All Accountabilities'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Submit Notarized Copy of the Lease'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Submit Resident Information Sheet for Tenants'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Orientation of House Rules & Regulations'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Updated Information Sheet of Unit Owner/s or SPA'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Ensure to have Fire Extinguisher/s in the Unit'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Checked Sprinkler Heads and Smoke Detector by OIC'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Others: Photocopy of Tenant/s I.D. (Government Issued), Foreigners: Photocopy of Passport'}
                    /> */}
                  </View>
                  {/* checkbox */}
                  <Text style={styles.infoTitle}>Tenant Authority to Sign</Text>
                  <View style={{marginBottom: 10}}>
                    {/* <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Work Permit'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Amenities Room Reservation'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Concern Slip'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Gate Pass for INCOMING Items Only'}
                    /> */}
                  </View>
                  {/* checkbox */}
                  <Text style={styles.infoTitle}>Charge to the Tenant Account</Text>
                  <View style={{marginBottom: 10}}>
                    {/* <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Association Dues'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Parking Dues'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Water'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Electricity'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Amenities'}
                    />
                    <NkCheckbox
                      value={false}
                      style={styles.checkboxViewStyle}
                      //onValueChange={setIsDarkTheme}
                      rightLabelStyle={styles.checkboxFontStyle}
                      labelRight={'Violation Ticket'}
                    /> */}
                  </View>
                  {/* --convert to datepicker */}
                </View>
              )}
              {activeDetail === 1 && (
                <View>
                  <View style={[styles.horizontalTopLine, {marginBottom: 10}]}></View>
                  <Text style={[styles.infoTitle, {marginBottom: 10}]}>Delivery</Text>
                  {/* <NkPicker
                    pickerLabel="Select..."
                    items={PropertyType}
                    selectedValue={propertyType}
                    onValueChange={(itemValue, itemIndex) => setPropertyType(PropertyType[itemIndex].value)}
                    style={{height: 40, borderColor: '#AAA', borderWidth: StyleSheet.hairlineWidth, marginBottom: 15}}
                  /> */}
                  <Text style={styles.infoTitle}>Delivery Date</Text>
                  <Text style={styles.info}>6/30/2023 12:00:00 AM</Text>
                  <Text style={styles.infoTitle}>Delivery Time</Text>
                  <Text style={styles.info}>12:00:00 AM</Text>
                  <Text style={styles.infoTitle}>Carrier</Text>
                  <View style={styles.dataInputContainer}>
                    <TextInput
                      style={[styles.textInputStyle, {textAlignVertical: 'top'}]}
                      placeholderTextColor="#b6becc"
                      returnKeyType="next"
                      value={'LBC?'}
                      //onChangeText={value => setRemarks(value)}
                      focus
                      blurOnSubmit={false}
                    />
                  </View>
                  {/* --convert to datepicker */}
                </View>
              )}
            </View>

            <View style={[styles.panelContainer, styles.panelShadow]}>
              <Text style={styles.infoTitle}>Document Status</Text>
              <Text style={styles.info}>Approved</Text>
              <Text style={styles.infoTitle}>Reason for Disapproval</Text>
              <Text style={styles.info}>Reason for Disapproval Goes here wherareas this should be four lines long which could make the reasoning a bit more longer</Text>
              <Text style={styles.infoTitle}>Remarks for Disapproval</Text>
              <Text style={styles.info}>Remarks for Disapproval goes here which is this should be two lines longer</Text>

              {/* <NkButton
                style={[NwClass.btn_default, styles.actionButtons, {backgroundColor: '#3885d2', marginTop: 20}]}
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
  checkboxViewStyle: {
    marginVertical: 5,
  },
  checkboxFontStyle: {
    lineHeight: 20,
    marginLeft: 5,
    flex: 1,
    flexWrap: 'wrap',
  },
  remarksInputContainer: {
    padding: 2,
    borderColor: '#AAA',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 15,
    borderRadius: 10,
  },
  dataInputContainer: {
    borderBottomColor: '#AAA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 5,
    marginBottom: 10,
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
  actionButtonsSmall: {
    height: 40,
    marginBottom: 15,
    //backgroundColor: '#205295',
    backgroundColor: '#F4A74B',
  },
});

export default OtherRequests;
