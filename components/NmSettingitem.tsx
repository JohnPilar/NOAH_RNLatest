import {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NmCheckbox from './NmCheckbox';
import {useContext} from 'react';
import {ThemesContext} from '../functions/ThemeContext';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

export const NmSettingItem = (props: any) => {
  const {theme} = useContext(ThemesContext);
  const {
    onPress,
    disabled,
    style,
    activeOpacity,
    animatedIcon,
    showCheck,
    setShowCheck,
    imageIcon,
    imageTint,
    materialIcon,
    iconSize,
    iconStyle,
    iconColor,
    title,
    titleStyle,
    description,
    descriptionStyle,
    isSwitch,
    switchValue,
    setSwitch,
    materialRightIcon,
    rightIconName,
    rightIconStyle,
    noImageTint,
  } = props || {};

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.settingContainer, {backgroundColor: theme.homeIconBackgroundColor}, style]} activeOpacity={activeOpacity || 0.8}>
      {materialIcon && (
        <View style={[styles.boxImageContainer, {padding: 5}]}>
          <MaterialCommunityIcons
            name={materialIcon || 'cog-outline'}
            size={iconSize || 21}
            style={[styles.boxImage, {width: undefined, height: undefined}, iconStyle]}
            color={iconColor || '#1974D1'}
          />
        </View>
      )}

      {animatedIcon && (
        <View style={[styles.boxImageContainer, {padding: 5}]}>
          <View>
            <AnimatedCheckSetting visible={showCheck} setVisible={setShowCheck}>
              <MaterialCommunityIcons name={animatedIcon} size={21} style={[styles.boxImage, {width: undefined, height: undefined}]} color={'#1974D1'} />
            </AnimatedCheckSetting>
          </View>
        </View>
      )}

      {imageIcon && (
        <View style={styles.boxImageContainer}>
          <Image source={imageIcon} style={[styles.boxImage, {tintColor: noImageTint ? undefined : imageTint || '#1974D1'}]} />
        </View>
      )}

      <View style={{justifyContent: 'center', flex: 1}}>
        <Text style={[styles.settingName, {color: theme.color}, titleStyle]}>{title}</Text>
        {description && <Text style={[styles.settingDescription, descriptionStyle]}>{description}</Text>}
      </View>

      {isSwitch && (
        <View style={{justifyContent: 'center', padding: 10}}>
          <NmCheckbox value={switchValue} onValueChange={setSwitch} style={{transform: Platform.OS == 'ios' ? [{scaleX: 0.66}, {scaleY: 0.66}] : undefined, width: undefined}} />
        </View>
      )}

      {materialRightIcon && (
        <View style={{justifyContent: 'center', padding: 10}}>
          <MaterialCommunityIcons name={rightIconName || 'arrow-right'} size={25} color={'#1974D1'} style={[{marginRight: 3}, rightIconStyle]} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const AnimatedCheckSetting = ({visible, setVisible, children}: any) => {
  const [checkVisible, setCheckVisible] = useState<boolean>(true);

  if (visible == true) {
    setTimeout(() => {
      setCheckVisible(false);
      setTimeout(() => {
        setVisible(false);
        setCheckVisible(true);
      }, 2000);
    }, 250);
  }

  return (
    <View>
      {checkVisible && (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(250)}>
          {children}
        </Animated.View>
      )}
      {!checkVisible && (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(250)}>
          <MaterialCommunityIcons name="check-circle" size={21} style={[styles.boxImage, {width: undefined, height: undefined}]} color={'#1974D1'} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 5,
    elevation: 1.5,
    borderRadius: 6,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  settingName: {
    color: '#13151B',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A4A8B0',
  },
  boxImageContainer: {
    backgroundColor: '#1974D110',
    borderRadius: 6,
    margin: 10,
  },
  boxImage: {
    width: 30,
    height: 30,
    margin: 2,
    resizeMode: 'contain',
  },
});

export default NmSettingItem;
