import {useState} from 'react';
import {useWindowDimensions, StyleSheet, View, TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface NmShortcutsPanelItem {
  id?: string | number;
  itemType?: string;
  itemName?: string;
  icon?: string;
  screenName?: string;
  [key: string]: any;
}

interface NmShortcutsPanelProps {
  items: NmShortcutsPanelItem[];
  numColumns?: number;
  numRows?: number;
  hideHeader?: boolean;
  headerTitle?: string;
  onPress?: (item: NmShortcutsPanelItem) => void;
  itemContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
}

export default function NmShortcutsPanel(props: NmShortcutsPanelProps): React.JSX.Element {
  const {items, numRows, numColumns = 4, onPress, itemContainerStyle, textStyle, containerStyle, mainContainerStyle} = props;
  const {width, height} = useWindowDimensions();

  let itemsVal: NmShortcutsPanelItem[] = items;
  let numRowsVal: number = numRows == undefined ? 1 : numRows;
  const hideHeader = props.hideHeader;
  const headerTitle = props.headerTitle;

  const [showError, setShowError] = useState<boolean>(false);

  const imageContainerBox = (width * 0.75) / numColumns;

  const undefinedAction = (): void => {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  if (itemsVal.length < numColumns * numRowsVal) {
    if (itemsVal.length < numColumns) {
      numRowsVal = 1;
    }

    let tmpCtr = 0;
    let countRowCol = numColumns * numRowsVal - itemsVal.length;

    do {
      itemsVal.push({
        itemType: 'ITEM_PLACEHOLDER',
      });
      tmpCtr += 1;
    } while (tmpCtr < countRowCol);
  }

  if (itemsVal.length > numColumns * numRowsVal) {
    itemsVal = itemsVal.slice(0, numColumns * numRowsVal - 1);
    itemsVal.push({
      itemName: 'More',
      icon: 'dots-horizontal',
      screenName: 'Test',
    });
  }

  let tmpItems: NmShortcutsPanelItem[] = [];
  let rowCounter = 0;
  let columnCounter = 0;
  let itemCounter = 0;

  const renderRowItem = (rowItems: NmShortcutsPanelItem[], rowIndex: number): React.JSX.Element => {
    tmpItems = [];

    return (
      <View key={rowIndex} style={{flexDirection: 'row', justifyContent: 'center'}}>
        {rowItems.map(item => {
          if (item.itemType == 'ITEM_PLACEHOLDER') {
            return (
              <View key={item.id} style={{padding: 5, alignItems: 'center', opacity: 0}}>
                <View
                  style={{
                    margin: 2,
                    width: imageContainerBox,
                    height: imageContainerBox,
                    backgroundColor: '#FFF',
                  }}></View>
              </View>
            );
          } else {
            return (
              <View key={item.id} style={{padding: 5, alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (props.onPress == undefined) {
                      undefinedAction();
                    } else {
                      onPress?.(item);
                    }
                  }}
                  style={[
                    {
                      margin: 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: imageContainerBox,
                      height: imageContainerBox,
                      backgroundColor: '#FFF',
                      borderRadius: 12,
                      borderColor: '#DDD',
                      borderWidth: StyleSheet.hairlineWidth,
                    },
                    itemContainerStyle,
                  ]}>
                  <MaterialCommunityIcons style={{paddingHorizontal: 5, marginHorizontal: 5}} name={item.icon || ''} size={imageContainerBox / 2.5} color={'#133561'} />
                </TouchableOpacity>
                <View style={{width: imageContainerBox, alignItems: 'center'}}>
                  <Text style={[{flex: 1, color: '#000', fontFamily: 'Poppins-Regular', fontSize: 11, marginTop: 2}, textStyle]} numberOfLines={1}>
                    {item.itemName}
                  </Text>
                </View>
              </View>
            );
          }
        })}
        {/* </View> */}
      </View>
    );
  };

  return (
    <View style={[{width: '100%', marginTop: 10}, containerStyle]}>
      {!hideHeader && <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18, marginLeft: 0}}>{headerTitle}</Text>}
      <View style={[{backgroundColor: '#F6F6F6', width: '100%', borderRadius: 12, paddingVertical: 5, overflow: 'hidden'}, mainContainerStyle]}>
        {showError && (
          <View style={{flexDirection: 'row', height: 24, width: '100%', justifyContent: 'center', position: 'absolute', top: 0, backgroundColor: 'rgba(246,246,246,0.8)', zIndex: 1}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Medium', fontSize: 16}}>{'Feature is disabled'}</Text>
          </View>
        )}
        {itemsVal.length > 0 &&
          itemsVal.map((item, index) => {
            item.id = index;
            tmpItems.push(item);

            columnCounter += 1;
            itemCounter += 1;

            if (columnCounter == numColumns || itemCounter == itemsVal.length) {
              rowCounter += 1;
              columnCounter = 0;
              return renderRowItem(tmpItems, rowCounter);
            }
          })}
      </View>
    </View>
  );
}
