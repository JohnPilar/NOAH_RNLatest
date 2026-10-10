import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableHighlight, Dimensions, FlatList} from 'react-native';

import Animated from 'react-native-reanimated';

import {NmButton} from '../../components';
import {ThemesContext} from '../../functions/ThemeContext';
import {NmHardwareBackPress} from '../../functions/NmFunctions';
import {StackScreenProps} from '../../navigation/NavigationTypes';

type Props = StackScreenProps<'ItemScreen'>;

const ItemScreen = ({navigation, route}: Props): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);
  const miniGalleryRef = useRef<FlatList<any> | null>(null);
  const mainImageRef = useRef<FlatList<any> | null>(null);

  const [imageIndex, setImageIndex] = useState<number>(0);

  let windowWidth = Dimensions.get('window').width;

  const ItemObject = route.params?.ItemObject;
  const ItemSubPictures = ItemObject?.backgroundImage;
  const ItemBrand = ItemObject?.itemBrand;
  const ItemName = ItemObject?.itemName;
  const ItemPrice = ItemObject.itemPrice;
  const ItemDesc = ItemObject?.itemDescription;

  NmHardwareBackPress();

  const renderItemPictures = ({item, index}: any): React.JSX.Element => {
    const image = item.backgroundImage == '' ? require('../../assets/Images/NoImage.jpg') : item.backgroundImage;

    return (
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor={'#FFF'}
        onPress={() => {
          navigation.navigate('NmImageViewer', {items: ItemSubPictures, imgIndex: index});
          //Open image in full view here
        }}>
        <Animated.Image
          style={[
            {
              backgroundColor: theme.homeIconBackgroundColor,
              width: windowWidth,
              height: windowWidth,
              justifyContent: 'center',
              overflow: 'hidden',
              resizeMode: 'cover',
            },
          ]}
          source={image}
        />
      </TouchableHighlight>
    );
  };

  const renderSmallGalleryItems = ({item, index}: any): React.JSX.Element => {
    const image = item.backgroundImage == '' ? require('../../assets/Images/NoImage.jpg') : item.backgroundImage;
    const boxLength = windowWidth * 0.2;

    return (
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor={'#FFF'}
        onPress={() => {
          mainImageRef.current?.scrollToIndex({index: index, animated: true});
        }}
        style={{margin: 8}}>
        <View style={{padding: 2, borderRadius: 6, borderWidth: 2, borderColor: index == imageIndex ? '#777' : '#DDD'}}>
          <Image
            style={[
              {
                backgroundColor: theme.homeIconBackgroundColor,
                width: boxLength,
                height: boxLength,
                borderRadius: 6,
                borderColor: '#28396F',
                justifyContent: 'center',
                overflow: 'hidden',
                resizeMode: 'cover',
              },
            ]}
            source={image}
          />
        </View>
      </TouchableHighlight>
    );
  };

  const onViewImageRef = useRef((viewableItems: any) => {
    const newIndex = viewableItems.changed[0].index;
    setImageIndex(newIndex);
  });

  useEffect(() => {
    miniGalleryRef.current?.scrollToIndex({index: imageIndex});
  }, [imageIndex]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{width: '100%'}}>
          <FlatList
            ref={mainImageRef}
            horizontal={true}
            data={ItemSubPictures}
            renderItem={renderItemPictures}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={{backgroundColor: '#FFF'}}
            onViewableItemsChanged={onViewImageRef.current}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 75,
              minimumViewTime: 150,
            }}
          />
        </View>
        <View style={{width: '100%'}}>
          <FlatList
            ref={miniGalleryRef}
            horizontal={true}
            data={ItemSubPictures}
            renderItem={renderSmallGalleryItems}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            viewabilityConfig={{
              minimumViewTime: 150,
            }}
          />
        </View>
        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 10}}>
          <Text style={styles.itemBrand}>{ItemBrand}</Text>
          <Text style={styles.itemPrice}>{ItemPrice}</Text>
        </View>
        <View style={{width: '100%', paddingHorizontal: 16}}>
          <Text style={styles.itemName}>{ItemName}</Text>
          <Text style={styles.itemDescription} numberOfLines={3}>
            {ItemDesc == '' || ItemDesc == undefined ? 'No item description available' : ItemDesc}
          </Text>
        </View>
      </ScrollView>
      <View style={{padding: 5}}>
        <NmButton buttonTheme={'dark'} style={styles.buttonStyle} titleStyle={styles.buttonTextStyle} title="ADD TO CART" onPress={() => {}}></NmButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemBrand: {
    flex: 1,
    color: '#06214D',
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginTop: 4,
  },
  itemName: {
    flex: 1,
    color: '#06214D',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginTop: 0,
  },
  itemPrice: {
    color: '#62618C',
    fontFamily: 'Poppins-Medium',
    paddingLeft: 10,
    fontSize: 24,
    marginTop: 5,
  },
  itemDescription: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginTop: 5,
  },
  buttonStyle: {
    marginTop: 20,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
});

export default ItemScreen;
