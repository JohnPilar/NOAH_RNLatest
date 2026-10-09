import {View, Text, TouchableOpacity, Platform, ViewStyle, TextStyle} from 'react-native';

import {pick, types} from '@react-native-documents/picker';
import {launchImageLibrary} from 'react-native-image-picker';

import {NmStyles} from '../constants';
import {useContext} from 'react';
import {ThemesContext} from '../functions/ThemeContext';

interface NmGalleryPickerProps {
  NmSetFile: (file: any) => void;
  NmSetFileName: (fileName?: string) => void;
  NmFileName?: string;
  NmFileType?: string;
  NmShowError: (message?: string) => void;
  fileUploadContainerStyle?: ViewStyle;
  fileUploadStyle?: TextStyle;
  fileUploadButtonStyle?: ViewStyle;
  fileUploadButtonTextStyle?: TextStyle;
}

export default function NmGalleryPicker(props: NmGalleryPickerProps): React.JSX.Element {
  const {NmSetFile, NmSetFileName, NmFileName, NmFileType, NmShowError, fileUploadContainerStyle, fileUploadStyle, fileUploadButtonStyle, fileUploadButtonTextStyle} = props;
  const {theme} = useContext(ThemesContext);

  const mediaType: string[] = ['PHOTO', 'VIDEO'];
  let disableButton: boolean = mediaType.includes(NmFileType as string) ? false : true;

  const fileTypeAndroid: any = NmFileType == 'PHOTO' ? types.images : NmFileType == 'VIDEO' ? types.video : 'FILE_TYPE_NULL';
  const fileTypeIOS: any = NmFileType == 'PHOTO' ? 'photo' : NmFileType == 'VIDEO' ? 'video' : 'FILE_TYPE_NULL';
  const fileType: string = NmFileType == 'PHOTO' ? 'image' : NmFileType == 'VIDEO' ? 'video' : 'FILE_TYPE_NULL';

  async function pickMediaFile(): Promise<void> {
    if (Platform.OS == 'android') {
      try {
        const pickerResult = await pick({
          type: [fileTypeAndroid],
          presentationStyle: 'fullScreen',
          copyTo: 'cachesDirectory',
        });

        const pickType = pickerResult[0].type;

        if (pickType?.includes(fileType)) {
          NmSetFileName(pickerResult[0].name ?? 'NOFILENAME');
          NmSetFile([pickerResult[0]]);
          NmShowError();
        } else {
          NmSetFileName();
          NmSetFile([]);
          NmShowError('Please select image file only.');
        }
      } catch (e) {
        //handleError(e); // do nothing on error(?)
      }
    } else if (Platform.OS == 'ios') {
      const options = {
        mediaType: fileTypeIOS as 'photo' | 'video',
        //includeBase64: true,
      };

      launchImageLibrary(options, response => {
        if (response?.assets != undefined) {
          const responseObject = response.assets[0];
          if (responseObject.hasOwnProperty('fileSize') && responseObject.width! > 0 && responseObject.height! > 0) {
            NmSetFileName(response.assets[0].fileName);
            NmSetFile([response.assets[0]]);
          } else {
            NmSetFileName('File may be corrupted');
            NmSetFile([]);
          }
        } else {
          NmSetFileName();
          NmSetFile([]);
        }
      });
    }
  }

  return (
    <View style={[NmStyles.fileUploadContainerStyle, {backgroundColor: theme.gpBackground, borderColor: theme.gpBorder}, fileUploadContainerStyle]}>
      <Text style={[NmStyles.fileUploadStyle, {color: theme.gpText}, fileUploadStyle]} numberOfLines={1}>
        {disableButton ? 'Missing/Invalid File Type' : NmFileName}
      </Text>
      <TouchableOpacity
        onPress={() => pickMediaFile()}
        style={[NmStyles.fileUploadButtonStyle, {backgroundColor: theme.gpButtonColor, borderColor: theme.gpButtonBorder}, fileUploadButtonStyle]}
        disabled={disableButton}>
        <Text style={[NmStyles.fileUploadButtonTextStyle, {color: theme.gpButtonText}, fileUploadButtonTextStyle, disableButton && {color: '#BBB'}]}>Select File</Text>
      </TouchableOpacity>
    </View>
  );
}
