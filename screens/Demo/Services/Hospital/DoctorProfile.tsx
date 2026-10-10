import React, {useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import NmColors from '../../../../constants/NmColors';
import {NmButton} from '../../../../components';
import {LoremText} from '../../../../Global/GlobalVariable';
import {NmHardwareBackPress} from '../../../../functions/NmFunctions';

interface DoctorData {
  photo: any;
  name: string;
  specialty: string;
}

interface DoctorProfileProps {
  route?: {
    params?: {
      doctorData?: DoctorData;
    };
  };
  navigation: any;
}

function DoctorProfile(props: DoctorProfileProps): React.JSX.Element {
  const doctorData = props?.route?.params?.doctorData;
  const [expandAbout, setExpandAbout] = useState<boolean>(false);

  NmHardwareBackPress();

  return (
    <View style={styles.container}>
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Doctor Profile'}</Text>
      </View>
      <ScrollView style={{width: '100%'}} contentContainerStyle={{flexGrow: 1}}>
        <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
          <Image source={doctorData?.photo} style={{width: WINDOW_WIDTH * 0.5, height: WINDOW_WIDTH * 0.5, borderRadius: 100, borderWidth: 1, borderColor: '#EEE'}} />
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 24, marginTop: 5}}>{doctorData?.name}</Text>
          <Text style={{color: '#777', fontFamily: 'Poppins-Medium', fontSize: 22, marginTop: -5}}>{doctorData?.specialty}</Text>
        </View>

        <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
          <TouchableOpacity style={{backgroundColor: '#f4f4f4', borderRadius: 100, marginHorizontal: 10}}>
            <MaterialCommunityIcons style={{padding: 10}} name={'phone-outline'} size={28} color={'#133561'} />
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#f4f4f4', borderRadius: 100, marginHorizontal: 10}}>
            <MaterialCommunityIcons style={{padding: 10}} name={'chat-outline'} size={28} color={'#133561'} />
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#f4f4f4', borderRadius: 100, marginHorizontal: 10}}>
            <MaterialCommunityIcons style={{padding: 10}} name={'email-outline'} size={28} color={'#133561'} />
          </TouchableOpacity>
        </View>

        {/* <Animated.Text animatedProps={infoProp} style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16, marginLeft: 0}} numberOfLines={expandAbout == true ? undefined : 3}> */}

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'About Me'}</Text>
          {/* <Animated.Text animatedProps={loremProps} style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16, marginLeft: 0}}>
            {''}
          </Animated.Text> */}
          <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16, marginLeft: 0}} numberOfLines={expandAbout == true ? undefined : 3}>
            {LoremText}
          </Text>
          {expandAbout == true ? (
            <Text
              style={{color: 'blue', fontFamily: 'Poppins-Regular', fontSize: 16}}
              onPress={() => {
                setExpandAbout(false);
              }}>
              {'See less'}
            </Text>
          ) : (
            <Text
              style={{color: 'blue', fontFamily: 'Poppins-Regular', fontSize: 16}}
              onPress={() => {
                setExpandAbout(true);
              }}>
              {'See more'}
            </Text>
          )}
        </View>
      </ScrollView>
      <View style={{width: '100%', paddingHorizontal: 16, paddingVertical: 10}}>
        <NmButton
          buttonTheme={'dark'}
          style={[{backgroundColor: NmColors.buttonDark, borderRadius: 12}]}
          titleStyle={{}}
          title="Book an appointment"
          onPress={() => {
            props.navigation.pop();
            props.navigation.navigate('HospitalAppointmentScreens', {screen: 'HospitalCreate', params: {doctorData: doctorData}});
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
});

export default DoctorProfile;
