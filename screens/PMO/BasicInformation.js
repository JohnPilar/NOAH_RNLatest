import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  ScrollView,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import {List} from 'react-native-paper';

const BasicInformation = props => {
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);

  const [profilePicture, setProfilePicture] = useState('...');

  const [customerName, setCustomerName] = useState('John Nicole Pilar');
  const [customerMobile, setCustomerMobile] = useState('0999 123 123');
  const [customerEmail, setCustomerEmail] = useState('jpilar@fpti.com.ph');
  const [customerPhone, setCustomerPhone] = useState('123-456-789');

  const [accountNo, setAccountNo] = useState('STC00043');
  const [accountStatus, setAccountStatus] = useState('Active');

  const [unitCode, setUnitCode] = useState('Noah-Tower1-20H');
  const [unitDescription, setUnitDescription] = useState('Noah Tower Room 20');
  const [inventoryType, setInventoryType] = useState('INV_TYPE');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={{width: '100%'}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
        <List.Section title="Accordions">
          <List.Accordion title="Uncontrolled Accordion" left={props => <List.Icon {...props} icon="folder" />}>
            <List.Item title="First item" />
            <List.Item title="Second item" />
          </List.Accordion>

          <List.Accordion title="Controlled Accordion" left={props => <List.Icon {...props} icon="folder" />} expanded={expanded} onPress={handlePress}>
            <List.Item title="First item" />
            <List.Item title="Second item" />
          </List.Accordion>
        </List.Section>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F4F9',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  detailsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    width: '100%',
  },
  panelContainer: {
    paddingHorizontal: 14,
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
  horizontalLine: {
    borderBottomColor: '#AAA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#28396F',
  },
  info: {
    fontSize: 17,
    color: 'black',
    marginBottom: 10,
  },
});

export default BasicInformation;
