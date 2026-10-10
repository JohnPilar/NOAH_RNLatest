import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, Keyboard} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import NmStyles, {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmDropdown, NmButton} from '../../../../components';
import NmColors from '../../../../constants/NmColors';
import {SampleWorkers, NoHandymanData} from '../../../../Global/GlobalVariable';
import {NmHardwareBackPress} from '../../../../functions/NmFunctions';

const HandymanNewBooking = (props: any) => {
  const handyData = props?.route?.params?.handyData;

  const specialtyList = [
    {
      label: 'Home Repair',
      value: 'HMNHRP',
    },
    {
      label: 'Painter',
      value: 'HMNPNT',
    },
    {
      label: 'Flooring & Tile',
      value: 'HMNFLT',
    },
    {
      label: 'Electrician',
      value: 'HMNECE',
    },
    {
      label: 'Plumber',
      value: 'HMNPLB',
    },
    {
      label: 'Carpenter',
      value: 'HMNCRP',
    },
    {
      label: 'Drywall',
      value: 'HMNDRW',
    },
    {
      label: 'HVAC',
      value: 'HMNHVC',
    },
    {
      label: 'Windows',
      value: 'HMCWND',
    },
    {
      label: 'Roofing',
      value: 'HMNRUF',
    },
  ];

  const schedulePlaceholder = 'Select date and time';

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(handyData == undefined ? specialtyList[0].value : handyData.specialtyCode);
  const [selectedHandyman, setSelectedHandyman] = useState<any>(handyData == undefined ? SampleWorkers[0] : handyData);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(schedulePlaceholder);
  const [detailsComplete, setDetailsComplete] = useState<boolean>(false);
  const [initialComplaint, setInitialComplaint] = useState<string>('');

  const imageLength = WINDOW_WIDTH * 0.2;

  NmHardwareBackPress();

  useEffect(() => {
    if (selectedSpecialty != undefined && selectedHandyman.id != 'NO_Handyman' && selectedSchedule != schedulePlaceholder && initialComplaint != '') {
      setDetailsComplete(true);
    } else {
      setDetailsComplete(false);
    }
  }, [selectedSpecialty, selectedHandyman, selectedSchedule, initialComplaint]);

  useEffect(() => {
    let tmpObj = SampleWorkers.filter(item => item.specialtyCode == selectedSpecialty);

    if (tmpObj.length > 0) {
      setSelectedHandyman(tmpObj[0]);
    } else {
      setSelectedHandyman(NoHandymanData);
    }
  }, [selectedSpecialty]);

  useEffect(() => {
    if (props.route.params?.selectedHandyman) {
      setSelectedHandyman(props.route.params?.selectedHandyman);
    }
  }, [props.route.params?.selectedHandyman]);

  useEffect(() => {
    if (props.route.params?.selectedSchedule) {
      setSelectedSchedule(props.route.params?.selectedSchedule);
    }
  }, [props.route.params?.selectedSchedule]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            paddingVertical: 5,
            // borderBottomLeftRadius: 18,
            // borderBottomRightRadius: 18,
            // borderLeftWidth: StyleSheet.hairlineWidth,
            // borderRightWidth: StyleSheet.hairlineWidth,
            // borderBottomWidth: StyleSheet.hairlineWidth,
            // borderColor: '#AAA',
          }}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20}}>{'Create new appointment'}</Text>
        </View>

        <ScrollView style={{width: '100%'}} contentContainerStyle={{flexGrow: 1}}>
          <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 10}}>
            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 0, alignItems: 'center'}}>
              <Text style={styles.componentHeader}>{'Select Specialty'}</Text>
            </View>

            <NmDropdown items={specialtyList} setValue={setSelectedSpecialty} value={selectedSpecialty} containerStyle={{borderRadius: 12, borderColor: '#DDD'}} />

            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.componentHeader}>{'Select your preferred handyman'}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (selectedHandyman.id != 'NO_Handyman') {
                  props.navigation.navigate('HandymanList', {
                    selectedSpecialty: selectedSpecialty,
                    screenOrigin: 'ORIGIN_CREATE',
                  });
                }
              }}
              style={[{width: '100%', borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
              <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12}}>
                <Image source={selectedHandyman.photo} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
              </View>

              <View style={{marginLeft: 10, justifyContent: 'center'}}>
                <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}}>{selectedHandyman.name}</Text>

                {selectedHandyman.id != 'NO_Handyman' && <Text style={{color: '#000', fontFamily: 'Poppins-Medium'}}>{selectedHandyman.specialty}</Text>}
              </View>
            </TouchableOpacity>

            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.componentHeader}>{'Select schedule'}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ScheduleScreen', {
                  originScreen: 'HandymanNewBooking',
                });
              }}
              style={[{width: '100%', height: 45, borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
              {selectedSchedule == schedulePlaceholder ? (
                <View style={{width: '100%', flexDirection: 'row'}}>
                  <Text style={[styles.scheduleText, {paddingLeft: 10, color: '#AAA'}]}>{selectedSchedule}</Text>
                </View>
              ) : (
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={[styles.scheduleText, {paddingLeft: 10}]}>{selectedSchedule.date}</Text>
                  <Text style={[styles.scheduleText, {paddingRight: 10}]}>{selectedSchedule.time}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.componentHeader}>{'Insert or tell your current issue'}</Text>
            </View>

            <View style={[{flex: 1, width: '100%', minHeight: 45, borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
              <TextInput
                style={[NmStyles.textInput]}
                value={initialComplaint}
                onChangeText={value => {
                  setInitialComplaint(value);
                }}
              />
            </View>
          </View>
        </ScrollView>

        <View style={{width: '100%', paddingHorizontal: 16, paddingVertical: 10}}>
          <NmButton
            buttonTheme={'dark'}
            disabled={!detailsComplete}
            style={[{backgroundColor: detailsComplete ? NmColors.buttonDark : NmColors.buttonDisabled, borderRadius: 12}]}
            titleStyle={{}}
            title="Book an appointment"
            onPress={() => {
              const appointmentObject = {
                name: selectedHandyman.name,
                photo: selectedHandyman.photo,
                specialty: selectedHandyman.specialty,
                type: 'UPCOMING',
                date: selectedSchedule.date,
                time: selectedSchedule.time,
              };

              EventRegister.emit('updateHandymanServices', appointmentObject);

              props.navigation.goBack();
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  componentHeader: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  scheduleText: {
    marginTop: 2,
    padding: 0,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
  },
});

export default HandymanNewBooking;
