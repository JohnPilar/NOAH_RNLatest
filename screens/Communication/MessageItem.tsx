import {useContext, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {NmStyles} from '../../constants';
import {NmGetChatDate, NmGetChatTime} from '../../functions/NmFunctions';
import {ThemesContext} from '../../functions/ThemeContext';

interface MessageItemData {
  fromUser: boolean;
  message: string;
  dateTime: any;
}

interface MessageItemProps {
  data: {
    item: MessageItemData;
  };
  user?: any;
}

export default function MessageItem(props: MessageItemProps): React.JSX.Element {
  const {theme} = useContext(ThemesContext);
  const {data, user} = props;
  const item = data.item;
  const [showDate, setShowDate] = useState<boolean>(false);

  return (
    <TouchableOpacity
      onPress={() => {
        setShowDate(!showDate);
      }}
      activeOpacity={0.7}
      style={{width: '100%', alignItems: item.fromUser ? 'flex-start' : 'flex-end', paddingVertical: 5}}>
      <View style={{backgroundColor: item.fromUser ? theme.chatBubbleSent : theme.chatBubbleReceived, padding: 10, borderRadius: 12, maxWidth: '90%'}}>
        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 14, color: item.fromUser ? theme.chatBubbleSentFont : theme.chatBubbleReceivedFont}}>{item.message}</Text>
      </View>
      {showDate && (
        <View style={{marginTop: 2, paddingHorizontal: 4}}>
          <Text style={[NmStyles.poppinsRegular, {color: '#AAA', fontSize: 14}]}>{NmGetChatDate(item.dateTime) + ' ' + NmGetChatTime(item.dateTime)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
