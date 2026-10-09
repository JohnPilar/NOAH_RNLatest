import React, {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, ScrollView} from 'react-native';

import {ThemesContext} from '../functions/ThemeContext';

import {NmLabel} from './NmComponents';
import {NmStyles} from '../constants';

interface NmTabsProps {
  tabHeaders: string[];
  tabChildren: React.ReactNode[];
  showHeader?: boolean;
  headerText?: string;
  tabContainerStyle?: any;
}

export default function NmTabs(props: NmTabsProps): React.JSX.Element {
  const {theme} = useContext(ThemesContext);

  const {tabHeaders, tabChildren, showHeader, headerText, tabContainerStyle} = props;
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: theme.tabBackground,
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.tabCompBorder,
      }}>
      {showHeader == true && (
        <View>
          <NmLabel style={[NmStyles.poppinsMedium, {fontSize: 20, color: theme.tabHeader}]}>{headerText == undefined ? 'NOAH Tabs' : headerText}</NmLabel>
          <View style={{width: '100%', height: 1, backgroundColor: '#8ebcea', marginBottom: 5}}></View>
        </View>
      )}
      <FlatList
        data={tabHeaders}
        renderItem={({item, index}) => <TabHeader item={item} index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} theme={theme} />}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      {tabHeaders.map((item, index) => {
        return (
          <TabComponent key={index} index={index} activeIndex={activeIndex} {...props} theme={theme} style={tabContainerStyle}>
            {tabChildren[index]}
          </TabComponent>
        );
      })}
    </View>
  );
}

interface TabHeaderProps {
  index: number;
  item: string;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  theme: any;
}

const TabHeader = (props: TabHeaderProps): React.JSX.Element => {
  const {index, item, activeIndex, setActiveIndex, theme} = props;

  return (
    <TouchableOpacity
      key={index}
      style={{alignItems: 'center'}}
      onPress={() => {
        if (index != activeIndex) {
          setActiveIndex(index);
        }
      }}>
      <View style={{paddingVertical: 6, paddingHorizontal: 12}}>
        <NmLabel style={[NmStyles.poppinsMedium, {color: index == activeIndex ? '#2E7FF9' : theme.tabNameInactive}]}>{item}</NmLabel>
      </View>
      {index == activeIndex && <View style={{width: 20, height: 2, backgroundColor: '#2E7FF9'}}></View>}
    </TouchableOpacity>
  );
};

interface TabComponentProps {
  index: number;
  activeIndex: number;
  children?: React.ReactNode;
  theme: any;
  style?: any;
}

const TabComponent = (props: TabComponentProps): React.JSX.Element | false => {
  const {index, activeIndex, children, theme, style} = props;

  return (
    index == activeIndex && (
      <View style={[{width: '100%', backgroundColor: theme.tabContentBackground, padding: 5, borderRadius: 6}, style]}>
        <ScrollView nestedScrollEnabled={true}>{children}</ScrollView>
      </View>
      // <View style={{width: '100%', backgroundColor: theme.tabContentBackground}}>
      //   <ScrollView nestedScrollEnabled={true}>{children}</ScrollView>
      // </View>
    )
  );
};
