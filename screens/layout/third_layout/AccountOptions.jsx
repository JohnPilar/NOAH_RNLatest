import {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {EventRegister} from 'react-native-event-listeners';

import {NmLabel} from '../../../components';
import {NmStyles} from '../../../constants';
import {ThemesContext} from '../../../functions/ThemeContext';

const AccountOptions = props => {
  const {darkTheme, setDarkTheme, theme} = useContext(ThemesContext);

  const optionsList = [
    {
      title: 'Register',
      description: 'Create a new user account',
      icon: '',
      destination: 'RegistrationOption',
    },
    {
      title: 'Reset Password',
      description: 'Set a new password for an existing account',
      icon: '',
      destination: 'ResetPasswordForm',
    },
    {
      title: 'Application Theme',
      description: 'Switch between dark and light mode',
      icon: '',
      destination: 'actSwitchTheme',
    },
  ];

  return (
    <View style={[styles.container, {paddingTop: useSafeAreaInsets().top + 16, backgroundColor: theme.screenBackground}]}>
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{width: '100%', paddingHorizontal: 16}}>
        <NmLabel style={[NmStyles.poppinsMedium, {fontSize: 24, marginBottom: 8, marginLeft: 4, color: theme.textColor}]}>{'Account Options'}</NmLabel>
        {optionsList.map((item, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              style={{marginBottom: 8, backgroundColor: theme.panelBackground, width: '100%', padding: 12, elevation: 1, borderRadius: 12}}
              activeOpacity={0.7}
              onPress={() => {
                if (item.destination != 'actSwitchTheme') {
                  try {
                    props.navigation.navigate(item.destination);
                  } catch (e) {}
                } else {
                  setDarkTheme(!darkTheme);
                }
              }}>
              <View>
                <NmLabel style={[NmStyles.fontOpenSans.bold, {fontSize: 16, color: theme.textColor}]}>{item.title}</NmLabel>
                <NmLabel style={[NmStyles.fontOpenSans.regular, {fontSize: 12, color: theme.textColor}]}>{item.description}</NmLabel>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AccountOptions;
