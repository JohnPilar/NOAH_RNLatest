import React, {useContext, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {NmLabel, NmDateModal} from '../components';
import {NmButton, NmCheckbox, NmRadiobutton, NmLookup, NmTextInput, NmDropdown, NmFilePicker, NmAddToList, NmSideAlert, NmToolbar, NmTabs, NmModalRemarks} from '../components';

import {NmGetDate} from '../functions/NmFunctions';
import {LookUpListOne, LookUpListTwo, LookUpListThree} from '../Global/GlobalVariable';
import {NmStyles} from '../constants';
import {ThemesContext} from '../functions/ThemeContext';
var XDate = require('xdate');

const DemoScreen = props => {
  const [textboxValue, setTextboxValue] = useState();
  const [leftCheckboxValue, setLeftCheckboxValue] = useState(false);
  const [rightCheckboxValue, setRightCheckboxValue] = useState(false);
  const [remarksVisible, setRemarksVisible] = useState(false);
  const [remarks, setRemarks] = useState('');

  const initialValue = 'Value Letter D';
  const [dropdownValue, setDropdownValue] = useState(initialValue);

  const [radiobuttonValue, setRadiobuttonValue] = useState();
  const [fileName, setFileName] = useState('File Picker here');
  const [fileDir, setFileDir] = useState();

  const [lookupDefaultVal, setLookupDefaultVal] = useState();
  const [lookupCodeVal, setLookupCodeVal] = useState();
  const [lookupDesctVal, setLookupDescVal] = useState();
  const [lookupNumCols, setLookupNumCols] = useState();
  const [sideAlert, setSideAlert] = useState(false);

  const sampleLookupDataOne = LookUpListOne;
  const sampleLookupDataTwo = LookUpListTwo;
  const sampleLookupDataThree = LookUpListThree;

  const [fromDate, setFromDate] = useState(new XDate());
  const [tbText, setTbText] = useState('');

  const {darkTheme, setDarkTheme, theme} = useContext(ThemesContext);

  const canvasRef = canvas => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);
    ctx.save();
  };

  const SampleItemList = [
    {
      label: 'Success',
      value: 'TYPE_SUCCESS',
    },
    {
      label: 'Information',
      value: 'TYPE_INFO',
    },
    {
      label: 'Warning',
      value: 'TYPE_WARN',
    },
    {
      label: 'Error',
      value: 'TYPE_ERROR',
    },
  ];

  const addToListParamsOne = [
    {
      tabName: 'Home',
      queryID: '',
      listColumnID: 'code',
      listColumnName: 'description',
      paramName: '',
    },
    {
      tabName: 'About',
      queryID: '',
      listColumnID: 'code',
      listColumnName: 'description',
      paramName: '',
    },
    {
      tabName: 'Help',
      queryID: '',
      listColumnID: 'code',
      listColumnName: 'description',
      paramName: '',
    },
    {
      tabName: 'Example',
      queryID: '',
      listColumnID: 'code',
      listColumnName: 'description',
      paramName: '',
    },
  ];

  const addToListParamsTwo = [
    {
      tabName: 'Custom Desc 1',
      queryID: '',
      listColumnID: '',
      listColumnName: 'column Three',
      paramName: '',
    },
    {
      tabName: 'Custom Desc 2',
      queryID: '',
      listColumnID: '',
      listColumnName: 'Description',
      paramName: '',
    },
    {
      tabName: 'Custom Desc 3',
      queryID: '',
      listColumnID: '',
      listColumnName: 'description',
      paramName: '',
    },
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.statusBar}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <NmToolbar
          containerStyle={{paddingHorizontal: 2}}
          onPress={btnId => {
            setTbText('Pressed: ' + btnId);
          }}
          disableList={['TB_DELETE', 'TB_UPDATE', 'TB_SAVE']}
          hideList={['TB_EXPORT', 'TB_PRINT']}
          customList={[{id: 'TB_CUSTOM', title: 'Custom', icon: require('../assets/Icons/setting_biometric.png'), disabled: false, hidden: false}]}
        />
        <View style={[styles.container, {backgroundColor: theme.screenBackground}]}>
          <NmLabel>{'NOAH Label/Text: ' + tbText}</NmLabel>
          <NmButton
            title={'Switch Light/Dark Theme'}
            titleStyle={{color: 'white', fontFamily: 'Poppins-Regular'}}
            style={{marginBottom: 20}}
            onPress={() => {
              setDarkTheme(!darkTheme);
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH TextInput'}</NmLabel>
          <NmTextInput containerStyle={{marginBottom: 20}} value={textboxValue} onChangeText={value => setTextboxValue(value)} placeholder="Noah Textbox/Textinput sample" />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Button'}</NmLabel>
          <NmButton
            title={'View NOAH Table'}
            titleStyle={{color: 'white', fontFamily: 'Poppins-Regular'}}
            style={{marginBottom: 20}}
            onPress={() => {
              props.navigation.navigate('TestScreen', {
                dropdownValue: dropdownValue,
                radiobuttonValue: radiobuttonValue,
              });
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Dropdown'}</NmLabel>
          <NmDropdown items={SampleItemList} setValue={setDropdownValue} value={dropdownValue} containerStyle={{marginBottom: 20}} />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Date Picker'}</NmLabel>
          <NmDateModal
            setDateValue={date => {
              setFromDate(new XDate(NmGetDate(date, 'dashYMD')));
            }}
            dateValue={fromDate}
            style={{marginBottom: 20}}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Date Picker (Device default mode)'}</NmLabel>
          <NmDateModal setDateValue={setFromDate} dateValue={fromDate} style={{marginBottom: 20}} pickerMode={'DEVICE'} />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Lookup (Code/Description)'}</NmLabel>
          <NmLookup
            demoMode={true}
            containerStyle={{marginBottom: 20}}
            value={lookupDefaultVal}
            sampleData={sampleLookupDataOne}
            setValue={val => {
              setLookupDefaultVal({code: val.code, description: val.description});
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Lookup (Single - Code Only)'}</NmLabel>
          <NmLookup
            demoMode={true}
            containerStyle={{marginBottom: 20}}
            singleType={'codeval'}
            //addToList={true}
            sampleData={sampleLookupDataTwo}
            value={lookupCodeVal}
            setValue={val => {
              setLookupCodeVal({code: val.code, description: val.description});
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Lookup (Single - Description Only)'}</NmLabel>
          <NmLookup
            demoMode={true}
            containerStyle={{marginBottom: 20}}
            singleType={'descval'}
            sampleData={sampleLookupDataThree}
            value={lookupDesctVal}
            setValue={val => {
              setLookupDescVal({code: val.code, description: val.description});
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Lookup - With Hidden Columns'}</NmLabel>
          <NmLookup
            demoMode={true}
            containerStyle={{marginBottom: 20}}
            hideCols={['code', 'description', 'column four']}
            showExpand={true}
            sampleData={sampleLookupDataThree}
            value={lookupNumCols}
            setValue={val => {
              setLookupNumCols({code: val.code, description: val.description});
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Add to List'}</NmLabel>
          <NmAddToList
            demoMode={true}
            containerStyle={{marginBottom: 20}}
            sampleData={[sampleLookupDataOne, sampleLookupDataTwo, sampleLookupDataThree]}
            componentData={addToListParamsOne}
            getValue={val => {
              //Output contains object filter array based on the order of the headers
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Add to List: Custom Column Description'}</NmLabel>
          <NmAddToList
            demoMode={true}
            containerStyle={{marginBottom: 20}}
            sampleData={[sampleLookupDataThree, sampleLookupDataTwo, sampleLookupDataOne]}
            componentData={addToListParamsTwo}
            customDescColumn={['column Three']} //column name is case sensitive; use undefined value to skip header; place custom columns the same order as the headers
            getValue={val => {
              //Output contains object filter array based on the order of the headers
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH File Picker: Different from Image Picker due to iOS File picker system'}</NmLabel>
          <NmFilePicker fileUploadContainerStyle={{marginBottom: 20}} NmSetFile={setFileDir} NmSetFileName={setFileName} NmFileName={fileName} />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Checkbox'}</NmLabel>
          <NmCheckbox value={leftCheckboxValue} onValueChange={setLeftCheckboxValue} label="Left Label Checkbox" labelPlacement="LEFT" style={{marginBottom: 20}} />
          <NmCheckbox value={rightCheckboxValue} onValueChange={setRightCheckboxValue} label="Right Label Checkbox" labelPlacement="RIGHT" style={{marginBottom: 20}} checkboxStyle={{}} />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH RadioButton'}</NmLabel>
          <NmRadiobutton items={SampleItemList} setRadiobuttonValue={setRadiobuttonValue} containerStyle={{marginBottom: 20}} />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Side Alert'}</NmLabel>
          <NmButton
            title={'Show Alert'}
            titleStyle={{color: 'white', fontFamily: 'Poppins-Regular'}}
            style={{marginBottom: 20}}
            onPress={() => {
              setSideAlert(true);
            }}
          />

          {/* TabView: Custom View to handle tab components (Just a basic view) */}
          <NmTabs
            tabHeaders={['Pay Now', 'Contact Us', 'More Info']}
            tabChildren={[
              <>
                <NmLabel>{'This is tab one'}</NmLabel>
              </>,
              <>
                <NmLabel>{'This is tab two with some additional content'}</NmLabel>
                <NmLabel>{'Two labels at once'}</NmLabel>
              </>,
              <>
                <NmLabel>{'This one has a custom button inside'}</NmLabel>
                <NmButton title={'Button inside tab'} titleStyle={{color: 'white', fontFamily: 'Poppins-Regular'}} style={{marginBottom: 20}} onPress={() => {}} />
              </>,
            ]}
          />

          <NmLabel style={[NmStyles.poppinsBold, {marginTop: 10}]}>{'NOAH Lookup - Paginated'}</NmLabel>
          <NmLookup
            containerStyle={{marginBottom: 20}}
            showExpand={true}
            paginated={true}
            numPerPage={5}
            sampleData={sampleLookupDataTwo}
            value={lookupCodeVal}
            setValue={val => {
              setLookupCodeVal({code: val.code, description: val.description});
            }}
          />

          <NmLabel style={[NmStyles.poppinsBold]}>{'NOAH Remarks Window'}</NmLabel>
          <NmButton
            title={'Show Remarks Window'}
            titleStyle={{color: 'white', fontFamily: 'Poppins-Regular'}}
            style={{marginBottom: 20}}
            onPress={() => {
              setRemarksVisible(true);
            }}
          />
          <NmModalRemarks visible={remarksVisible} setVisible={setRemarksVisible} textValue={remarks} setTextValue={setRemarks} />

          {/* <NmButton
            title={'Change Icon to NOAH'}
            titleStyle={{color: 'white', fontFamily: 'Poppins-Regular'}}
            style={{
              backgroundColor: '#2E7FF9',
              borderRadius: 6,
              height: 40,
              marginBottom: 20,
            }}
            onPress={() => {
              //resetIcon();
            }}
          />

          <NmButton
            title={'Change Icon to FPMC'}
            titleStyle={{color: 'white', fontFamily: 'Poppins-Regular'}}
            style={{backgroundColor: '#2E7FF9', borderRadius: 6, height: 40}}
            onPress={() => {
              //changeIcon('FPMC');
            }}
          /> */}

          {/* <Canvas ref={canvasRef} /> */}
        </View>
      </ScrollView>
      <NmSideAlert visible={sideAlert} setVisible={setSideAlert} alertType={radiobuttonValue?.value} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
});

export default DemoScreen;
