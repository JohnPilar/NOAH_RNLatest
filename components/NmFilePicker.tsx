import {View, Text, TouchableOpacity} from 'react-native';
import {NmStyles} from '../constants';

import {FileTypes} from '../constants';
import {pick, types} from '@react-native-documents/picker';
import {useContext} from 'react';
import {ThemesContext} from '../functions/ThemeContext';
import {NmGetPickerFileType} from '../functions/NmFunctions';

interface NmFilePickerProps {
  NmSetFile: (file: string) => void;
  NmSetFileName: (fileName: string) => void;
  NmFileName?: string;
  NmFileType?: any;
  fileUploadStyle?: any;
  fileUploadContainerStyle?: any;
  fileUploadButtonStyle?: any;
  fileUploadButtonTextStyle?: any;
}

export default function NmFilePicker(props: NmFilePickerProps): React.JSX.Element {
  const {NmSetFile, NmSetFileName, NmFileName, NmFileType, fileUploadStyle, fileUploadContainerStyle, fileUploadButtonStyle, fileUploadButtonTextStyle} = props;
  const {theme} = useContext(ThemesContext);

  let DPFileType: any = undefined;

  if (NmFileType == undefined || !Object.values(FileTypes.FilePicker).includes(NmFileType)) {
    DPFileType = types.allFiles;
  } else {
    DPFileType = NmGetPickerFileType(NmFileType);
  }

  async function pickFile(): Promise<void> {
    try {
      const pickerResult = await pick({
        type: DPFileType,
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });
      //console.log([pickerResult][0][0]);

      //File type Validation does not work on early versions of android
      NmSetFileName([pickerResult][0][0].name ?? '');
      NmSetFile([pickerResult][0][0].uri);

      // if (DPFileType == DocumentPicker.types.allFiles) {
      //   NmSetFileName([pickerResult][0].name);
      //   NmSetFile([pickerResult]);
      // } else {

      // }
    } catch (e) {
      //handleError(e); // do nothing on error(?)
    }
  }

  return (
    <View style={[NmStyles.fileUploadContainerStyle, {backgroundColor: theme.fpBackground, borderColor: theme.fpBorder}, fileUploadContainerStyle]}>
      <Text style={[NmStyles.fileUploadStyle, {color: theme.fpText}, fileUploadStyle]} numberOfLines={1}>
        {NmFileName}
      </Text>
      <TouchableOpacity onPress={() => pickFile()} style={[NmStyles.fileUploadButtonStyle, {backgroundColor: theme.fpButtonColor, borderColor: theme.fpButtonBorder}, fileUploadButtonStyle]}>
        <Text style={[NmStyles.fileUploadButtonTextStyle, {color: theme.fpButtonText}, fileUploadButtonTextStyle]}>Select File</Text>
      </TouchableOpacity>
    </View>
  );
}
