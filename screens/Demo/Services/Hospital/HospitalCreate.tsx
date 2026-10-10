import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, Keyboard} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import NmStyles, {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmDropdown, NmButton} from '../../../../components';
import NmColors from '../../../../constants/NmColors';
import {AppointmentContext} from '../../../../functions/Contexts';
import {SampleTopDoctorsList, NoDoctorData} from '../../../../Global/GlobalVariable';

interface DoctorData {
  id: number | string;
  name: string;
  photo: any;
  specialty: string;
  specialtyCode: string;
}

interface ScheduleData {
  date: string;
  time: string;
}

interface HospitalCreateProps {
  route: {
    params?: {
      doctorData?: DoctorData;
      selectedDoctor?: DoctorData;
      selectedSchedule?: ScheduleData;
    };
  };
  navigation: any;
}

const HospitalCreate = (props: HospitalCreateProps): React.JSX.Element => {
  const appointContext = useContext(AppointmentContext);
  const doctorData = props?.route?.params?.doctorData;

  const SampleTopDoctors = SampleTopDoctorsList;
  const specialtyList = [
    {
      label: 'General Medicine',
      value: 'GENMED',
    },
    {
      label: 'Psychiatrist',
      value: 'PEDXIN',
    },
    {
      label: 'Pediatrician',
      value: 'PEDIAC',
    },
    {
      label: 'Neurologist',
      value: 'NEUROL',
    },
    {
      label: 'Psychiatrist',
      value: 'PSYCHI',
    },
    {
      label: 'Cardiologist',
      value: 'CARDIO',
    },
  ];

  const schedulePlaceholder = 'Select date and time';
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(doctorData == undefined ? specialtyList[0].value : doctorData.specialtyCode);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData>(doctorData ? doctorData : SampleTopDoctors[0]);
  const [selectedSchedule, setSelectedSchedule] = useState<string | ScheduleData>(schedulePlaceholder);
  const [detailsComplete, setDetailsComplete] = useState<boolean>(false);
  const [initialComplaint, setInitialComplaint] = useState<string>('');

  const imageLength = WINDOW_WIDTH * 0.2;

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
  //     props.navigation.goBack();
  //     return true;
  //   });
  //   return () => backHandler.remove();
  // }, []);

  useEffect(() => {
    if (selectedSpecialty != undefined && selectedDoctor.id != 'NO_DOCTORS' && selectedSchedule != schedulePlaceholder && initialComplaint != '') {
      setDetailsComplete(true);
    } else {
      setDetailsComplete(false);
    }
  }, [selectedSpecialty, selectedDoctor, selectedSchedule, initialComplaint]);

  useEffect(() => {
    let tmpObj = SampleTopDoctors.filter(item => item.specialtyCode == selectedSpecialty);

    if (tmpObj.length > 0) {
      setSelectedDoctor(tmpObj[0]);
    } else {
      setSelectedDoctor(NoDoctorData);
    }
  }, [selectedSpecialty]);

  useEffect(() => {
    if (props.route.params?.selectedDoctor) {
      setSelectedDoctor(props.route.params?.selectedDoctor);
    }
  }, [props.route.params?.selectedDoctor]);

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
            <NmDropdown
              items={specialtyList}
              setValue={setSelectedSpecialty}
              value={selectedSpecialty}
              containerStyle={{borderRadius: 12, borderColor: '#DDD'}}
              mainContainerStyle={{borderRadius: 12}}
            />

            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.componentHeader}>{'Select your preferred doctor'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (selectedDoctor.id != 'NO_DOCTORS') {
                  props.navigation.navigate('DoctorsScreen', {selectedSpecialty: selectedSpecialty, screenOrigin: 'ORIGIN_CREATE'});
                }
              }}
              style={[{width: '100%', borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
              <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12}}>
                <Image source={selectedDoctor.photo} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
              </View>
              <View style={{marginLeft: 10, justifyContent: 'center'}}>
                <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}}>{selectedDoctor.name}</Text>
                {selectedDoctor.id != 'NO_DOCTORS' && <Text style={{color: '#000', fontFamily: 'Poppins-Medium'}}>{selectedDoctor.specialty}</Text>}
              </View>
            </TouchableOpacity>

            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.componentHeader}>{'Select schedule'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ScheduleScreen', {originScreen: 'HospitalCreate'});
              }}
              style={[{width: '100%', height: 45, borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
              {selectedSchedule == schedulePlaceholder ? (
                <View style={{width: '100%', flexDirection: 'row'}}>
                  <Text style={[styles.scheduleText, {paddingLeft: 10, color: '#AAA'}]}>{selectedSchedule}</Text>
                </View>
              ) : (
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={[styles.scheduleText, {paddingLeft: 10}]}>{(selectedSchedule as ScheduleData).date}</Text>
                  <Text style={[styles.scheduleText, {paddingRight: 10}]}>{(selectedSchedule as ScheduleData).time}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.componentHeader}>{'Insert or tell your initail complaint'}</Text>
            </View>
            <View style={[{flex: 1, width: '100%', minHeight: 45, borderWidth: 1, borderColor: '#E0DFE4', borderRadius: 12, overflow: 'hidden', flexDirection: 'row'}]}>
              <TextInput
                style={[NmStyles.textInput]}
                value={initialComplaint}
                onChangeText={(value: string) => {
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
                name: selectedDoctor.name,
                photo: selectedDoctor.photo,
                specialty: selectedDoctor.specialty,
                type: 'UPCOMING',
                date: (selectedSchedule as ScheduleData).date,
                time: (selectedSchedule as ScheduleData).time,
              };

              EventRegister.emit('updateAppointment', appointmentObject);
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

export default HospitalCreate;
