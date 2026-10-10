import React, {useEffect, useState, useContext} from 'react';
import {useWindowDimensions, View, Text, Image, StatusBar, TouchableOpacity, ImageBackground, ScrollView, DimensionValue} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NmButton, NmShortcutsPanel} from '../../../../components';
import {AccountDetailsContext, AppointmentContext} from '../../../../functions/Contexts';
import {SampleTopDoctorsList} from '../../../../Global/GlobalVariable';

interface AppointmentItem {
  name: string;
  photo: any;
  specialty: string;
  type: string;
  date: string;
  time: string;
}

interface DoctorData {
  name: string;
  photo: any;
  specialty: string;
}

interface HospitalHomeProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const HospitalHome = (props: HospitalHomeProps): React.JSX.Element => {
  const appointContext = useContext(AppointmentContext);
  const {recname} = useContext(AccountDetailsContext);

  const {width} = useWindowDimensions();

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [upcoming, setUpcoming] = useState<AppointmentItem | undefined>();

  useEffect(() => {
    if (appointContext != undefined) {
      setUpcoming(appointContext[0]);
    }
  }, [appointContext]);

  const SampleServiceItems = [
    {itemName: 'General Medicine', icon: 'medical-bag', screenName: 'Test'},
    {itemName: 'Dentists', icon: 'tooth-outline', screenName: 'Test'},
    {itemName: 'Cardiologists', icon: 'heart-pulse', screenName: 'Test'},
    {itemName: 'Radiologists', icon: 'radioactive-circle', screenName: 'Test'},
    {itemName: 'Neurologists', icon: 'thought-bubble-outline', screenName: 'Test'},
    {itemName: 'Pathologists', icon: 'water-opacity', screenName: 'Test'},
    {itemName: 'Psychiatrists', icon: 'brain', screenName: 'Test'},
    {itemName: 'Epidemiologists', icon: 'puzzle-heart-outline', screenName: 'Test'},
    {itemName: 'Dermatologists', icon: 'human-handsdown', screenName: 'Test'},
  ];

  const SampleTopDoctors = SampleTopDoctorsList;

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF'}}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}}>
        {/* Name and header */}
        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 5, flexDirection: 'row'}}>
          <Image source={require('../../../../assets/testuser.png')} style={{width: 46, height: 46, borderRadius: 46, overflow: 'hidden'}} />
          <View style={{width: '100%', marginLeft: 10, justifyContent: 'center', marginTop: 0}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16}}>{'Good Morning'}</Text>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18}}>{recname}</Text>
          </View>
        </View>

        {/* <View style={{marginBottom: 0, paddingVertical: 10, paddingBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
            <View style={[{flex: 1}, NmStyles.textInputContainer, {height: 47, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, marginHorizontal: 16}]}>
              <View style={{paddingLeft: 10, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <MaterialCommunityIcons style={{paddingHorizontal: 0}} name={'magnify'} size={30} color={'#CCC'} />
              </View>
              <TextInput
                style={[NmStyles.textInput, {marginLeft: -2, fontFamily: 'Poppins-Medium', fontSize: 18}]}
                placeholderTextColor={NmColors.placeholderTextColor}
                onChangeText={value => setSearchValue(value)}
                value={searchValue}
                placeholder="Search for doctors or your needs"
              />
            </View>
          </View> */}

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 10}}>
          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Upcoming appointment'}</Text>
            {upcoming != undefined && (
              <Text
                style={{color: '#337DFF', fontFamily: 'Poppins-Regular', fontSize: 16}}
                onPress={() => {
                  props.navigation.navigate('HospitalAppointment', {viewUpcoming: true});
                }}>
                {'See all'}
              </Text>
            )}
          </View>

          {upcoming != undefined ? (
            <View style={[{width: '100%', minHeight: 120, justifyContent: 'center'}]}>
              <ImageBackground
                style={[
                  {
                    flex: 1,
                    backgroundColor: '#FFF',
                    width: undefined,
                    height: undefined,
                    borderRadius: 12,
                    overflow: 'hidden',
                  },
                ]}
                imageStyle={[{resizeMode: 'cover', opacity: 0.9}]}
                source={require('../../../../assets/Images/appointment.jpg')}>
                <View style={{width: '100%', flexDirection: 'row', margin: 15, marginBottom: 10, alignItems: 'center'}}>
                  <Image source={upcoming.photo} style={{width: 50, height: 50, borderRadius: 25, overflow: 'hidden'}} />
                  <View style={{justifyContent: 'center', marginLeft: 10}}>
                    <Text style={{color: '#FFF', fontFamily: 'Poppins-Medium', fontSize: 18}}>{upcoming.name}</Text>
                    <Text style={{color: '#FFF', fontFamily: 'Poppins-Regular', fontSize: 16}}>{upcoming.specialty}</Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    marginHorizontal: 16,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                  }}>
                  <MaterialCommunityIcons name={'clock-outline'} color={'#FFF'} size={20} style={{paddingHorizontal: 10}} />
                  <View style={{width: '100%', justifyContent: 'center', marginTop: 3}}>
                    <Text style={{fontFamily: 'Poppins-Regular'}}>{upcoming.date}</Text>
                    <Text style={{fontFamily: 'Poppins-Regular'}}>{upcoming.time}</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          ) : (
            <View>
              <Text style={{color: '#AAA', fontFamily: 'Poppins-Regular', fontSize: 18}}>{'No upcoming appointments'}</Text>
            </View>
          )}
        </View>

        {/* Shortcuts */}
        <View style={{width: '100%', paddingHorizontal: 16, alignItems: 'center', marginTop: 20}}>
          <NmShortcutsPanel items={SampleServiceItems} headerTitle={'Doctor Specialty'} containerStyle={{marginTop: 0}} numRows={2} />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 10}}>
          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 0, alignItems: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Recommended Doctors'}</Text>
            <Text
              style={{color: '#337DFF', fontFamily: 'Poppins-Regular', fontSize: 16}}
              onPress={() => {
                props.navigation.navigate('DoctorListScreens');
              }}>
              {'See all'}
            </Text>
          </View>

          {SampleTopDoctors.map((item, index) => {
            const imageLength = width * 0.2;

            if (index < 3) {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={{flexDirection: 'row', width: '100%', padding: 10, marginBottom: 10, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#EEE', borderRadius: 12}}>
                  <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#EEE'}}>
                    <Image source={item.photo} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
                  </View>
                  <View style={{marginLeft: 10, justifyContent: 'center'}}>
                    <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}}>{item.name}</Text>
                    <Text style={{color: '#000', fontFamily: 'Poppins-Medium'}}>{item.specialty}</Text>
                    <NmButton
                      buttonTheme={'dark'}
                      style={{paddingHorizontal: 10, height: 28}}
                      titleStyle={{}}
                      title="Book Appointment"
                      onPress={() => {
                        //
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default HospitalHome;
