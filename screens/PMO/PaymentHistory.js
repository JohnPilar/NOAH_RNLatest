import React, {useState, useContext} from 'react';
import {Text, StyleSheet, Image, TextInput, ScrollView, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useStyles} from '../../functions/Orientation';

import {ThemesContext} from '../../functions/ThemeContext';

const PaymentHistory = props => {
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

  //console.log(fromDate);

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

  // const showMode = currentMode => {
  //   if (Platform.OS === 'android') {
  //     setShow(true);
  //     // for iOS, add a button that closes the picker
  //   }
  // };

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
  //

  const toolbarActions = [
    {
      id: 'action-new',
      title: 'New',
      icon: ToolbarNew,
    },
    {
      id: 'action-refresh',
      title: 'Refresh',
      icon: ToolbarRefresh,
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
        style={{
          width: 74,
          height: 60,
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'white',
          padding: 5,
        }}
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
        <Text
          style={{
            color: 'black',
            fontSize: 12,
            fontWeight: '500',
            marginTop: 5,
            marginBottom: 3,
          }}>
          {item.title}
        </Text>
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
      <TouchableOpacity
        style={{
          width: 80,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: 5,
        }}
        key={item.id}
        onPress={() => {}}>
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
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            elevation: 5,
            shadowColor: '#BBB',
          }}>
          <FlatList horizontal={true} ref={flatListRef} data={toolbarActions} renderItem={renderToolbar} keyExtractor={item => item.id} />
          {/* <View style={styles.horizontalBottomLine}></View> */}
        </View>

        <ScrollView style={{width: '100%'}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
          <View style={styles.detailsContainer}>
            <View style={[styles.panelContainer, styles.panelShadow]}>
              <Text style={styles.infoTitle}>Payment Type</Text>
              <View style={styles.datepickerContainer}>
                <TextInput autoCapitalize={'characters'} placeholderTextColor="#b6becc" returnKeyType="next" focus blurOnSubmit={false} style={[styles.textInputStyle, {flex: 1, marginRight: 20}]} />
                <TextInput autoCapitalize={'characters'} placeholderTextColor="#b6becc" returnKeyType="next" focus blurOnSubmit={false} style={[styles.textInputStyle, {flex: 2}]} />
                <TouchableOpacity
                  disabled={!buttonsEnabled}
                  style={[styles.buttonIconContainer, {opacity: buttonsEnabled ? 1 : 0.2}]}
                  onPress={() => {
                    //
                  }}>
                  <MaterialCommunityIcons style={{padding: 3}} name={'magnify'} size={24} color={'#28396F'} />
                </TouchableOpacity>
              </View>

              <Text style={styles.infoTitle}>Mode of Payment</Text>
              <View style={styles.datepickerContainer}>
                <TextInput autoCapitalize={'characters'} placeholderTextColor="#b6becc" returnKeyType="next" focus blurOnSubmit={false} style={[styles.textInputStyle, {flex: 1, marginRight: 20}]} />
                <TextInput autoCapitalize={'characters'} placeholderTextColor="#b6becc" returnKeyType="next" focus blurOnSubmit={false} style={[styles.textInputStyle, {flex: 2}]} />
                <TouchableOpacity
                  disabled={!buttonsEnabled}
                  style={[styles.buttonIconContainer, {opacity: buttonsEnabled ? 1 : 0.2}]}
                  onPress={() => {
                    //
                  }}>
                  <MaterialCommunityIcons style={{padding: 3}} name={'magnify'} size={24} color={'#28396F'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.panelContainer, styles.panelShadow, {marginTop: 10}]}>
              <Text style={[styles.infoTitle, {marginBottom: 5}]}>Date Filter</Text>
              <View style={styles.datepickerContainer}>
                <Text style={styles.info}>From</Text>
                <TextInput autoCapitalize={'characters'} keyboardType="numeric" placeholderTextColor="#b6becc" returnKeyType="next" value={fromDate.toLocaleDateString()} focus blurOnSubmit={false} style={styles.textInputStyle} />
                <TouchableOpacity disabled={!buttonsEnabled} onPress={showFromDatepicker} style={[styles.buttonIconContainer, {opacity: buttonsEnabled ? 1 : 0.2}]}>
                  <MaterialCommunityIcons style={{padding: 3}} name={'calendar-month'} size={24} color={'#28396F'} />
                </TouchableOpacity>
              </View>

              <View style={styles.datepickerContainer}>
                <Text style={styles.info}>To</Text>
                <TextInput autoCapitalize={'characters'} keyboardType="numeric" placeholderTextColor="#b6becc" returnKeyType="next" value={toDate.toLocaleDateString()} focus blurOnSubmit={false} style={styles.textInputStyle} />
                <TouchableOpacity disabled={!buttonsEnabled} onPress={showToDatepicker} style={[styles.buttonIconContainer, {opacity: buttonsEnabled ? 1 : 0.2}]}>
                  <MaterialCommunityIcons style={{padding: 3}} name={'calendar-month'} size={24} color={'#28396F'} />
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#F0F4F9',
    alignItems: 'center',
  },
  detailsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    width: '100%',
  },
  panelContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 2,
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
    color: '#28396F',
  },
  info: {
    flex: 1,
    fontSize: 17,
    color: '#555',
    marginRight: 10,
  },
  datepickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInputStyle: {
    fontSize: 16,
    flex: 4,
    color: '#555',
    textAlignVertical: 'center',
    paddingBottom: 0,
    paddingTop: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#AAA',
  },
});

export default PaymentHistory;
