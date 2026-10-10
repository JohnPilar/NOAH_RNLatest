import {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Image, ScrollView, Text, TouchableOpacity, BackHandler} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NmLabel, NmNewsBanner, NmProfileModal} from '../../../components';
import {ThemesContext} from '../../../functions/ThemeContext';
import {NmStyles} from '../../../constants';
import {WINDOW_WIDTH} from '../../../constants/NmStyles';
import {NmGetTimeGreeting, NmGetMeetingTitle, NmGetTimeDifference, NmHardwareBackPress} from '../../../functions/NmFunctions';
import {useIsFocused} from '@react-navigation/native';
import {AccountDetailsContext, AppConfigContext} from '../../../functions/Contexts';

var XDate = require('xdate');

const V2_MainScreen = props => {
  const {recname} = useContext(AccountDetailsContext);
  const {AssetManager} = useContext(AppConfigContext);

  const bibleVerse = AssetManager.appAssets.BibleVerseData;
  let sampleDate = new XDate();
  const {theme} = useContext(ThemesContext);
  const isFocused = useIsFocused();

  const [profileModal, setProfileModal] = useState(false);
  const sampleUpcoming = [
    {
      date: new XDate(sampleDate),
      timeStart: new XDate(sampleDate.setHours(10).setMinutes(0)),
      timeEnd: new XDate(sampleDate.setHours(12).setMinutes(0)),
      description: 'Client Concerns',
      location: 'Teams',
    },
    {
      date: new XDate(sampleDate.setDate(sampleDate.getDate() + 1)),
      timeStart: new XDate(sampleDate.setHours(8).setMinutes(30)),
      timeEnd: new XDate(sampleDate.setHours(9).setMinutes(0)),
      description: 'Mobile App Updates',
      location: 'Teams',
    },
    {
      date: new XDate(sampleDate.setDate(sampleDate.getDate() + 1)),
      timeStart: new XDate(sampleDate.setHours(13).setMinutes(30)),
      timeEnd: new XDate(sampleDate.setHours(15).setMinutes(0)),
      description: 'Internal Meeting',
      location: 'Zoom',
    },
  ];

  let sampleDate2 = new XDate();
  const sampleApprovals = [
    {
      name: 'John Pilar',
      date: new XDate(sampleDate2).setDate(new XDate(sampleDate2).getDate()).setHours(9).setMinutes(15),
      request: 'Database Backup',
      company: 'FPMC',
    },
    {
      name: 'Karl Angelo Gamayo',
      date: new XDate(
        sampleDate2
          .setDate(sampleDate2.getDate() - 1)
          .setHours(10)
          .setMinutes(55),
      ),
      request: 'New Application Pool',
      company: 'FPTI HRMS',
    },
    {
      name: 'Jenny May Cabantug',
      date: new XDate(
        sampleDate2
          .setDate(sampleDate2.getDate() - 1)
          .setHours(15)
          .setMinutes(19),
      ),
      request: 'Database Backup',
      company: 'GREENFIELD',
    },
  ];

  const [containerWidth, setContainerWidth] = useState(0);
  const handleLayout = event => {
    const {width} = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  NmHardwareBackPress();

  // useEffect(() => {
  //   if (isFocused) {
  //     const handleBackButton = () => {
  //       props.navigation.goBack();
  //       return true;
  //     };

  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  //     return () => backHandler.remove();
  //   }
  // }, [isFocused]);

  return (
    <View style={[styles.container, {backgroundColor: theme.screenBackground}]}>
      <NmProfileModal modalVisible={profileModal} setModalVisible={setProfileModal} animationIn={'slideInLeft'} animationOut={'slideOutLeft'} />

      <View style={styles.userDetailsContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setProfileModal(true);
          }}>
          <Image source={require('../../../assets/Images/userpic2.png')} style={styles.userImage} />
        </TouchableOpacity>
        <View style={styles.userTextContainer}>
          <NmLabel style={[NmStyles.fontOpenSans.regular, {color: theme.textColor}]}>{NmGetTimeGreeting(new Date())}</NmLabel>
          <NmLabel style={[NmStyles.fontOpenSans.bold, {color: theme.color}]} numberOfLines={1}>
            {recname}
          </NmLabel>
        </View>
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1, paddingHorizontal: 16, marginTop: 0, paddingTop: 8}}>
        <View style={{flex: 1, paddingBottom: 16}}>
          <View style={[styles.cardContainer, {backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}]}>
            <Text style={[NmStyles.fontOpenSans.italic, {fontSize: 14, color: '#A4A8B0', marginBottom: 4}]}>{'Verse for the Day'}</Text>
            <Text style={[NmStyles.fontOpenSans.bold, {fontSize: 16, marginBottom: 2, color: theme.textColor}]}>{bibleVerse.versetitle}</Text>
            <Text style={[NmStyles.fontOpenSans.regular, {fontSize: 16, marginTop: -4, textAlign: 'justify', color: theme.textColor}]}>{bibleVerse.versebody}</Text>
          </View>

          <View style={[styles.cardContainer, {marginTop: 8, paddingBottom: 0, backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style={{}} name={'calendar-outline'} size={24} color={'#1974D1'} />
                <NmLabel style={[NmStyles.fontOpenSans.bold, {color: '#1974D1', marginLeft: 8}]}>{'Upcoming Meetings'}</NmLabel>
              </View>
              <TouchableOpacity activeOpacity={0.5} onPress={() => {}} style={{marginBottom: -3}}>
                <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 14, color: '#1974D1', alignSelf: 'flex-end'}]}>{'View All'}</NmLabel>
              </TouchableOpacity>
            </View>

            <View style={{paddingTop: 4}}>
              {sampleUpcoming?.length > 0 ? (
                <>
                  {sampleUpcoming.map((item, index) => {
                    const meetingDuration = NmGetTimeDifference(item.timeStart, item.timeEnd);
                    let durationText;
                    if (meetingDuration.hr == 0 && meetingDuration.min > 0) {
                      durationText = meetingDuration.min + ' minute(s)';
                    } else if (meetingDuration.hr > 0 && meetingDuration.min == 0) {
                      durationText = meetingDuration.hr + ' hour(s)';
                    } else {
                      durationText = meetingDuration.hr + 'hr(s) ' + meetingDuration.min + 'min(s)';
                    }

                    return (
                      <View
                        key={index.toString()}
                        style={[index != 2 && {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#1974D1'}, {paddingHorizontal: 8, paddingBottom: 12, marginBottom: 8, borderRadius: 12}]}>
                        <NmLabel style={[NmStyles.fontOpenSans.bold, {fontSize: 16, color: theme.textColor}]} numberOfLines={1}>
                          {item.description}
                        </NmLabel>
                        <NmLabel style={[NmStyles.fontOpenSans.medium, {fontSize: 16, color: theme.textColor}]}>{NmGetMeetingTitle(new XDate(item.date))}</NmLabel>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 16, color: theme.textColor}]}>
                            {new XDate(item.timeStart).toString('hh:mm tt') + ' - ' + new XDate(item.timeEnd).toString('hh:mm tt')}
                          </NmLabel>
                          <NmLabel style={[NmStyles.fontOpenSans.light, {fontSize: 14, color: '#777'}]}>{durationText}</NmLabel>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : (
                <View style={{width: '100%', height: 60, alignItems: 'center', justifyContent: 'center'}}>
                  <NmLabel style={[NmStyles.fontOpenSans.bold, {color: '#DDD', fontSize: 20}]}>{'No Upcoming Meetings'}</NmLabel>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.cardContainer, {marginTop: 8, paddingBottom: 0, backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style={{}} name={'clipboard-check-outline'} size={24} color={'#1974D1'} />
                <NmLabel style={[NmStyles.fontOpenSans.bold, {color: '#1974D1', marginLeft: 8}]}>{'For Approval'}</NmLabel>
              </View>
              <TouchableOpacity activeOpacity={0.5} onPress={() => {}} style={{marginBottom: -3}}>
                <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 14, color: '#1974D1', alignSelf: 'flex-end'}]}>{'View All'}</NmLabel>
              </TouchableOpacity>
            </View>

            <View style={{paddingTop: 4}}>
              {sampleApprovals?.length > 0 ? (
                <>
                  {sampleApprovals.map((item, index) => {
                    return (
                      <View
                        key={index.toString()}
                        style={[index != 2 && {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#1974D1'}, {paddingHorizontal: 8, paddingBottom: 12, marginBottom: 8, borderRadius: 12}]}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 16, color: theme.textColor}]}>{'Name '}</NmLabel>
                          <NmLabel style={[NmStyles.fontOpenSans.bold, {fontSize: 14, color: '#777'}]} numberOfLines={1}>
                            {item.name}
                          </NmLabel>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 16, color: theme.textColor}]}>{'Date '}</NmLabel>
                          <NmLabel style={[NmStyles.fontOpenSans.bold, {fontSize: 14, color: '#777'}]} numberOfLines={1}>
                            {new XDate(item.date).toString('MMM dd, yyyy hh:mm tt')}
                          </NmLabel>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 16, color: theme.textColor}]}>{'Request '}</NmLabel>
                          <NmLabel style={[NmStyles.fontOpenSans.bold, {fontSize: 14, color: '#777'}]} numberOfLines={1}>
                            {item.request}
                          </NmLabel>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 16, color: theme.textColor}]}>{'Company '}</NmLabel>
                          <NmLabel style={[NmStyles.fontOpenSans.bold, {fontSize: 14, color: '#777'}]} numberOfLines={1}>
                            {item.company}
                          </NmLabel>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : (
                <View style={{width: '100%', height: 60, alignItems: 'center', justifyContent: 'center'}}>
                  <NmLabel style={[NmStyles.fontOpenSans.bold, {color: '#DDD', fontSize: 20}]}>{'No Requests Yet'}</NmLabel>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.cardContainer, {marginTop: 8, paddingBottom: 0, backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
              <MaterialCommunityIcons style={{}} name={'newspaper'} size={24} color={'#1974D1'} />
              <NmLabel style={[NmStyles.fontOpenSans.bold, {color: '#1974D1', marginLeft: 8}]}>{'News and Updates'}</NmLabel>
            </View>
            <NmNewsBanner
              onLayout={handleLayout}
              hideDisclaimer={true}
              hideTitle={true}
              containerStyle={{alignSelf: 'center', width: WINDOW_WIDTH * 0.9, marginVertical: 0}}
              parentWidth={containerWidth}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userDetailsContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingLeft: 18,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  userImage: {
    width: 46,
    height: 46,
    borderRadius: 46,
    overflow: 'hidden',
  },
  userTextContainer: {
    width: '100%',
    marginLeft: 10,
    justifyContent: 'center',
    marginTop: 0,
  },
  cardContainer: {
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d1d1ff',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFF',
  },
});

export default V2_MainScreen;
