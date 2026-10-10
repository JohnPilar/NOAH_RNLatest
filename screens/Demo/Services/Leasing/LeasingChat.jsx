import React from 'react';
import {View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, FlatList} from 'react-native';

import {WINDOW_WIDTH} from '../../../../constants/NmStyles.tsx';

const LeasingChat = props => {
  const flatListRef = React.useRef();

  const SampleChatItems = [
    {
      userId: 10001,
      userName: 'Dr. Stephen Strange',
      userLastMessage: {user: 10001, message: "I'm just taking my breakfast, I'll be there in 30 minutes"},
      userImage: require('../../../../assets/Images/Hospital/dr_2.jpg'),
    },
    {
      userId: 10002,
      userName: 'Dr. House',
      userLastMessage: {user: 'Me', message: 'Should I be worried?'},
      userImage: require('../../../../assets/Images/Hospital/dr_3.png'),
    },
    {
      userId: 10003,
      userName: 'Dr. Phil',
      userLastMessage: {user: 'Me', message: 'Thanks!'},
      userImage: require('../../../../assets/Images/Hospital/dr_1.png'),
    },
  ];

  const renderMessageItem = ({item, index}) => {
    const ImgDimensions = WINDOW_WIDTH * 0.15;
    const sender = item.userId == item.userLastMessage.user ? '' : item.userLastMessage.user;
    const message = sender == '' ? item.userLastMessage.message : sender + ': ' + item.userLastMessage.message;

    return (
      <TouchableOpacity
        style={{width: '100%', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#f4f4f4'}}
        onPress={() => {
          //
        }}
        onLongPress={() => {
          //
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{overflow: 'hidden', width: ImgDimensions, height: ImgDimensions, borderRadius: 24, marginRight: 10}}>
            <Image source={item.userImage} style={{flex: 1, width: undefined, height: undefined}} />
          </View>
          <View style={{flex: 1, justifyContent: 'center', overflow: 'hidden'}}>
            <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 16}} numberOfLines={1}>
              {item.userName}
            </Text>
            <Text style={{color: '#AAA', fontFamily: 'Poppins-Regular', fontSize: 12}} numberOfLines={1}>
              {message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <StatusBar backgroundColor={'#FFF'} />
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Messages'}</Text>
      </View>
      <FlatList ref={flatListRef} data={SampleChatItems} renderItem={renderMessageItem} keyExtractor={(item, index) => index} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  messageContainer: {
    backgroundColor: '#FFF',
    minWidth: 10,
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
    borderColor: '#000',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default LeasingChat;
