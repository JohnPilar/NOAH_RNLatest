import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ImageBackground, ScrollView, Dimensions, BackHandler, FlatList, Linking, DimensionValue, StyleProp, ViewStyle, ImageStyle, TextStyle} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

import {NmImageSlider, NmSlidingBanner, NmShortcutsPanel} from '../../components';
import {NmGetNewsAPI} from '../../functions/NmNetwork';
import {AccountDetailsContext} from '../../functions/Contexts';
import {NmHardwareBackPress} from '../../functions/NmFunctions';
import {useNavigation} from '@react-navigation/native';

interface DemoHomeProps {
  bannerContainerStyle?: StyleProp<ViewStyle>;
  bannerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  headerFontStyle?: StyleProp<TextStyle>;
}

const DemoHome = (props: DemoHomeProps): React.JSX.Element => {
  const {recname} = useContext(AccountDetailsContext);
  const {bannerContainerStyle, bannerStyle, imageStyle, headerFontStyle} = props || {};

  const insets = useSafeAreaInsets();
  const DeviceType = DeviceInfo.getDeviceType().toUpperCase();
  const SCREEN_WIDTH = Dimensions.get('screen').width;
  const navigation = useNavigation();

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const [latestNews, setLatestNews] = useState<any>();

  useEffect(() => {
    NmGetNewsAPI().then((res: any) => {
      setLatestNews(res.articles);
    });
  }, []);

  NmHardwareBackPress();

  const SampleAdItems = [
    {backgroundImage: require('../../assets/Images/ads_1.jpg'), url: ''},
    {backgroundImage: require('../../assets/Images/ads_2.jpg'), url: ''},
    {backgroundImage: require('../../assets/Images/ads_3.jpg'), url: ''},
    {backgroundImage: require('../../assets/Images/ads_4.jpg'), url: ''},
    {backgroundImage: require('../../assets/Images/ads_5.jpg'), url: ''},
    {backgroundImage: require('../../assets/Images/ads_6.jpg'), url: ''},
  ];

  const SampleServiceItems = [
    {itemName: 'Parking', icon: 'car-select', screenName: 'ParkingNavigator'},
    {itemName: 'Hospital', icon: 'hospital-box-outline', screenName: 'HospitalNavigator'},
    {itemName: 'Transportation', icon: 'hail', screenName: 'TransportNavigator'},
    {itemName: 'Food', icon: 'food', screenName: 'FoodNavigator'},
    {itemName: 'Maintenance', icon: 'home-lightbulb', screenName: 'HandymanNavigator'}, //Revert back to Handyman
    {itemName: 'Leasing', icon: 'home-city-outline', screenName: 'LeasingNavigator'},
    {itemName: 'Payments', icon: 'cash-multiple', screenName: 'PaymentNavigator'},
    {itemName: 'Shopping', icon: 'shopping-outline', screenName: 'ShopNavigator'},
  ];

  const SampleSliderItems = [
    {
      itemName: 'Agenda Calendar',
      backgroundImage: require('../../assets/Images/agcal.png'),
      url: '',
      screen: 'CalendarScreen',
    },
    {
      itemName: 'NOAH Components',
      backgroundImage: require('../../assets/Images/noahcomp.png'),
      screen: 'DemoScreen',
      url: '',
    },
    {
      itemName: 'Women essentials',
      backgroundImage: require('../../assets/Images/product_17.jpg'),
      url: '',
    },
    {
      itemName: 'Shoes',
      backgroundImage: require('../../assets/Images/product_16.jpg'),
      url: '',
    },
    {
      itemName: 'Gadgets',
      backgroundImage: require('../../assets/Images/product_15.jpg'),
      url: '',
    },
    {
      itemName: "Men's gear",
      backgroundImage: require('../../assets/Images/product_14.jpg'),
      url: '',
    },
    {
      itemName: 'Household items',
      backgroundImage: require('../../assets/Images/product_13.jpg'),
      url: '',
    },
    {
      itemName: 'Dynamic Screen',
      backgroundImage: require('../../assets/Images/product_12.jpg'),
      url: '',
      screen: 'DynamicScreen',
    },
  ];

  const renderNewsItem = ({item}: any): React.JSX.Element => {
    const image = item.urlToImage == null || item.urlToImage == '' ? require('../../assets/Images/nullnews.jpg') : {uri: item.urlToImage};

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Linking.openURL(item.url).catch(() => {
            //
          });
        }}
        style={[{width: SCREEN_WIDTH - 32, height: 160, justifyContent: 'center'}, bannerContainerStyle]}>
        <ImageBackground
          style={[
            {
              flex: 1,
              backgroundColor: '#FFF',
              width: undefined,
              height: undefined,
              justifyContent: 'flex-end',
              borderRadius: 12,
              overflow: 'hidden',
            },
            bannerStyle,
          ]}
          imageStyle={[{resizeMode: 'cover'}, imageStyle]}
          source={image}>
          <View style={{width: '100%', backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 10, paddingVertical: 10}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold'}}>{item.source.name}</Text>
            <Text style={{color: '#000', fontFamily: 'Poppins-Regular'}}>{item.title}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF', paddingTop: insets.top}}>
      {/* Name and header */}
      <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20, marginBottom: 5, flexDirection: 'row'}}>
        <Image source={require('../../assets/testuser.png')} style={{width: 46, height: 46, borderRadius: 46, overflow: 'hidden'}} />
        <View style={{width: '100%', marginLeft: 10, justifyContent: 'center', marginTop: 0}}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Regular', fontSize: 16}}>{'Good Morning'}</Text>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18}}>{recname}</Text>
        </View>
      </View>
      <ScrollView style={{width: screenWidth}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
        {/* Shortcuts */}
        <View style={{width: '100%', paddingHorizontal: 16, alignItems: 'center'}}>
          <NmSlidingBanner
            data={SampleAdItems}
            containerStyle={{marginTop: 20}}
            onPress={() => {
              //
            }}
          />

          <NmShortcutsPanel
            items={SampleServiceItems}
            containerStyle={{marginTop: 10}}
            headerTitle={'Services'}
            numRows={DeviceType == 'TABLET' ? undefined : 2}
            numColumns={DeviceType == 'TABLET' ? 8 : undefined}
            onPress={(item: any) => {
              if (item.screenName != '') {
                navigation.navigate(item.screenName as never);
              }
            }}
          />

          <NmImageSlider
            headerTitle={'Slider'}
            data={SampleSliderItems}
            containerStyle={{marginTop: 10}}
            headerContainerStyle={{backgroundColor: undefined}}
            headerFontStyle={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}
            mainContainerStyle={{backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE'}}
            itemContainerStyle={{backgroundColor: '#FFF'}}
            onPress={(item: any) => {
              if (item?.screen != undefined) {
                navigation.navigate(item.screen as never);
              }
            }}
          />
        </View>

        <View style={{width: '100%', paddingHorizontal: 16, alignItems: 'center', marginVertical: 20}}>
          <Text style={[{fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0, color: '#000', textAlign: 'left', width: '100%'}, headerFontStyle]}>{'News'}</Text>
          <Text style={[{fontFamily: 'Poppins-Regular', fontSize: 13, marginLeft: 0, color: '#777', textAlign: 'left', width: '100%', marginBottom: 5}, headerFontStyle]}>
            {'Disclaimer: The news below comes from a News API provider'}
          </Text>
          <FlatList
            horizontal={true}
            data={latestNews}
            renderItem={renderNewsItem}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{justifyContent: 'center'}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DemoHome;
