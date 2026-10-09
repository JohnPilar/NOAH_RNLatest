import React, {useContext, useState, createContext, useRef} from 'react';
import {ScrollView, StyleSheet, View, Platform, FlatList, Text, TouchableOpacity} from 'react-native';
import {ThemesContext} from '../functions/ThemeContext';
import NmSettingItem from './NmSettingitem';
import {NmColors} from '../constants';

import {SafeAreaView} from 'react-native-safe-area-context';
import {AccountDetailsContext, AppConfigContext} from '../functions/Contexts';
import {LogEndpointDetails} from '../functions/NmEndpoint';
import {LogConfigDetails} from '../functions/NmAppConfig';
import {Config} from '../app.config';
import {NmHardwareBackPress} from '../functions/NmFunctions';
import {StackScreenProps} from '../navigation/NavigationTypes';

var XDate = require('xdate');

type Props = StackScreenProps<'NmDevTools'>;
type TabType = 'DevAppSettings' | 'DevAppLogs';

const NmDevTools = ({route}: Props): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);
  const {viewLinkLogs, setViewLinkLogs, appLogs, NmCreateLogs} = useContext(NDContext);
  const {AssetManager} = useContext(AppConfigContext);
  const {loginSetters} = useContext(AccountDetailsContext);
  const {demoMode} = useContext(AccountDetailsContext);

  const [activeTab, setActiveTab] = useState<TabType>('DevAppSettings');
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const {userIntent} = route.params || {};

  NmHardwareBackPress();

  const navigateToLogs = () => {
    setActiveTab('DevAppLogs');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
      {/* Top Tab Bar Header */}
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={activeTab === 'DevAppSettings' ? {selected: true} : {}}
          onPress={() => setActiveTab('DevAppSettings')}
          style={[
            styles.tabButton,
            {
              borderBottomColor: activeTab === 'DevAppSettings' ? NmColors.buttonLight : '#333',
            },
          ]}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'DevAppSettings' ? '#FFF' : '#AAA',
                opacity: activeTab === 'DevAppSettings' ? 1 : 0.6,
              },
            ]}>
            Developer Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={activeTab === 'DevAppLogs' ? {selected: true} : {}}
          onPress={() => setActiveTab('DevAppLogs')}
          style={[
            styles.tabButton,
            {
              borderBottomColor: activeTab === 'DevAppLogs' ? NmColors.buttonLight : '#333',
            },
          ]}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'DevAppLogs' ? '#FFF' : '#AAA',
                opacity: activeTab === 'DevAppLogs' ? 1 : 0.6,
              },
            ]}>
            DevAppLogs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Screen Views (both stay mounted to preserve scroll positions & active log instances) */}
      <View style={{flex: 1}}>
        {/* Settings View */}
        <View style={[styles.container, {backgroundColor: '#333', display: activeTab === 'DevAppSettings' ? 'flex' : 'none'}]}>
          <ScrollView
            ref={scrollViewRef}
            style={{width: '100%', flexGrow: 1}}
            contentContainerStyle={{alignItems: 'center'}}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: false})}>
            {/* Webviewer Logs */}
            <NmSettingItem
              onPress={() => setViewLinkLogs(currentValue => !currentValue)}
              disabled={!userIntent}
              materialIcon={'timeline-text-outline'}
              title={'Webview Logs'}
              titleStyle={{color: '#FFF'}}
              description={'Show webview final link and passed properties'}
              isSwitch={true}
              switchValue={viewLinkLogs}
              setSwitch={setViewLinkLogs}
              style={{backgroundColor: '#222'}}
            />

            {/* Demo Mode - Dashboard Shortcut */}
            <NmSettingItem
              onPress={() => loginSetters.setDemoMode((currentValue: boolean) => !currentValue)}
              disabled={!userIntent}
              materialIcon={'apps'}
              title={'Demo Screens'}
              titleStyle={{color: '#FFF'}}
              description={'Show demo screen shortcut on dashboard'}
              isSwitch={true}
              switchValue={demoMode}
              setSwitch={loginSetters.setDemoMode}
              style={{backgroundColor: '#222'}}
            />

            {/* Current Endpoint Details */}
            <NmSettingItem
              onPress={() => {
                const EPDetails = LogEndpointDetails();
                NmCreateLogs(EPDetails);
                navigateToLogs();
              }}
              disabled={!userIntent}
              materialIcon={'application-cog-outline'}
              title={'Endpoint Details'}
              titleStyle={{color: '#FFF'}}
              description={'Show current endpoint configuration'}
              style={{backgroundColor: '#222'}}
            />

            {/* Current App Link Config Details */}
            <NmSettingItem
              onPress={() => {
                const LinkDetails = LogConfigDetails();
                NmCreateLogs(LinkDetails);
                navigateToLogs();
              }}
              disabled={!userIntent}
              materialIcon={'link'}
              title={'Link Config Details'}
              titleStyle={{color: '#FFF'}}
              description={'Show current menu item link configuration'}
              style={{backgroundColor: '#222'}}
            />

            {/* Current App Assets */}
            <NmSettingItem
              onPress={() => {
                const assetLog = `=== APP ASSETS ===\n
                appAssets: ${JSON.stringify(AssetManager.appAssets, null, 2)}\n
                appItems: ${JSON.stringify(AssetManager.appItems, null, 2)}\n
                drawerItems: ${JSON.stringify(AssetManager.drawerItems, null, 2)}\n
                `;

                NmCreateLogs(assetLog);
                navigateToLogs();
              }}
              disabled={!userIntent}
              materialIcon={'database-arrow-right-outline'}
              title={'App Assets'}
              titleStyle={{color: '#FFF'}}
              description={'View current app assets'}
              style={{backgroundColor: '#222'}}
            />

            {/* Current App Config */}
            <NmSettingItem
              onPress={() => {
                const appLog = `=== APP CONFIGS ===\n
                App Config: ${JSON.stringify(Config, null, 2)}\n
                `;

                NmCreateLogs(appLog);
                navigateToLogs();
              }}
              disabled={!userIntent}
              materialIcon={'application-settings-outline'}
              title={'App Config (HardCoded)'}
              titleStyle={{color: '#FFF'}}
              description={'Show current app config based on project config file'}
              style={{backgroundColor: '#222'}}
            />

            {/* Retain developer settings */}
            <NmSettingItem
              onPress={() => {}}
              disabled={!userIntent}
              materialIcon={'apps'}
              title={'Save developer settings'}
              titleStyle={{color: '#FFF'}}
              description={'All current developer settings will be saved'}
              isSwitch={true}
              switchValue={demoMode}
              setSwitch={loginSetters.setDemoMode}
              style={{backgroundColor: '#222'}}
            />
          </ScrollView>
        </View>

        {/* Logs View */}
        <View style={[styles.container, {backgroundColor: '#333', display: activeTab === 'DevAppLogs' ? 'flex' : 'none'}]}>
          {appLogs && appLogs.length > 0 ? (
            <View style={[styles.logItem]}>
              <FlatList
                inverted={true}
                data={appLogs}
                renderItem={({item, index}) => (
                  <View key={index} style={{width: '100%'}}>
                    <Text selectable={true} style={[styles.logText, {color: '#AAA', fontSize: 12, fontWeight: '800'}]}>
                      {item.time}
                    </Text>
                    <Text selectable={true} style={[styles.logText, {color: '#FFF', fontSize: 11}]}>
                      {item.log}
                    </Text>
                  </View>
                )}
                keyExtractor={item => item.time}
                contentContainerStyle={{flexGrow: 1, width: '100%', paddingHorizontal: 8}}
              />
            </View>
          ) : (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#A4A8B0', fontFamily: 'Poppins-Regular'}}>{'No system logs recorded.'}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
  },
  tabButton: {
    backgroundColor: '#333',
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 3,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
  },
  logItem: {
    flex: 1,
    width: '100%',
    padding: 4,
  },
  logText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
  },
});

export default NmDevTools;

interface NDLog {
  time: string;
  log: string;
}

interface NDContextType {
  appLogs: NDLog[];
  setAppLogs: React.Dispatch<React.SetStateAction<NDLog[]>>;
  viewLinkLogs: boolean;
  setViewLinkLogs: React.Dispatch<React.SetStateAction<boolean>>;
  NmCreateLogs: (message: string) => void;
}

export const NDContext = createContext<NDContextType>({} as NDContextType);

interface NDProviderProps {
  children: React.ReactNode;
}

export const NDProvider = ({children}: NDProviderProps): React.JSX.Element => {
  const [appLogs, setAppLogs] = useState<NDLog[]>([]);
  const [viewLinkLogs, setViewLinkLogs] = useState<boolean>(false);

  function NmCreateLogs(message: string): void {
    const timestamp = new XDate().toString('MM/dd/yyyy HH:mm:sss');
    const newLog = {time: timestamp, log: message};
    setAppLogs(prevLogs => [newLog, ...prevLogs]);
  }

  return <NDContext.Provider value={{appLogs, setAppLogs, viewLinkLogs, setViewLinkLogs, NmCreateLogs}}>{children}</NDContext.Provider>;
};
