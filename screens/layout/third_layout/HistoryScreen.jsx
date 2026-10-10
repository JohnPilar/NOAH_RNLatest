import {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, SectionList} from 'react-native';

import {NmLabel, NmTextInput} from '../../../components';
import {TabsContext} from '../../../functions/Contexts';
import {NmCreateSectionData, NmGetTimeStamp} from '../../../functions/NmFunctions';
import {NmStyles} from '../../../constants';
import {useIsFocused, useNavigation} from '@react-navigation/native';

var XDate = require('xdate');

const HistoryScreen = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [searchText, setSearchText] = useState('');
  const {tabList, setTabList, setActiveTabKey, history, storedHistory, actHistory} = useContext(TabsContext);

  const [localHistory, setLocalHistory] = useState([]);
  const [newScreenName, setNewScreenName] = useState();

  useEffect(() => {
    setLocalHistory(history);
  }, [history]);

  useEffect(() => {
    if (searchText != '') {
      const filterHistory = storedHistory.filter(item => {
        const lowTitle = item.title.toLowerCase();
        const lowSearch = searchText.toLocaleLowerCase();
        return lowTitle.includes(lowSearch);
      });
      const sectionData = NmCreateSectionData(filterHistory);
      setLocalHistory(sectionData);
    } else {
      setLocalHistory(history);
    }
  }, [searchText]);

  const createAndNavigate = tabObject => {
    actHistory({
      dateTime: new XDate().toString('yyyy-MM-dd'),
      title: tabObject.title,
      link: tabObject.link,
    });

    const tmpTabs = [...tabList];
    tmpTabs.push(tabObject);
    setTabList(tmpTabs);
    setNewScreenName(tabObject.key);
  };

  useEffect(() => {
    if (newScreenName) {
      const isNewScreenRegistered = tabList.some(tab => tab.key == newScreenName);
      const screenIndex = tabList.findIndex(tab => tab.key == newScreenName);

      if (isNewScreenRegistered) {
        navigation.navigate(newScreenName, {...tabList[screenIndex]}); //, {otherLink: tabList[screenIndex].otherLink, webLink: tabList[screenIndex].webLink});
        setNewScreenName(null);
        setActiveTabKey(tabList[screenIndex]);
      }
    }
  }, [tabList.length, newScreenName, navigation]);

  function navigateWeb(title, link, linkProps = {}) {
    const keyName = NmGetTimeStamp();
    const tabObject = {
      key: keyName + '',
      tabKey: keyName + '',
      title: title,
      snapshot: undefined,
      //otherLink: true, //For Testing non NOAH links
      //webLink: 'link', //For Testing non NOAH links
      link: link,
      ...linkProps,
    };

    createAndNavigate(tabObject);
  }

  const renderHeader = ({section: {title}}) => {
    return (
      <View style={{width: '100%', paddingHorizontal: 12}}>
        <NmLabel style={[NmStyles.fontOpenSans.bold, {fontSize: 14}]}>{title}</NmLabel>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{width: '100%', paddingVertical: 1, paddingHorizontal: 8}}>
        <TouchableOpacity
          style={{padding: 4}}
          onPress={() => {
            navigateWeb(item.title, item.link);
          }}>
          <NmLabel style={[NmStyles.fontOpenSans.regular]}>{item.title}</NmLabel>
          <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 12}]} numberOfLines={1}>
            {item.link}
          </NmLabel>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', marginTop: 8}}>
        <View style={{flex: 1}}>
          <NmTextInput
            containerStyle={{marginTop: 0, borderRadius: 12, width: undefined}}
            textInputStyle={{fontFamily: 'Poppins-Medium'}}
            placeholder="Search history"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View
        style={{flex: 1, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', marginTop: 16, paddingVertical: 8}}
        onLayout={event => {
          const {x, y, width, height} = event.nativeEvent.layout;
        }}>
        {/* <FlatList contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false} data={history} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} /> */}

        <SectionList contentContainerStyle={{flexGrow: 1}} sections={localHistory} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} renderSectionHeader={renderHeader} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default HistoryScreen;
