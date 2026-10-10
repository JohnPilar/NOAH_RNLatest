import React, {useState, useContext} from 'react';
import {useWindowDimensions, View, StyleSheet, Text, Image, StatusBar, TouchableOpacity, ImageBackground, ScrollView, ImageSourcePropType, StyleProp, ImageStyle, DimensionValue} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDeviceOrientation} from '../../../../functions/NmFunctions';
import {useFocusEffect} from '@react-navigation/native';

import {AccountDetailsContext, HandymanContext} from '../../../../functions/Contexts';
import {NmButton, NmShortcutsPanel} from '../../../../components';
import {SampleWorkers} from '../../../../Global/GlobalVariable';
import {StackScreenProps} from '../../../../navigation/NavigationTypes';
import {NmStyles} from '../../../../constants';

interface HandymanItem {
  name: string;
  specialty: string;
  date: string;
  time: string;
  photo: ImageSourcePropType;
  type?: string;
}

interface CategoryItem {
  itemName: string;
  icon: string;
  screenName: string;
}

type Props = {
  navigation?: any;
  imageStyle?: any;
};

function HandymanHome(props: Props): React.JSX.Element {
  const {recname} = useContext(AccountDetailsContext);
  const {width, height} = useWindowDimensions();
  const orientation = useDeviceOrientation();
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const handyContext = useContext(HandymanContext) as HandymanItem[] | undefined;

  let upcomingHandyman: HandymanItem | undefined = handyContext != undefined && handyContext.length > 0 ? handyContext[0] : undefined;

  useFocusEffect((): void => {
    StatusBar.setBarStyle('dark-content');
  });

  const SampleCategories: CategoryItem[] = [
    {itemName: 'Home Repair', icon: 'home-heart', screenName: 'Test'},
    {itemName: 'Painter', icon: 'format-paint', screenName: 'Test'},
    {itemName: 'Flooring & Tile', icon: 'floor-plan', screenName: 'Test'},
    {itemName: 'Electrician', icon: 'home-lightning-bolt', screenName: 'Test'},
    {itemName: 'Plumber', icon: 'water-pump', screenName: 'Test'},
    {itemName: 'Carpenter', icon: 'hammer-screwdriver', screenName: 'Test'},
    {itemName: 'Drywall', icon: 'wall', screenName: 'Test'},
    {itemName: 'HVAC', icon: 'hvac', screenName: 'Test'},
    {itemName: 'Windows', icon: 'window-closed-variant', screenName: 'Test'},
    {itemName: 'Roofing', icon: 'home-roof', screenName: 'Test'},
    {itemName: 'Placeholder for more', icon: 'home-roof', screenName: 'Test'},
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />

      <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}}>
        {/* Name and header */}
        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 5, flexDirection: 'row'}}>
          <Image source={require('../../../../assets/testuser.png')} style={{width: 46, height: 46, borderRadius: 46, overflow: 'hidden'}} />
          <View style={{width: '100%', marginLeft: 10, justifyContent: 'center', marginTop: 0}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16}}>{'Good Morning'}</Text>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18}}>{recname}</Text>
          </View>
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 10}}>
          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[NmStyles.poppinsBold, {fontSize: 18, marginLeft: 0}]}>{'Active Service Request'}</Text>
          </View>

          {upcomingHandyman != undefined ? (
            <TouchableOpacity
              style={[{width: '100%', minHeight: 120, justifyContent: 'center'}]}
              activeOpacity={0.85}
              onPress={() => {
                props.navigation.navigate('ServiceRequestScreens');
              }}>
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
                imageStyle={[{resizeMode: 'cover', opacity: 0.9}, props.imageStyle as StyleProp<ImageStyle>]}
                source={require('../../../../assets/Images/appointment.jpg')}>
                <View style={{width: '100%', flexDirection: 'row', margin: 15, marginBottom: 10, alignItems: 'center'}}>
                  <Image source={upcomingHandyman.photo} style={{width: 50, height: 50, borderRadius: 25, overflow: 'hidden'}} />
                  <View style={{justifyContent: 'center', marginLeft: 10}}>
                    <Text style={{color: '#FFF', fontFamily: 'Poppins-Medium', fontSize: 18}}>{upcomingHandyman.name}</Text>
                    <Text style={{color: '#FFF', fontFamily: 'Poppins-Regular', fontSize: 16}}>{upcomingHandyman.specialty}</Text>
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
                    <Text style={{fontFamily: 'Poppins-Regular'}}>{upcomingHandyman.date}</Text>
                    <Text style={{fontFamily: 'Poppins-Regular'}}>{upcomingHandyman.time}</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={{color: '#AAA', fontFamily: 'Poppins-Regular', fontSize: 18}}>{'No active requests'}</Text>
            </View>
          )}
        </View>

        {/* Shortcuts */}
        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <NmShortcutsPanel headerTitle={'Categories'} items={SampleCategories} containerStyle={{marginTop: 0}} numRows={2} numColumns={4} />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 10}}>
          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 0, alignItems: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Recommended'}</Text>
            <Text
              style={{color: '#337DFF', fontFamily: 'Poppins-Regular', fontSize: 16}}
              onPress={() => {
                props.navigation.navigate('HandymanScreens');
              }}>
              {'See all'}
            </Text>
          </View>

          {SampleWorkers.map((item, index) => {
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
                      title="Send a message"
                      onPress={() => {
                        //
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            }

            return null;
          })}
        </View>
      </ScrollView>
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
  activeBookingBackground: {
    flex: 1,
    backgroundColor: '#FFF',
    width: undefined,
    height: undefined,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    marginHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginBottom: 10,
  },
});

export default HandymanHome;
