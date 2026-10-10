import React, {useEffect, useState, useContext} from 'react';
import {View, Text, FlatList, StatusBar, StyleSheet, TouchableOpacity, Image, useWindowDimensions} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {TransportContext} from '../../../../functions/Contexts';
import {NmButton} from '../../../../components';

const TransportBookings = props => {
  const Tab = createMaterialTopTabNavigator();
  const bookingContext = useContext(TransportContext);

  const [ongoingItems, setOngoingItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [cancelledItems, setCancelledItems] = useState([]);

  useEffect(() => {
    if (bookingContext != undefined) {
      setOngoingItems(bookingContext.filter(item => item.type == 'ONGOING'));
      setCompletedItems(bookingContext.filter(item => item.type == 'COMPLETED'));
      setCancelledItems(bookingContext.filter(item => item.type == 'CANCELLED'));
    }
  }, [bookingContext]);

  const renderOngoing = ({item, index}) => {
    const imageLength = WINDOW_WIDTH * 0.2;

    return (
      <TouchableOpacity key={index} style={{flexDirection: 'row', width: '100%', padding: 10, marginBottom: 10, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE', borderRadius: 12}}>
        {/* <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#EEE'}}>
          <Image source={item.photo} style={{flex: 1, width: undefined, height: undefined}} resizeMode="cover" />
        </View> */}
        <View style={{width: '100%', paddingHorizontal: 10, justifyContent: 'center'}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 14}}>{item.date}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}}>{item.destination}</Text>
          <View style={styles.ongoingDetailsRow}>
            <Text style={[styles.ongoingRowTitle]}>{'Status: '}</Text>
            <Text style={[styles.ongoingRowInfo]}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const OngoingList = () => {
    return (
      <View style={{flex: 1, width: '100%', paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', justifyContent: 'center'}}>
        {ongoingItems.length > 0 ? (
          <FlatList data={ongoingItems} renderItem={renderOngoing} keyExtractor={(item, index) => index} style={{width: '100%'}} />
        ) : (
          <Text style={{color: '#AAA', fontFamily: 'Poppins-Bold', fontSize: 16}}>{'No Active Bookings'}</Text>
        )}
      </View>
    );
  };

  const rendercompleted = ({item, index}) => {
    const imageLength = WINDOW_WIDTH * 0.2;

    return (
      <TouchableOpacity key={index} style={{flexDirection: 'row', width: '100%', padding: 10, marginBottom: 10, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#EEE', borderRadius: 12}}>
        <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#EEE'}}>
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

  const CompletedList = () => {
    return (
      <View style={{flex: 1, width: '100%', paddingVertical: 10, alignItems: 'center', justifyContent: 'center'}}>
        {completedItems.length > 0 ? (
          <FlatList data={completedItems} renderItem={rendercompleted} keyExtractor={(item, index) => index} style={{width: '100%'}} />
        ) : (
          <Text style={{color: '#AAA', fontFamily: 'Poppins-Bold', fontSize: 16}}>{'No Completed Bookings'}</Text>
        )}
      </View>
    );
  };

  const renderCancelled = ({item, index}) => {
    const imageLength = WINDOW_WIDTH * 0.2;

    return (
      <TouchableOpacity key={index} style={{flexDirection: 'row', width: '100%', padding: 10, marginBottom: 10, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#EEE', borderRadius: 12}}>
        <View style={{width: imageLength, height: imageLength, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#EEE'}}>
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

  const CancelledList = () => {
    return (
      <View style={{flex: 1, width: '100%', paddingVertical: 10, alignItems: 'center', justifyContent: 'center'}}>
        {cancelledItems.length > 0 ? (
          <FlatList data={cancelledItems} renderItem={renderCancelled} keyExtractor={(item, index) => index} style={{width: '100%'}} />
        ) : (
          <Text style={{color: '#AAA', fontFamily: 'Poppins-Bold', fontSize: 16}}>{'No Cancelled Bookings'}</Text>
        )}
      </View>
    );
  };

  const [index, setIndex] = React.useState(0);
  const layout = useWindowDimensions();

  const renderScene = SceneMap({
    Upcoming: OngoingList,
    Completed: CompletedList,
    Cancelled: CancelledList,
  });

  const routes = [
    {key: 'Upcoming', title: 'Upcoming'},
    {key: 'Completed', title: 'Completed'},
    {key: 'Cancelled', title: 'Cancelled'},
  ];

  const renderTabBar = props => <TabBar {...props} indicatorStyle={{backgroundColor: '#236BEA', height: 3}} style={{backgroundColor: '#FFF'}} activeColor="#000" inactiveColor="#bebebeff" />;

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF'}}>
      <StatusBar backgroundColor={'#FFF'} />
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Bookings'}</Text>
      </View>

      <View style={{flex: 1, width: '100%'}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={renderTabBar}
          commonOptions={{
            labelStyle: {fontFamily: 'Poppins-Medium'},
          }}
        />
        {/* <Tab.Navigator
          style={{}}
          screenOptions={{
            tabBarLabelStyle: {fontSize: 14, fontFamily: 'Poppins-Medium'},
            tabBarStyle: {elevation: 0},
            tabBarActiveTintColor: '#236BEA',
            tabBarInactiveTintColor: '#BBB',
          }}>
          <Tab.Screen name="Ongoing" component={OngoingList} />
          <Tab.Screen name="Completed" component={CompletedList} />
          <Tab.Screen name="Cancelled" component={CancelledList} />
        </Tab.Navigator> */}
      </View>
      <View style={{width: '100%', paddingVertical: 10, paddingHorizontal: 16, borderTopColor: '#FFF', borderTopWidth: StyleSheet.hairlineWidth}}>
        <NmButton
          buttonTheme={'dark'}
          style={{borderRadius: 12}}
          titleStyle={{}}
          title="Book private ride"
          onPress={() => {
            props.navigation.navigate('TransportNewBooking');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ongoingDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ongoingRowTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000',
  },
  ongoingRowInfo: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000',
  },
});

export default TransportBookings;
