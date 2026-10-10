import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Image, FlatList} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import NmStyles from '../../../../constants/NmStyles';
import NmColors from '../../../../constants/NmColors';
import {SampleTopDoctorsList} from '../../../../Global/GlobalVariable';

interface DoctorData {
  photo: any;
  name: string;
  specialty: string;
  specialtyCode?: string;
}

interface DoctorsScreenProps {
  route?: {
    params?: {
      selectedSpecialty?: string;
      screenOrigin?: string;
    };
  };
  navigation: any;
}

const DoctorsScreen = (props: DoctorsScreenProps): React.JSX.Element => {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const selectedSpecialty = props?.route?.params?.selectedSpecialty;
  const screenOrigin = props?.route?.params?.screenOrigin;

  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [headerTitle, setHeaderTitle] = useState<string>('Doctors');
  const [SampleTopDoctors, setSampleTopDoctors] = useState<DoctorData[]>(SampleTopDoctorsList);

  useEffect(() => {
    if (selectedSpecialty != undefined) {
      let tmpTopDoctors = SampleTopDoctors.filter(item => item.specialtyCode == selectedSpecialty);
      setSampleTopDoctors(tmpTopDoctors);
      setHeaderTitle('Select Doctor');
    }
  }, []);

  const renderItem = ({item, index}: {item: DoctorData; index: number}): React.JSX.Element => {
    const imageLength = SCREEN_WIDTH * 0.2;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        style={{flexDirection: 'row', width: '100%', padding: 10, marginBottom: 10, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#EEE', borderRadius: 12}}
        onPress={() => {
          if (screenOrigin == 'ORIGIN_CREATE') {
            props.navigation.navigate({name: 'HospitalCreate', params: {selectedDoctor: item}, merge: false});
          } else {
            props.navigation.navigate('DoctorProfile', {doctorData: item});
          }
        }}>
        <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#EEE'}}>
          <Image source={item.photo} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
        </View>
        <View style={{marginLeft: 10, justifyContent: 'center'}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}}>{item.name}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Medium'}}>{item.specialty}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{headerTitle}</Text>
      </View>

      <View style={{width: '100%', paddingHorizontal: 16, marginBottom: 10}}>
        <View style={[NmStyles.textInputContainer, {borderRadius: 12, borderWidth: 0, marginRight: 16, backgroundColor: '#EEE'}]}>
          <View style={{paddingLeft: 10, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <MaterialCommunityIcons style={{paddingHorizontal: 0}} name={'magnify'} size={30} color={'#CCC'} />
          </View>
          <TextInput
            style={[NmStyles.textInput, {marginLeft: -2}]}
            placeholderTextColor={NmColors.placeholderTextColor}
            onChangeText={value => setSearchValue(value)}
            value={searchValue}
            placeholder="Search by name"
          />
        </View>
      </View>

      <FlatList
        style={{width: '100%', paddingHorizontal: 16}}
        contentContainerStyle={{flexGrow: 1}}
        data={SampleTopDoctors}
        bounces={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
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
});

export default DoctorsScreen;
