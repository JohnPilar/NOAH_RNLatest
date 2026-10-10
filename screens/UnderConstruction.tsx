import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {NmHardwareBackPress} from '../functions/NmFunctions';

import {StackScreenProps} from '../navigation/NavigationTypes';

type Props = StackScreenProps<'UnderConstruction'>;

const UnderConstruction = ({}: Props) => {
  NmHardwareBackPress();

  return (
    <View style={styles.mainContainer}>
      <Text style={{color: 'black'}}>{'This content is not yet available.'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UnderConstruction;
