import React, {useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {getImage} from '../assets/Mapping/DrawerIcons';
import {ThemesContext} from '../functions/ThemeContext';

interface NmDrawerItemProps {
  disabled?: boolean;
  type?: string;
  iconName?: string;
  title?: string;
  customClick?: () => void;
  containerStyle?: any;
  itemContainerStyle?: any;
  textStyle?: any;
  customChild?: React.ReactNode;
}

const NmDrawerItem = (props: NmDrawerItemProps): React.JSX.Element => {
  const {containerStyle, itemContainerStyle, textStyle, customChild, disabled, type, iconName, customClick, title} = props;
  const {theme} = useContext(ThemesContext);
  const itemDisabled = disabled;

  let islist: boolean = true;
  if (type == '1') islist = false;
  const imgSrc = getImage(iconName);

  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={customClick}>
      <View style={[styles.titleContainer, itemContainerStyle]}>
        {imgSrc == undefined ? (
          <MaterialCommunityIcons name="file-document-edit-outline" size={22} color={'#3366cc'} style={{paddingRight: 3}} />
        ) : (
          <Image source={getImage(iconName)} style={[styles.boxImage, {tintColor: itemDisabled ? '#7F8083' : '#36559B', marginLeft: 0}]} />
        )}
        <Text style={[styles.title, {color: itemDisabled ? '#7F8083' : theme.drawerItemTextColor}, textStyle]}>{title}</Text>
      </View>

      {islist && (
        <View>
          <MaterialCommunityIcons name="menu-right-outline" size={15} color={theme.color} style={{paddingRight: 3}} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxImage: {
    width: 25,
    height: 25,
    tintColor: '#7A95D6',
  },
  titleContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontFamily: 'Poppins-Regular',
    marginLeft: 25,
    fontSize: 13,
  },
});

export default NmDrawerItem;
