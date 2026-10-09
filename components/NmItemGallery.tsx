import {useState} from 'react';
import {useWindowDimensions, StyleSheet, View, TouchableOpacity, Image, Text, FlatList, Linking, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface NmItemGalleryProps {
  data: any[];
  numColumns?: number;
  children?: React.ReactNode;
  itemContainerStyle?: any;
  containerStyle?: ViewStyle;
}

export default function NmItemGallery(props: NmItemGalleryProps): React.JSX.Element {
  const {width} = useWindowDimensions();
  const {data, numColumns, children, itemContainerStyle, containerStyle} = props;

  const itemData = data;
  const numColumnsVal = numColumns == undefined ? 2 : numColumns;
  const navigation = useNavigation<any>();

  const [itemHeight, setItemHeight] = useState<number>();

  const items = itemData.slice();

  if (items.length > 0) {
    const r = items.length % numColumnsVal;
    if (r > 0) {
      for (let i = 0; i < numColumnsVal - r; i++) {
        items.push({emptyId: 1, itemId: 'E'.concat(i.toString())});
      }
    }
  }

  const headerItems = (): React.ReactNode => {
    return children;
  };

  const renderItem = ({item, index}: {item: any; index: number}): React.JSX.Element => {
    const imageContainerBox = (width - 32 - 10) / numColumnsVal;

    return item?.emptyId != undefined ? (
      <View style={{width: imageContainerBox + 10, height: itemHeight}}></View>
    ) : (
      <View key={index} style={[{padding: 5, paddingTop: 0, paddingBottom: 10}, itemContainerStyle]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPressIn={() => {}}
          onPressOut={() => {}}
          //onTouchStart={() => {}}
          //onTouchEnd={() => {}}
          onPress={() => {
            if (item.app != '') {
              Linking.openURL(item.app).catch(() => {
                // try {
                //   props.navigation.navigate(item.app, {source: item.backgroundImage[0].backgroundImage});
                // } catch (error) {
                //   //
                // }
              });
            }

            if (item?.itemPrice != 'Free') {
              navigation.navigate('ItemScreen', {ItemObject: item});
            }
          }}>
          <View style={[styles.gridItem, {width: imageContainerBox}]}>
            <View style={{height: imageContainerBox, width: imageContainerBox, padding: 10}}>
              <Image source={item.backgroundImage[0].backgroundImage} resizeMode="cover" style={{flex: 1, width: undefined, height: undefined, borderRadius: 12}} />
            </View>
            <View style={{width: '100%', padding: 10, paddingTop: 0}}>
              <Text style={[styles.gridItemBrand, {}]} numberOfLines={1}>
                {item.itemBrand != '' ? item.itemBrand : 'Unknown item brand'}
              </Text>
              <Text style={[styles.gridItemName, {}]} numberOfLines={1}>
                {item.itemName != '' ? item.itemName : 'Unknown item name'}
              </Text>
              <Text style={[styles.gridItemPrice, {}]} numberOfLines={1}>
                {item.itemPrice != undefined ? item.itemPrice : 'Unknown price'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[{width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10}, containerStyle]}>
      <FlatList
        key={numColumnsVal}
        ListHeaderComponent={headerItems}
        ListHeaderComponentStyle={{alignItems: 'center'}}
        data={items}
        horizontal={false}
        numColumns={numColumnsVal}
        renderItem={renderItem}
        keyExtractor={item => item.itemId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderColor: '#DDD',
    borderWidth: StyleSheet.hairlineWidth,
  },
  gridItemBrand: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
  },
  gridItemName: {
    color: '#777',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  gridItemPrice: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});
