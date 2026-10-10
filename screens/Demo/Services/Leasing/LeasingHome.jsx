import React, {useContext} from 'react';
import {View, StatusBar, Text, Image, ScrollView} from 'react-native';

import {NmStyles} from '../../../../constants';
import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmShortcutsPanel, NmSlidingBanner} from '../../../../components';
import {AccountDetailsContext} from '../../../../functions/Contexts';
import {NmGetTimeGreeting} from '../../../../functions/NmFunctions';

const LeasingHome = props => {
  const {recname} = useContext(AccountDetailsContext);
  const sampleAnnouncements = [
    {
      property: 'Noah Towers',
      header: 'Changes regarding building security',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    },
    {
      property: 'Noah Towers',
      header: 'New Payment System announced',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    },
    {
      property: 'Noah Condominium',
      header: 'Coffee shop now available',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    },
    {
      property: 'Noah Towers',
      header: 'Important message for unit owners',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    },
    {
      property: 'Noah Condominium',
      header: 'New Parking system',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    },
  ];

  const sampleShortcuts = [
    {itemName: 'Maintenance', icon: 'tools', screenName: 'Test'},
    {itemName: 'Profile', icon: 'account-circle-outline', screenName: 'Test'},
    {itemName: 'News', icon: 'newspaper', screenName: 'Test'},
    {itemName: 'Support', icon: 'help-circle-outline', screenName: 'Test'},
    {itemName: 'Neurologists', icon: 'thought-bubble-outline', screenName: 'Test'},
  ];

  const SampleAdItems = [
    {backgroundImage: require('../../../../assets/Images/Food/fads_1.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Food/fads_2.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Food/fads_3.jpg'), url: ''},
    {backgroundImage: require('../../../../assets/Images/Food/fads_4.jpg'), url: ''},
  ];

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF'}}>
      <StatusBar backgroundColor={'#FFF'} />
      <ScrollView style={{width: WINDOW_WIDTH}} contentContainerStyle={{flexGrow: 1}}>
        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 5, flexDirection: 'row'}}>
          <Image source={require('../../../../assets/testuser.png')} style={{width: 46, height: 46, borderRadius: 46, overflow: 'hidden'}} />
          <View style={{width: '100%', marginLeft: 10, justifyContent: 'center', marginTop: 0}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16}}>{NmGetTimeGreeting()}</Text>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18}}>{recname}</Text>
          </View>
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Offers'}</Text>
          <NmSlidingBanner
            data={SampleAdItems}
            onPress={item => {
              //
            }}
          />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, alignItems: 'center', marginTop: 20}}>
          <NmShortcutsPanel items={sampleShortcuts} headerTitle={'Shortcuts'} containerStyle={{marginTop: 0}} numRows={1} />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
          <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{'Announcements'}</Text>
            <Text
              style={{color: '#337DFF', fontFamily: 'Poppins-Regular', fontSize: 16}}
              onPress={() => {
                //
              }}>
              {'See all'}
            </Text>
          </View>
          {sampleAnnouncements.slice(0, 3).map((item, index) => {
            return (
              <View key={index} style={{width: '100%', borderRadius: 12, backgroundColor: '#f6f6f6', marginBottom: 10, padding: 10}}>
                <Text style={[NmStyles.poppinsMedium, {fontSize: 14}]}>{item.property}</Text>
                <Text style={[NmStyles.poppinsBold]} numberOfLines={1}>
                  {item.header}
                </Text>
                <Text style={[NmStyles.poppinsRegular]} numberOfLines={1}>
                  {item.message}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default LeasingHome;
