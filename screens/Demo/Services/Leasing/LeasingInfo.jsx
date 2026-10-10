import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, Image, FlatList, TouchableOpacity, BackHandler} from 'react-native';

import Animated, {interpolateColor, interpolate, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler} from 'react-native-reanimated';

import NmStyles, {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmButton, NmModalOptions} from '../../../../components';
import {LeasingContext} from '../../../../functions/Contexts';
import {NmHardwareBackPress} from '../../../../functions/NmFunctions';

export default function LeasingInfo(props) {
  const leaseContext = useContext(LeasingContext);

  const unitCode = props?.route?.params?.unitInfo;
  const unitInfo = leaseContext.filter(item => item.unitCode == unitCode)[0];

  const imgDimensions = WINDOW_WIDTH * 0.46;
  const unitImages = unitInfo.unitImages;

  const [headerHeight, setHeaderHeight] = useState(WINDOW_WIDTH * 0.15);
  const fullOffset = WINDOW_WIDTH - headerHeight;

  const [detailMinHeight, setDetailMinHeight] = useState(undefined);
  const [tmpheight, setTmpheight] = useState();

  const [showManageModal, setShowManageModal] = useState(false);

  const colorOffset = useSharedValue(0);

  const animHeaderBGColor = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(colorOffset.value, [0, fullOffset], ['#FFFFFFBB', '#FFFFFFFF']),
    };
  });

  const animImageOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(colorOffset.value, [0, fullOffset - headerHeight], [1, 0]),
    };
  });

  const scrollHandler = useAnimatedScrollHandler(event => {
    colorOffset.value = event.contentOffset.y;
  });

  useEffect(() => {
    if (tmpheight != undefined) {
      setDetailMinHeight(tmpheight - headerHeight);
    }
  }, [headerHeight]);

  NmHardwareBackPress();

  const manageOptions = [
    // {label: 'Edit Unit Images', value: 'UNIT_EDIT', disabled: unitInfo.unitStatus == 'Active' ? true : false, itemStyle: {color: unitInfo.unitStatus == 'Active' ? '#CCC' : '#000'}},
    {label: 'Edit Unit Images', value: 'UNIT_EDIT'},
    {label: 'Change Status', value: 'UNIT_STAT'},
    {label: 'Remove Property', value: 'UNIT_REM', itemStyle: {color: unitInfo.unitStatus == 'Active' ? 'rgba(255,0,0,0.3)' : 'red'}, disabled: unitInfo.unitStatus == 'Active' ? true : false},
  ];

  const renderImages = ({item, index}) => {
    const imgSrc = item?.uri == undefined ? item.img : {uri: item.uri};

    return (
      <TouchableOpacity style={{width: imgDimensions, height: imgDimensions, padding: 5, paddingLeft: index == 0 ? 0 : 5, paddingRight: index == unitImages.length - 1 ? 0 : 5}} activeOpacity={0.7}>
        <Image source={imgSrc} style={{flex: 1, width: undefined, height: undefined, resizeMode: 'cover', borderRadius: 12}} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={event => {
        const {x, y, width, height} = event.nativeEvent.layout;
        setTmpheight(height);
      }}>
      <NmModalOptions
        items={manageOptions}
        itemStyle={{color: '#000', marginLeft: 5}}
        dropdownItemContainerStyle={{paddingVertical: 15, height: undefined}}
        mainContainerStyle={{borderRadius: 12}}
        optionsVisible={showManageModal}
        setOptionsVisible={setShowManageModal}
        onPress={item => {
          if (item.value == 'UNIT_EDIT') {
            setShowManageModal(false);
            props.navigation.navigate('LeasingAddUnits', {editInfo: unitInfo});
          }
        }}
      />
      <Animated.ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]} onScroll={scrollHandler}>
        <View style={{}}>
          <Animated.Image source={unitInfo.unitImage} style={[{width: WINDOW_WIDTH, height: fullOffset, backgroundColor: '#FFF'}, animImageOpacity]} resizeMode="cover" />
        </View>
        <View style={[{width: '100%', marginTop: -headerHeight, height: undefined}]}>
          <Animated.View
            style={[{flex: 1, paddingHorizontal: 16, justifyContent: 'center', paddingVertical: 10}, animHeaderBGColor]}
            onLayout={event => {
              const {x, y, width, height} = event.nativeEvent.layout;
              setHeaderHeight(height);
            }}>
            <Text style={[NmStyles.poppinsBold, {fontSize: 22}]} numberOfLines={1}>
              {unitInfo.unitName}
            </Text>
            <Text style={[NmStyles.poppinsMedium, {fontSize: 20, marginTop: -7}]} numberOfLines={1}>
              {unitInfo.unitNumber}
            </Text>
          </Animated.View>
        </View>
        <View style={{minHeight: detailMinHeight, width: '100%', paddingHorizontal: 16}}>
          <View style={{width: '100%', marginTop: 10}}>
            <Text style={[NmStyles.poppinsRegular, {fontSize: 18}]}>{'Address:'}</Text>
            <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{unitInfo.unitAddress}</Text>
          </View>

          <View style={{width: '100%', marginTop: 10}}>
            <Text style={[NmStyles.poppinsRegular, {fontSize: 18}]}>{'Status:'}</Text>
            <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{unitInfo.unitStatus}</Text>
          </View>

          <View style={{width: '100%', marginTop: 10}}>
            <Text style={[NmStyles.poppinsRegular, {fontSize: 18}]}>{'Lessee:'}</Text>
            <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{unitInfo.unitLessee}</Text>
          </View>

          <View style={{width: '100%', marginTop: 10}}>
            <Text style={[NmStyles.poppinsRegular, {fontSize: 18}]}>{'Phone:'}</Text>
            <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{unitInfo.lesseePhone}</Text>
          </View>

          <View style={{width: '100%', marginTop: 10}}>
            <Text style={[NmStyles.poppinsRegular, {fontSize: 18}]}>{'Email:'}</Text>
            <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{unitInfo.lesseeEmail}</Text>
          </View>

          <View style={{width: '100%', marginTop: 10}}>
            <Text style={[NmStyles.poppinsRegular, {fontSize: 18}]}>{'Contract Expiration:'}</Text>
            <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{unitInfo.contractExpiration}</Text>
          </View>

          <View style={{width: '100%', marginTop: 10}}>
            <Text style={[NmStyles.poppinsRegular, {fontSize: 18}]}>{'Gallery:'}</Text>
            {unitImages.length > 0 ? (
              <FlatList data={unitImages} renderItem={renderImages} keyExtractor={(item, index) => index} horizontal={true} />
            ) : (
              <Text style={[NmStyles.poppinsBold, {fontSize: 18}]}>{'No Images Provided'}</Text>
            )}
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <NmButton
              buttonTheme={'dark'}
              style={{borderRadius: 12, marginVertical: 10}}
              titleStyle={{}}
              title="Manage"
              onPress={() => {
                setShowManageModal(true);
              }}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
