import React, {useState, useCallback} from 'react';
import {BackHandler} from 'react-native';
import IDScanner from './IDScanner';
import IDPreviewScreen from './IDPreviewScreen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NmHardwareBackPress} from '../../../functions/NmFunctions';

export default function IDVerificationFlow() {
  const [currentStep, setCurrentStep] = useState('CAPTURE'); // 'CAPTURE' or 'PREVIEW'
  const [croppedUri, setCroppedUri] = useState(null);
  const [orientation, setOrientation] = useState('LANDSCAPE');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  NmHardwareBackPress();

  const handleImageCropped = ({uri, orientation}) => {
    setCroppedUri(uri);
    setCurrentStep('PREVIEW');
    setOrientation(orientation);
  };

  const handleUploadToApi = async () => {
    setLoading(true);
    try {
      // Call your uploadIdForVerification(croppedUri) function here!
      // After API success, navigate the user forward in your app
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === 'PREVIEW') {
    return <IDPreviewScreen orientation={orientation} imageUri={croppedUri} isUploading={loading} onRetry={() => setCurrentStep('CAPTURE')} onContinue={handleUploadToApi} />;
  }

  return <IDScanner onFinalImageReady={handleImageCropped} />;
}
