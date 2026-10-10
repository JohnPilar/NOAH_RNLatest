import {useContext} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';

import {NmColors} from '../../../constants';
import NmStyles, {WINDOW_WIDTH} from '../../../constants/NmStyles';
import {NmLabel} from '../../../components';
import {TabsContext} from '../../../functions/Contexts';
import {ThemesContext} from '../../../functions/ThemeContext';

const MenuOptions = props => {
  const {setVisible, style, clearCache} = props;
  const {setTabList} = useContext(TabsContext);
  const {theme} = useContext(ThemesContext);

  const optionsStyle = {
    ...NmStyles.fontOpenSans.regular,
    color: theme.textColor,
    fontSize: 15,
  };

  return (
    <Animated.View style={{position: 'absolute', width: '100%', height: '100%', zIndex: 3, bottom: 0}} entering={FadeInDown.duration(80)} exiting={FadeOutDown.duration(80)}>
      <TouchableOpacity style={{flex: 1, backgroundColor: undefined}} activeOpacity={1} onPress={() => setVisible(false)}></TouchableOpacity>
      <TouchableOpacity style={[{paddingHorizontal: 8, width: WINDOW_WIDTH, position: 'absolute', bottom: 0, zIndex: 4}, style]} onPress={() => setVisible(false)} activeOpacity={1}>
        <View
          style={{
            flex: 1,
            borderRadius: 16,
            borderWidth: StyleSheet.hairlineWidth,
            width: '50%',
            borderColor: theme.panelBorder,
            backgroundColor: theme.panelBackground,
            overflow: 'hidden',
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignSelf: 'flex-end',
          }}>
          <TouchableOpacity
            style={{paddingHorizontal: 4, paddingVertical: 8}}
            onPress={() => {
              setVisible(false);
              props.navigation.navigate('HistoryScreen');
            }}>
            <NmLabel style={optionsStyle}>{'History'}</NmLabel>
          </TouchableOpacity>
          <TouchableOpacity
            style={{padding: 4, paddingVertical: 8}}
            onPress={() => {
              setVisible(false);
              setTabList([]);
            }}>
            <NmLabel style={optionsStyle}>{'Close All Tabs'}</NmLabel>
          </TouchableOpacity>
          <TouchableOpacity style={{padding: 4, paddingVertical: 8}} onPress={clearCache}>
            <NmLabel style={optionsStyle}>{'Clear Cache'}</NmLabel>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MenuOptions;
