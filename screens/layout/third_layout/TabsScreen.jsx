import {useState, useContext, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback, Keyboard, BackHandler, Image} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {TabsContext} from '../../../functions/Contexts';
import {NmLabel, NmTextInput} from '../../../components/index';
import {WINDOW_HEIGHT} from '../../../constants/NmStyles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ThemesContext} from '../../../functions/ThemeContext';
import {NmHardwareBackPress} from '../../../functions/NmFunctions';

const TabsScreen = props => {
  const {tabList, setTabList, setActiveTabKey} = useContext(TabsContext);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const [tabData, setTabdata] = useState([]);
  const isFocused = useIsFocused();
  const {theme} = useContext(ThemesContext);

  useEffect(() => {
    if (isFocused) {
      setActiveTabKey(undefined);
    }
  }, [isFocused]);

  useEffect(() => {
    manageTabData();
  }, [tabList]);

  useEffect(() => {
    if (searchText != '') {
      const filteredTabs = tabList.filter(data => {
        const lowTitle = data.title.toLowerCase();
        const lowSearch = searchText.toLocaleLowerCase();
        return lowTitle.includes(lowSearch);
      });

      if (filteredTabs.length % 2 == 0) {
        setTabdata(filteredTabs);
      } else {
        const tmpTabs = [...filteredTabs];
        tmpTabs.push({key: 'BLANK', name: 'SPACE'});
        setTabdata(tmpTabs);
      }
    } else {
      manageTabData();
    }
  }, [searchText]);

  function manageTabData() {
    if (tabList.length % 2 == 0) {
      setTabdata(tabList);
    } else {
      addBlankSpace();
    }
  }

  function addBlankSpace() {
    const tmpTabs = [...tabList];
    tmpTabs.push({key: 'BLANK', name: 'SPACE'});
    setTabdata(tmpTabs);
  }

  NmHardwareBackPress();

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1, padding: 8, height: WINDOW_HEIGHT / 4}}>
        {item.key != 'BLANK' && (
          <View
            style={{flex: 1, backgroundColor: theme.screenBackground, borderRadius: 12, borderWidth: 1, borderColor: theme.tabBorder, overflow: 'hidden'}}
            onLayout={event => {
              const {x, y, width, height} = event.nativeEvent.layout;
              //setTmpheight(height);
            }}>
            <View style={{width: '100%', justifyContent: 'center', backgroundColor: '#1974D1', flexDirection: 'row'}}>
              <NmLabel numberOfLines={1} style={{marginLeft: 8, marginTop: 4, marginBottom: 2, color: '#FFF', flex: 1}}>
                {item.title}
              </NmLabel>
              <TouchableOpacity
                activeOpacity={0.6}
                style={{justifyContent: 'center', paddingRight: 4}}
                onPress={() => {
                  let tmpTabs = [...tabList];
                  const updatedTabs = tmpTabs.filter(tab => tab.key != item.key);
                  setTabList(updatedTabs);
                }}>
                <MaterialCommunityIcons name={'close'} style={{}} size={18} color={'#FFF'} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{flex: 1, backgroundColor: '#FFF', overflow: 'hidden', alignItems: 'flex-start'}}
              activeOpacity={0.6}
              onPress={() => {
                setSearchText('');
                setActiveTabKey(item);
                navigation.navigate(item.key);
              }}>
              {item?.snapshot && <Image source={{uri: item.snapshot}} style={{flex: 1, width: '100%'}} resizeMode="cover" />}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    // <SafeAreaView style={{flex: 1, backgroundColor: 'blue'}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, {backgroundColor: theme.statusBar}]}>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <View style={{flex: 1}}>
            <NmTextInput
              containerStyle={{marginTop: 0, borderRadius: 12, width: undefined, backgroundColor: theme.panelBackground, borderColor: theme.panelBorder}}
              textInputStyle={{fontFamily: 'Poppins-Medium', color: theme.textColor}}
              placeholder="Search your tabs"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <View
          style={{flex: 1, backgroundColor: theme.panelBackground, borderRadius: 12, overflow: 'hidden', marginTop: 16}}
          onLayout={event => {
            const {x, y, width, height} = event.nativeEvent.layout;
          }}>
          <FlatList contentContainerStyle={{flexGrow: 1}} numColumns={2} showsVerticalScrollIndicator={false} data={tabData} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
        </View>
      </View>
    </TouchableWithoutFeedback>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default TabsScreen;
