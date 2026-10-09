import {StyleSheet, View, Text, FlatList, TouchableOpacity, StyleProp, ViewStyle, TextStyle, ListRenderItem} from 'react-native';

import Modal from 'react-native-modal';

interface NmModalOptionsItem {
  value?: string | number;
  label: string;
  disabled?: boolean;
  itemStyle?: StyleProp<TextStyle>;
  [key: string]: any;
}

interface NmModalOptionsProps {
  items: NmModalOptionsItem[];
  optionsVisible: boolean;
  setOptionsVisible: (visible: boolean) => void;
  onPress?: (item: NmModalOptionsItem) => void;
  dropdownItemContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<TextStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  HeaderTitle?: string;
  headerContainerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<TextStyle>;
}

export default function NmModalOptions(props: NmModalOptionsProps): React.JSX.Element {
  const {items, optionsVisible, setOptionsVisible, onPress, dropdownItemContainerStyle, itemStyle, modalStyle, mainContainerStyle, containerStyle, HeaderTitle, headerContainerStyle, headerStyle} =
    props;

  const renderItem: ListRenderItem<NmModalOptionsItem> = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={item?.disabled}
        key={index}
        style={[styles.dropdownItemContainer, dropdownItemContainerStyle]}
        onPress={() => {
          if (onPress == undefined) {
            return;
          }
          onPress(item);
        }}>
        <Text style={[styles.dropdownItemStyle, itemStyle, item?.itemStyle]} numberOfLines={1}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      propagateSwipe={true}
      isVisible={optionsVisible}
      backdropOpacity={0.3}
      onBackdropPress={() => setOptionsVisible(false)}
      style={[{alignItems: 'center', justifyContent: 'center', margin: 0}, modalStyle]}
      //backdropColor={'white'}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      onBackButtonPress={() => setOptionsVisible(false)}>
      <View style={[{alignItems: 'center', justifyContent: 'center', width: '100%', maxHeight: 300, paddingHorizontal: 20}, containerStyle]}>
        <View style={[{width: '100%', backgroundColor: '#FFF', overflow: 'hidden'}, mainContainerStyle]} onStartShouldSetResponder={() => true}>
          {HeaderTitle != undefined && (
            <View style={[{}, headerContainerStyle]}>
              <Text style={[{color: '#000', fontFamily: 'Poppins-Medium'}, headerStyle]}>{HeaderTitle}</Text>
            </View>
          )}
          <FlatList contentContainerStyle={{flexGrow: 1, height: '100%'}} data={items} bounces={false} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} horizontal={false} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdownItemContainer: {
    borderBottomWidth: 1,
    borderColor: '#f4f4f4',
    paddingVertical: 10,
    justifyContent: 'center',
    fontFamily: 'Poppins-Regular',
  },
  dropdownItemStyle: {
    paddingHorizontal: 10,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
});
