import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ThemesContext} from '../functions/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NmLookupModal from './NmLookupModal'; // Import the new modal component

interface NmLookupProps {
  value?: any;
  setValue?: (item: any) => void;
  singleType?: string;
  containerStyle?: any;
  lookupTextBoxStyle?: any;
  lookupTextStyle?: any;
  lookupButtonStyle?: any;
  iconStyle?: any;
  enabled?: boolean;
  queryID?: string;
}

export default function NmLookup(props: NmLookupProps): React.JSX.Element {
  const {theme} = useContext(ThemesContext);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {value, setValue, singleType = 'default', containerStyle, lookupTextBoxStyle, lookupTextStyle, lookupButtonStyle, iconStyle, enabled, queryID} = props || {};

  return (
    <View style={[containerStyle]}>
      <NmLookupModal
        {...props}
        queryID={queryID}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(item: any) => {
          if (setValue) setValue(item);
        }}
      />

      {(singleType == 'default' || singleType == 'codeval') && (
        <View style={[styles.lookupTextBox, {marginBottom: 5, borderColor: theme.lookupBorder, backgroundColor: theme.lookupBackground}, lookupTextBoxStyle]}>
          <Text style={[styles.lookupTextStyle, {color: theme.lookupText}, lookupTextStyle]} numberOfLines={1}>
            {value?.code}
          </Text>
          <TouchableOpacity disabled={!enabled} onPress={() => setModalVisible(true)} activeOpacity={0.6} style={[styles.lookupButtonStyle, {backgroundColor: theme.lookupButton}, lookupButtonStyle]}>
            <MaterialCommunityIcons name={'magnify'} style={[iconStyle]} size={24} color={'#FFF'} />
          </TouchableOpacity>
        </View>
      )}

      {(singleType == 'default' || singleType == 'descval') && (
        <View style={[styles.lookupTextBox, {borderColor: theme.lookupBorder, backgroundColor: theme.lookupBackground}, lookupTextBoxStyle]}>
          <Text style={[styles.lookupTextStyle, {color: theme.lookupText}, lookupTextStyle]} numberOfLines={1}>
            {value?.description}
          </Text>
          {singleType == 'descval' && (
            <TouchableOpacity
              disabled={!enabled}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.6}
              style={[styles.lookupButtonStyle, {backgroundColor: theme.lookupButton}, lookupButtonStyle]}>
              <MaterialCommunityIcons name={'magnify'} style={[iconStyle]} size={24} color={'#FFF'} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lookupTextBox: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookupTextStyle: {
    height: '100%',
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
    marginBottom: -2,
  },
  lookupButtonStyle: {
    width: 38,
    height: 38,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
});
