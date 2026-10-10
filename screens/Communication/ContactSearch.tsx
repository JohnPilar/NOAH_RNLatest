import {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, FlatList, Keyboard, TouchableWithoutFeedback} from 'react-native';

import {EventRegister} from 'react-native-event-listeners';

import {APP_CONST, NmStyles} from '../../constants';
import {NmLabel, NmTextInput, LoadingScreen} from '../../components';
import {NmSearchUser} from '../../functions/NmNetwork';
import {TouchableOpacity} from 'react-native';
import {NmHardwareBackPress, NmStringUCaseTrim} from '../../functions/NmFunctions';

interface ContactSearchProps {
  navigation: any;
}

interface SearchItemData {
  status: string;
  code: string;
  description: string;
}

interface SearchItemProps {
  item: SearchItemData;
  props: ContactSearchProps;
}

export default function ContactSearch(props: ContactSearchProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchCtr, setSearchCtr] = useState<number>(0);
  const [resultData, setResultData] = useState<SearchItemData[]>([]);
  const searchRef = useRef<any>(null);

  useEffect(() => {
    EventRegister.emit('UpdateHeaderTitle', 'New Chat');
    EventRegister.emit('UpdateButtonTitle', APP_CONST.DRWBUTTON_BACK);
  }, []);

  NmHardwareBackPress((): boolean => {
    EventRegister.emit('UpdateHeaderTitle', 'Messaging');
    EventRegister.emit('UpdateButtonTitle', APP_CONST.DRWBUTTON_MENU);
    props.navigation.goBack();
    return true;
  });

  function searchContact(): void {
    setLoading(true);
    NmSearchUser(searchText).then(response => {
      if (response.status == '200') {
        setResultData(response.resultData.Results);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    if (searchCtr == 1) {
      searchContact();
      setSearchCtr(0);
    }
  }, [searchCtr]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {loading && <LoadingScreen />}
        <View style={styles.searchContainer}>
          <NmLabel style={{marginLeft: 5, marginRight: 10}}>{'To:'}</NmLabel>
          <NmTextInput
            ref={searchRef}
            value={searchText}
            onChangeText={setSearchText}
            containerStyle={styles.textContainer}
            placeholder={'Type name or username'}
            clearTextButton={true}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (searchText != '') {
                setSearchCtr(searchCtr + 1);
              }
            }}
            blurOnSubmit={false}
          />
        </View>
        <View style={{flex: 1, backgroundColor: '#f5f5f5ff', borderRadius: 12, marginTop: 6, paddingBottom: 6}}>
          <FlatList
            data={resultData}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{flexGrow: 1}}
            renderItem={({item, index}) => {
              return <SearchItem item={item} props={props} />;
            }}
            style={{width: '100%', padding: 6}}
            ListEmptyComponent={() => {
              return (
                <View style={{flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                  <NmLabel style={[NmStyles.poppinsBold, {fontSize: 16, color: '#CCC'}]}>{'Search a user here'}</NmLabel>
                </View>
              );
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const SearchItem = ({item, props}: SearchItemProps): React.JSX.Element => {
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const userActive = item.status == '1' ? true : false;
  return (
    <TouchableOpacity
      style={styles.contactItem}
      activeOpacity={userActive ? 0.5 : 1}
      onPress={() => {
        if (userActive == true) {
          props.navigation.reset({
            index: 1, // The index of the active route in the routes array
            routes: [
              {name: 'Home'},
              {name: 'MessageList'}, // Route at index 0
              {name: 'MessageThread', params: {userID: NmStringUCaseTrim(item.code), userName: item.description}}, // Route at index 1 (this will be the active route)
            ],
          });
          EventRegister.emit('UpdateHeaderTitle', item.description);
        } else if (userActive == false) {
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
        }
      }}>
      <View style={{flex: 1, justifyContent: 'center', marginLeft: 4}}>
        <NmLabel style={[NmStyles.poppinsBold, {color: userActive ? '#000' : '#E3E3E3'}]} numberOfLines={1}>
          {item.description}
        </NmLabel>
        <NmLabel style={{fontSize: 11, color: '#AAA'}}>{item.code}</NmLabel>
      </View>
      {showMessage && (
        <View style={{width: '100%', height: '100%', position: 'absolute', top: 6, backgroundColor: '#ffffffbd', alignItems: 'center', justifyContent: 'center', borderRadius: 12}}>
          <NmLabel style={[NmStyles.poppinsBold, {color: '#c4c4c4ff'}]} numberOfLines={1}>
            {'User not active'}
          </NmLabel>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    width: undefined,
  },
  contactItem: {
    width: '100%',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    padding: 4,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
});
