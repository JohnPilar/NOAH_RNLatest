import {useState} from 'react';
import {StyleSheet, useWindowDimensions, View, TouchableOpacity, Text, Image, FlatList, ViewStyle, TextStyle} from 'react-native';

interface NmImageSliderProps {
  data?: any[];
  headerTitle?: string;
  hideHeader?: boolean;
  removeLastItemMarginRight?: boolean;
  onPress?: (item: any) => void;
  itemContainerStyle?: any;
  mainItemContainerStyle?: any;
  imageContainerStyle?: any;
  imageStyle?: any;
  textContainerStyle?: any;
  textStyle?: any;
  containerStyle?: ViewStyle;
  headerContainerStyle?: ViewStyle;
  headerFontStyle?: TextStyle;
  mainContainerStyle?: ViewStyle;
}

export default function NmImageSlider(props: NmImageSliderProps): React.JSX.Element {
  const {
    data,
    headerTitle,
    hideHeader,
    removeLastItemMarginRight,
    onPress,
    itemContainerStyle,
    mainItemContainerStyle,
    imageContainerStyle,
    imageStyle,
    textContainerStyle,
    textStyle,
    containerStyle,
    headerContainerStyle,
    headerFontStyle,
    mainContainerStyle,
  } = props;

  const {width} = useWindowDimensions();
  const [showError, setShowError] = useState<boolean>(false);

  const items = data;
  const headerTitleText = headerTitle == undefined ? 'Items' : headerTitle;

  const maxIndex = items != undefined ? items.length - 1 : 0;
  const imageContainerBox = (width * 0.5 - 10) / 2;

  const undefinedAction = (): void => {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  const renderItem = ({item, index}: {item: any; index: number}): React.JSX.Element => {
    const itemName = item.itemName;
    const image = item.backgroundImage == '' ? require('../assets/Images/NoImage.jpg') : item.backgroundImage;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        onPress={() => {
          if (props?.onPress == undefined) {
            undefinedAction();
          } else {
            onPress?.(item);
          }
        }}
        style={[{margin: 10}, itemContainerStyle, removeLastItemMarginRight && maxIndex == index && {marginRight: 0}]}>
        <View
          style={[
            {
              width: imageContainerBox,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: '#FFF',
              borderRadius: 12,
              borderColor: '#DDD',
              borderWidth: StyleSheet.hairlineWidth,
            },
            mainItemContainerStyle,
          ]}>
          <View style={[{width: imageContainerBox, height: imageContainerBox}, imageContainerStyle]}>
            <Image source={image} style={[{flex: 1, width: undefined, height: undefined}, imageStyle]} resizeMode="cover" />
          </View>
          <View style={[{width: '100%', padding: 5}, textContainerStyle]}>
            <Text style={[{color: '#000', fontFamily: 'Poppins-Medium', fontSize: 10}, textStyle]} numberOfLines={1}>
              {itemName != '' ? itemName : 'No Item Information'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[{width: '100%', alignItems: 'center', marginTop: 10}, containerStyle]}>
      <View style={[{width: '100%', backgroundColor: 'rgba(19, 53, 97, 0.9)', borderRadius: 12}, headerContainerStyle]}>
        {!hideHeader && <Text style={[{fontFamily: 'Poppins-Medium', fontSize: 20, marginTop: 0, marginLeft: 10, color: '#FFF'}, headerFontStyle]}>{headerTitleText}</Text>}
        <View style={[{width: '100%', backgroundColor: '#FFF', borderRadius: 12}, mainContainerStyle]}>
          {showError && (
            <View style={{flexDirection: 'row', height: 24, width: '100%', justifyContent: 'center', position: 'absolute', bottom: 0, backgroundColor: 'rgba(246,246,246,0.9)', zIndex: 1}}>
              <Text style={{color: '#000', fontFamily: 'Poppins-Medium', fontSize: 16}}>{'Feature is disabled'}</Text>
            </View>
          )}
          <FlatList
            horizontal={true}
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}
          />
        </View>
      </View>
    </View>
  );
}
