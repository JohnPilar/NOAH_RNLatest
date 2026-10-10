import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function IDPreviewScreen({imageUri, orientation, onRetry, onContinue, isUploading = false}) {
  return (
    <View style={styles.container}>
      {/* Header Text */}
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>{'Check ID Clarity'}</Text>
        <Text style={styles.subtitleText}>{'Make sure all text, numbers, and your photo are sharp and readable.'}</Text>
      </View>

      {/* The Cropped Image Canvas */}
      <View style={styles.imageCardWrapper}>
        <Image
          source={typeof imageUri === 'object' ? imageUri : {uri: imageUri}}
          style={[
            styles.previewImage,
            {
              transform: [{rotate: orientation == 'LANDSCAPE' ? '90deg' : '0deg'}],
              width: '100%',
              height: '100%',
            },
          ]}
          //style={{transform: [{rotate: '90deg'}]}}
          resizeMode="contain"
          //style={{width: '100%', height: '100%'}}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {/* RETRY BUTTON */}
        <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={onRetry} disabled={isUploading}>
          <Text style={[styles.buttonText, styles.retryText]}>{'Retake Photo'}</Text>
        </TouchableOpacity>

        {/* CONTINUE BUTTON */}
        <TouchableOpacity style={[styles.button, styles.continueButton]} onPress={onContinue} disabled={isUploading}>
          <Text style={[styles.buttonText, styles.continueText]}>{isUploading ? 'Uploading...' : 'Use This Photo'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Sleek dark theme
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  titleText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitleText: {
    color: '#AAA',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  imageCardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    marginVertical: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  previewImage: {
    aspectRatio: 1, // Keeps the ID standard aspect ratio profile look
    borderRadius: 16,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  retryButton: {
    backgroundColor: 'transparent',
    borderColor: '#E53935', // Premium crimson warning tone
  },
  continueButton: {
    backgroundColor: '#00E676', // Vibrant, actionable matrix green
    borderColor: '#00E676',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryText: {
    color: '#E53935',
  },
  continueText: {
    color: '#000', // High contrast text for the dark mode backdrop
  },
});
