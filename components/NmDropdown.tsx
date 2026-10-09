import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {DimensionValue, FlatList, Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useDeviceOrientation} from '../functions/NmFunctions';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import {NmLabel} from './NmComponents';
import {NmStyles} from '../constants';
import {THEME_STYLE} from '../constants/NmConstants';
import {ThemesContext} from '../functions/ThemeContext';
import {UIConfig} from '../Global/UIConfig';

interface DropdownItemType {
  value: any;
  label: string;
  [key: string]: any;
}

interface NmDropdownProps {
  value?: any;
  setValue?: (value: any) => void;
  items?: DropdownItemType[];
  label?: string;
  componentStyle?: any;
  containerStyle?: any;
  iconStyle?: any;
  disabled?: boolean;
  labelStyle?: any;
  selectedValueStyle?: any;
  onPress?: (...args: any[]) => any;
  setFirstModal?: (value: boolean) => void;
  blankDefault?: boolean;
  itemStyle?: any;
  itemTextStyle?: any;
  modalStyle?: any;
  mainContainerStyle?: any;
}

interface DropdownItemProps {
  item: DropdownItemType;
  theme: any;
  itemStyle?: any;
  itemTextStyle?: any;
  onSelect: (item: DropdownItemType) => void;
}

export default function NmDropdown(props: NmDropdownProps): React.JSX.Element {
  const {value, setValue, items, label, componentStyle, containerStyle, iconStyle, disabled, labelStyle, selectedValueStyle, onPress, setFirstModal, blankDefault} = props || {};

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');
  const {theme} = useContext(ThemesContext);

  const orientation = useDeviceOrientation();
  const useStyle = componentStyle ? componentStyle : THEME_STYLE.STYLE_ORIG;

  const displayValue = useMemo((): string => {
    if (!items || items.length == 0) return '';

    const selectedItem = items.find((p: DropdownItemType) => p.value == value);
    return selectedItem?.label ?? (blankDefault ? '' : items[0]?.label);
  }, [value]);

  useEffect((): void => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }
  }, [orientation]);

  const handleSelect = useCallback(
    (item: DropdownItemType): void => {
      if (onPress == undefined) {
        setValue?.(item.value);
      } else {
        setValue?.(item);
      }
      setModalVisible(false);
    },
    [onPress, setValue],
  );

  const keyExtractor = useCallback((item: DropdownItemType, index: number): string => index.toString(), []);

  const renderItem = useCallback(
    ({item}: {item: DropdownItemType}): React.JSX.Element => <DropdownItem item={item} theme={theme} itemStyle={props.itemStyle} itemTextStyle={props.itemTextStyle} onSelect={handleSelect} />,
    [theme],
  );

  return (
    <View>
      <Modal
        propagateSwipe={true}
        isVisible={modalVisible}
        backdropOpacity={0.3}
        onBackdropPress={() => setModalVisible(false)}
        style={[{alignItems: 'center', justifyContent: 'center', margin: 0}, props.modalStyle]}
        //backdropColor={'white'}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => setModalVisible(false)}>
        <View style={{width: screenWidth, alignItems: 'center', justifyContent: 'center', maxHeight: 300, paddingHorizontal: 20, overflow: 'hidden'}}>
          <View
            style={[{width: '100%', backgroundColor: theme.dropdownListBackground, paddingTop: 4, borderRadius: 12, overflow: 'hidden'}, props.mainContainerStyle]}
            onStartShouldSetResponder={() => true}>
            <FlatList
              //contentContainerStyle={{flexGrow: 1, height: '100%'}}
              data={items}
              bounces={false}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              horizontal={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          </View>
        </View>
      </Modal>

      {useStyle == THEME_STYLE.STYLE_ORIG && (
        <TouchableOpacity
          onPress={() => {
            setFirstModal?.(false);
            setModalVisible(true);
          }}
          style={[
            styles.dropdownContainer,
            {
              backgroundColor: disabled ? theme.dropdownBackgroundDisabled : theme.dropdownBackground,
              borderColor: theme.dropdownBorder,
            },
            containerStyle,
          ]}
          disabled={disabled}>
          <Text style={[styles.dropdownSelectedValue, selectedValueStyle, {color: theme.textColor}]} numberOfLines={1}>
            {displayValue}
          </Text>
          <Image source={UIConfig.DropdownIcon} style={[{height: 20, width: 20, resizeMode: 'contain', tintColor: '#466DC6', marginRight: 10}, iconStyle]} />
        </TouchableOpacity>
      )}

      {useStyle == THEME_STYLE.STYLE_THIRD && (
        <View style={{width: '100%', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              setFirstModal?.(false);
              setModalVisible(true);
            }}
            disabled={disabled}
            style={[{flexDirection: 'row'}, containerStyle]}>
            <View style={{flex: 1}}>
              <NmLabel style={[NmStyles.fontOpenSans.light, {fontSize: 16}, labelStyle]}>{label}</NmLabel>
              <NmLabel style={[NmStyles.fontOpenSans.bold, selectedValueStyle]}>{displayValue}</NmLabel>
              {/* displayValue */}
            </View>
            <Image source={UIConfig.DropdownIcon} style={[{height: 20, width: 20, resizeMode: 'contain', tintColor: '#1974D1', transform: [{rotate: '-90deg'}], alignSelf: 'center'}, iconStyle]} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

interface DropdownItemProps {
  item: DropdownItemType;
  theme: any;
  itemStyle?: any;
  itemTextStyle?: any;
  onSelect: (item: DropdownItemType) => void;
}

const DropdownItem = React.memo(
  ({item, theme, itemStyle, itemTextStyle, onSelect}: DropdownItemProps): React.JSX.Element => (
    <TouchableOpacity style={[styles.dropdownItemContainer, {borderColor: theme.dropdownSeparator}, itemStyle]} onPress={() => onSelect(item)}>
      <Text style={[styles.dropdownItemStyle, {color: theme.textColor}, itemTextStyle]} numberOfLines={1}>
        {item.label}
      </Text>
    </TouchableOpacity>
  ),
);

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 6,
    overflow: 'hidden',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownSelectedValue: {
    marginTop: 2,
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  dropdownItemContainer: {
    borderBottomWidth: 1,
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
