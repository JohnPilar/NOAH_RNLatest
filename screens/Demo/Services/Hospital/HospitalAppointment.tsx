import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity, FlatList, ListRenderItem} from 'react-native';

import {AppointmentContext} from '../../../../functions/Contexts';
import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmButton} from '../../../../components';

interface AppointmentItem {
  type: string;
  photo: any;
  name: string;
  specialty: string;
  date: string;
  time: string;
}

type AppointmentTab = 'Upcoming' | 'Completed' | 'Cancelled';

interface HospitalAppointmentProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const APPOINTMENT_TABS: AppointmentTab[] = ['Upcoming', 'Completed', 'Cancelled'];

const HospitalAppointment = (props: HospitalAppointmentProps): React.JSX.Element => {
  const appointContext = useContext(AppointmentContext);

  const [activeTab, setActiveTab] = useState<AppointmentTab>('Upcoming');
  const [upcomingItems, setUpcomingItems] = useState<AppointmentItem[]>([]);
  const [completedItems, setCompletedItems] = useState<AppointmentItem[]>([]);
  const [cancelledItems, setCancelledItems] = useState<AppointmentItem[]>([]);

  useEffect(() => {
    if (appointContext !== undefined) {
      setUpcomingItems(appointContext.filter((item: any) => item.type === 'UPCOMING'));
      setCompletedItems(appointContext.filter((item: any) => item.type === 'COMPLETED'));
      setCancelledItems(appointContext.filter((item: any) => item.type === 'CANCELLED'));
    }
  }, [appointContext]);

  const renderAppointmentCard: ListRenderItem<AppointmentItem> = ({item, index}) => {
    const imageLength = WINDOW_WIDTH * 0.2;

    return (
      <TouchableOpacity
        key={index}
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: 10,
          marginBottom: 10,
          backgroundColor: '#f5f5f5',
          borderWidth: 1,
          borderColor: '#EEE',
          borderRadius: 12,
        }}>
        <View
          style={{
            width: imageLength,
            height: imageLength,
            overflow: 'hidden',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#EEE',
          }}>
          <Image source={item.photo} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
        </View>
        <View style={{marginLeft: 10, justifyContent: 'center'}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}}>{item.name}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Medium'}}>{item.specialty}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 12}}>{item.date}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 12}}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const UpcomingList = (): React.JSX.Element => {
    return (
      <View style={styles.listContainer}>
        {upcomingItems.length > 0 ? (
          <FlatList data={upcomingItems} renderItem={renderAppointmentCard} keyExtractor={(_, index) => index.toString()} style={{width: '100%'}} />
        ) : (
          <Text style={styles.emptyText}>{'No Upcoming Appointments'}</Text>
        )}
      </View>
    );
  };

  const CompletedList = (): React.JSX.Element => {
    return (
      <View style={styles.listContainer}>
        {completedItems.length > 0 ? (
          <FlatList data={completedItems} renderItem={renderAppointmentCard} keyExtractor={(_, index) => index.toString()} style={{width: '100%'}} />
        ) : (
          <Text style={styles.emptyText}>{'No Completed Appointments'}</Text>
        )}
      </View>
    );
  };

  const CancelledList = (): React.JSX.Element => {
    return (
      <View style={styles.listContainer}>
        {cancelledItems.length > 0 ? (
          <FlatList data={cancelledItems} renderItem={renderAppointmentCard} keyExtractor={(_, index) => index.toString()} style={{width: '100%'}} />
        ) : (
          <Text style={styles.emptyText}>{'No Cancelled Appointments'}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text
          style={{
            color: '#000',
            fontFamily: 'Poppins-Bold',
            fontSize: 20,
            paddingVertical: 10,
          }}>
          {'Appointments'}
        </Text>
      </View>

      <View style={{flex: 1, width: '100%', paddingHorizontal: 16}}>
        {/* Custom Tab Bar matching original visual style */}
        <View style={styles.tabBarContainer}>
          {APPOINTMENT_TABS.map(tab => {
            const isFocused = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, {borderBottomColor: isFocused ? '#236BEA' : 'transparent'}]}>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isFocused ? '#000' : '#bebebeff',
                    },
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Content Panes */}
        <View style={{flex: 1}}>
          <View style={{flex: 1, display: activeTab === 'Upcoming' ? 'flex' : 'none'}}>
            <UpcomingList />
          </View>

          <View style={{flex: 1, display: activeTab === 'Completed' ? 'flex' : 'none'}}>
            <CompletedList />
          </View>

          <View style={{flex: 1, display: activeTab === 'Cancelled' ? 'flex' : 'none'}}>
            <CancelledList />
          </View>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderTopColor: '#FFF',
          borderTopWidth: StyleSheet.hairlineWidth,
        }}>
        <NmButton
          buttonTheme={'dark'}
          style={{borderRadius: 12}}
          titleStyle={{}}
          title="Create new appointment"
          onPress={() => {
            props.navigation.navigate('HospitalCreate');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  tabBarContainer: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  emptyText: {
    color: '#AAA',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});

export default HospitalAppointment;
