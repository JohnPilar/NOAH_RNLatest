import {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {ThemesContext} from '../functions/ThemeContext';

interface NmRadiobuttonItem {
  label: string;
  [key: string]: any;
}

interface NmRadiobuttonProps {
  items: NmRadiobuttonItem[];
  setRadiobuttonValue: (item: NmRadiobuttonItem) => void;
  enabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  radioContainerStyle?: StyleProp<ViewStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
  selectedStyle?: StyleProp<ViewStyle>;
  fontStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export default function NmRadiobutton(props: NmRadiobuttonProps): React.JSX.Element {
  const {items, setRadiobuttonValue, containerStyle, radioContainerStyle, outlineStyle, selectedStyle, fontStyle, children} = props;
  const {theme} = useContext(ThemesContext);
  const tmpItems = items;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <View style={[{padding: 5}, containerStyle]}>
      {tmpItems?.map((item, index) => {
        return (
          <TouchableOpacity
            disabled={!props?.enabled}
            key={index}
            style={[{marginVertical: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5}, radioContainerStyle]}
            onPress={() => {
              setRadiobuttonValue(item);
              setSelectedIndex(index);
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  {
                    height: 20,
                    width: 20,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedIndex == index ? '#2E7FF9' : 'gray',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  outlineStyle,
                ]}>
                {selectedIndex == index ? (
                  <View
                    style={[
                      {
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: '#2E7FF9',
                      },
                      selectedStyle,
                    ]}
                  />
                ) : null}
              </View>
              <Text style={[{color: theme.chkradText, fontFamily: 'Poppins-Regular', fontSize: 16, marginLeft: 10, marginBottom: -3}, fontStyle]} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
            {children}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
