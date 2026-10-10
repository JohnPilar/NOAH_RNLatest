import React, {useEffect, useState, useContext} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ListRenderItem} from 'react-native';

import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {HandymanContext} from '../../../../functions/Contexts';
import {NmButton} from '../../../../components';
import {NmColors} from '../../../../constants';

type BookingTab = 'Upcoming' | 'Completed' | 'Cancelled';

interface HandymanBookingsProps {
  navigation: any;
}

const BOOKING_TABS: BookingTab[] = ['Upcoming', 'Completed', 'Cancelled'];

function HandymanBookings(props: HandymanBookingsProps): React.JSX.Element {
  const handyContext = useContext(HandymanContext);

  const [activeTab, setActiveTab] = useState<BookingTab>('Upcoming');
  const [upcomingItems, setUpcomingItems] = useState<any[]>([]);
  const [completedItems, setCompletedItems] = useState<any[]>([]);
  const [cancelledItems, setCancelledItems] = useState<any[]>([]);

  useEffect(() => {
    if (handyContext !== undefined) {
      setUpcomingItems(handyContext.filter((item: any) => item.type === 'UPCOMING'));
      setCompletedItems(handyContext.filter((item: any) => item.type === 'COMPLETED'));
      setCancelledItems(handyContext.filter((item: any) => item.type === 'CANCELLED'));
    }
  }, [handyContext]);

  const renderBookingItem: ListRenderItem<any> = ({item, index}) => {
    const imageLength = WINDOW_WIDTH * 0.2;

    return (
      <TouchableOpacity
        key={index}
        style={{
          flexDirection: 'row',
          width: '100%',
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
          <FlatList data={upcomingItems} renderItem={renderBookingItem} keyExtractor={(_, index) => index.toString()} style={{width: '100%'}} />
        ) : (
          <Text style={{color: '#AAA', fontFamily: 'Poppins-Bold', fontSize: 16}}>{'No Active Bookings'}</Text>
        )}
      </View>
    );
  };

  const CompletedList = (): React.JSX.Element => {
    return (
      <View style={styles.listContainer}>
        {completedItems.length > 0 ? (
          <FlatList data={completedItems} renderItem={renderBookingItem} keyExtractor={(_, index) => index.toString()} style={{width: '100%'}} />
        ) : (
          <Text style={{color: '#AAA', fontFamily: 'Poppins-Bold', fontSize: 16}}>{'No Completed Bookings'}</Text>
        )}
      </View>
    );
  };

  const CancelledList = (): React.JSX.Element => {
    return (
      <View style={styles.listContainer}>
        {cancelledItems.length > 0 ? (
          <FlatList data={cancelledItems} renderItem={renderBookingItem} keyExtractor={(_, index) => index.toString()} style={{width: '100%'}} />
        ) : (
          <Text style={{color: '#AAA', fontFamily: 'Poppins-Bold', fontSize: 16}}>{'No Cancelled Bookings'}</Text>
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
          {'Bookings'}
        </Text>
      </View>

      <View style={{flex: 1, width: '100%', paddingHorizontal: 16}}>
        {/* Top Tab Bar */}
        <View style={styles.tabBarContainer}>
          {BOOKING_TABS.map(tab => {
            const isFocused = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, {borderBottomColor: isFocused ? NmColors.buttonLight : '#EEE'}]}>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isFocused ? NmColors.buttonDark : 'gray',
                      opacity: isFocused ? 1 : 0.6,
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
          title="Request Service"
          onPress={() => {
            props.navigation.navigate('HandymanNewBooking');
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
  tabBarContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 3,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
});

export default HandymanBookings;
