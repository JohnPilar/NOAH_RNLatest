import {View, ScrollView, TouchableOpacity, Image, useWindowDimensions} from 'react-native';
import {NmLabel} from './NmComponents';
import {useContext} from 'react';
import {ThemesContext} from '../functions/ThemeContext';

interface ButtonControl {
  id: string;
  title: string;
  icon: any;
  disabled: boolean;
  hidden: boolean;
}

interface NmToolbarProps {
  disableList?: string[];
  hideList?: string[];
  customList?: any[];
  onPress?: (id: string) => void;
  containerStyle?: any;
}

export default function NmToolbar(props: NmToolbarProps): React.JSX.Element {
  const {disableList, hideList, customList, onPress, containerStyle} = props;
  const {width} = useWindowDimensions();
  const {theme} = useContext(ThemesContext);

  const neededKeys = ['id', 'title', 'icon', 'disabled', 'hidden'];

  let controlList: ButtonControl[] = [
    {
      id: 'TB_NEW',
      title: 'New',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_new_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_SAVE',
      title: 'Save',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_save_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_UPDATE',
      title: 'Update',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_update_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_DELETE',
      title: 'Delete',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_delete_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_REFRESH',
      title: 'Refresh',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_delete_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_INQUIRE',
      title: 'Inquire',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_inquire_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_PROCESS',
      title: 'Process',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_process_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_EXPORT',
      title: 'Export',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_export_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_IMPORT',
      title: 'Import',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_import_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_PRINT',
      title: 'Print',
      icon: require('../assets/Icons/toolbar/icon-nw_v2_print_colored_20x20_72px.png'),
      disabled: false,
      hidden: false,
    },
    {
      id: 'TB_CUSTOM',
      title: 'Custom',
      icon: require('../assets/Icons/setting_biometric.png'),
      disabled: false,
      hidden: false,
    },
  ];

  if (customList != undefined && customList?.length > 0) {
    customList.forEach((item: any) => {
      //console.log(item);
    });
  }

  if (disableList != undefined && disableList?.length > 0) {
    disableList.forEach((id: string) => {
      const disabledIndex = controlList.findIndex(i => i.id == id);
      if (disabledIndex != -1) {
        controlList[disabledIndex].disabled = true;
      }
    });
  }

  if (hideList != undefined && hideList?.length > 0) {
    hideList.forEach((id: string) => {
      const disabledIndex = controlList.findIndex(i => i.id == id);
      if (disabledIndex != -1) {
        controlList[disabledIndex].hidden = true;
      }
    });
  }

  return (
    <View style={[{width: '100%', backgroundColor: theme.statusBar}, containerStyle]}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {controlList.map(item => {
          return (
            item.hidden == false && (
              <View key={item.id} style={{width: width / 6, paddingVertical: 3, paddingHorizontal: 1.5, alignItems: 'center'}}>
                <TouchableOpacity
                  style={{width: '100%', alignItems: 'center', elevation: 1, backgroundColor: theme.panelBackground, paddingTop: 10, paddingBottom: 5, borderRadius: 6}}
                  onPress={() => {
                    onPress?.(item.id);
                  }}
                  disabled={item.disabled}>
                  <Image source={item.icon} style={{width: width / 20, height: width / 20, opacity: item.disabled ? 0.3 : 1}} />
                  <NmLabel style={{fontSize: 12, opacity: item.disabled ? 0.3 : 1, color: theme.textColor}}>{item.title}</NmLabel>
                </TouchableOpacity>
              </View>
            )
          );
        })}
      </ScrollView>
    </View>
  );
}
