import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, Platform, Image, KeyboardAvoidingView, ScrollView, View, TouchableWithoutFeedback, Keyboard} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '@react-native-community/hooks';
import {WebView} from 'react-native-webview';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Animated, {useSharedValue, withTiming, useAnimatedStyle, FadeIn, FadeOut, FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight, runOnJS, FadeOutDown, FadeInDown} from 'react-native-reanimated';

import NmColors from '../../constants/NmColors.js';
import {NmTitleCase, NmCheckEmailFormat, NmCreateWebToken} from '../../functions/NmFunctions.tsx';
import {NmResendRegOTPCode, NmValidateAccountNo, NmValidatePropertyInfo, NmGetUserInfo, NmCheckRegCount} from '../../functions/NmNetwork.tsx';
import {NmAesEncrypt} from '../../functions/NmCipher.tsx';
import {NmHasInternet} from '../../functions/NmFunctions.tsx';

import {NmDropdown, NmButton, NmTextInput, NmGalleryPicker, LoadingScreen, LoadingPanel, NmModal} from '../../components';
import {getEndpointDetails} from '../../functions/NmEndpoint.tsx';
import {UIConfig} from '../../Global/UIConfig.js';
import {AppConfigContext} from '../../functions/Contexts.tsx';

const RegistrationAnimatedScreen = props => {
  const orientation = useDeviceOrientation();
  const {AssetManager} = useContext(AppConfigContext);
  const {Endpoint} = getEndpointDetails();

  const userExists = props.route.params?.userExists;
  const userDetails = props.route.params?.userDetails;
  const userLoggedIn = props.route.params?.userLoggedIn;

  const [screenWidth, setScreenWidth] = useState('100%');

  const [loading, setLoading] = useState(false);
  const [panelLoading, setPanelLoading] = useState(false);

  const [modalChanged, setModalChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewMargin, setViewMargin] = useState(0);

  const [stepperPropInfo, setStepperPropInfo] = useState(0);
  const [stepperUserInfo, setStepperUserInfo] = useState(0);
  const [stepperFileInfo, setStepperFileInfo] = useState(0);
  const [stepperDataInfo, setStepperDataInfo] = useState(0);

  const [screenPage, setScreenPage] = useState(1);

  const [privacyScrolled, setPrivacyScrolled] = useState(false);

  const [toolbarPadding, setToolbarPadding] = useState(5); //Variable for iOS devices with notch

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (!DeviceInfo.hasNotch() && !DeviceInfo.isTablet()) {
        setViewMargin(40);
      }
    }
  }, []);

  useEffect(() => {
    if (userExists == true) {
      setAccountName(userDetails.LName);
      setAccountEmail(userDetails.LEmail);
      setAccountPhone(userDetails.LMobile);

      setAccountEmailEditable(false);
      setAccountPhoneEditable(false);
    }
  }, []);

  useEffect(() => {
    if (DeviceInfo.getDeviceType().toUpperCase() == 'TABLET') {
      if (orientation == 'portrait') {
        setScreenWidth('50%');
      } else {
        setScreenWidth('35%');
      }
    }

    if (Platform.OS == 'ios') {
      if (DeviceInfo.hasNotch() == true) {
        setToolbarPadding(20);
      }
    }
  }, [orientation]);

  // ========== Property Information Variables and Functions ========== //

  const [accountNumber, setAccountNumber] = useState('');
  const [propertyList, setPropertyList] = useState();
  const [propertyType, setPropertyType] = useState();
  const [customerType, setCustomerType] = useState();
  const [custCode, setCustCode] = useState();

  const [propertyInfoValidated, setPropertyInfoValidated] = useState(true);
  //const [propertyInfoValidated, setPropertyInfoValidated] = useState(false);

  useEffect(() => {
    clearPropCust();
    showError();
  }, [accountNumber]);

  useEffect(() => {
    setPanelLoading(true);
    NmHasInternet().then(result => {
      if (result == true) {
        if (propertyType != undefined && accountNumber != '') {
          NmValidatePropertyInfo(accountNumber, propertyType).then(result => {
            const userData = result?.data;

            setPanelLoading(false);
            if (result?.status == '200') {
              showError();
              setAccountName(NmTitleCase(userData.Name));
              setCustCode(userData.CustCode);
              setCustomerType(userData.CustDesc);
            } else {
              setCustomerType();
              setPanelLoading(false);
              showError('Property Information not Found!');
            }
          });
        } else {
          setPanelLoading(false);
          setCustomerType('');
        }
      } else {
        setPanelLoading(false);
        showError('No Internet connection detected.');
      }
    });
  }, [propertyType]);

  // useEffect(() => {
  //   if (propertyType != undefined && customerType != undefined && accountNumber != '') {
  //     setPropertyInfoValidated(true);
  //   } else {
  //     setPropertyInfoValidated(false);
  //   }
  // }, [customerType]);

  function getPropbyAccno() {
    setPanelLoading(true);
    NmHasInternet().then(result => {
      if (result == true) {
        if (accountNumber != '') {
          NmValidateAccountNo(accountNumber).then(result => {
            setPanelLoading(false);

            if (result.status == '200') {
              const custProps = result.data.CustProps.Property;

              let tempPropertyList = custProps.map(elem => {
                elem.value = elem.code;
                elem.label = elem.description;
                delete elem.code;
                delete elem.description;
                return elem;
              });

              setPropertyList(tempPropertyList);
            } else {
              setPanelLoading(false);
              showError('Account Information not Found!');
            }
          });
        } else {
          setPanelLoading(false);
          clearPropCust();
        }
      } else {
        setPanelLoading(false);
        showError('No Internet connection detected.');
      }
    });
  }

  function validatePropInfo() {
    setPanelLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        ReactNativeBlobUtil.config({})
          .fetch('POST', Endpoint + 'APIM/ValidatePropertyInfo?_accountNo=' + accountNumber + '&_property=' + propertyType, {
            //method: 'POST',
            //headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data; ',
            //},
          })
          .then(response => response.json())
          .then(responseData => {
            //('POST VAN', 'Response Body -> ' + JSON.stringify(responseData));

            let status = responseData.status;
            setPanelLoading(false);

            switch (status) {
              case '0':
                showError('Account number does not exist.');
                break;
              case '1':
                showError();
                setErrorMessage('');
                setStepperPropInfo(1);
                setStepperUserInfo(1);
                setScreenPage(2);
                stepperOneBG.value = '#008C76';
                stepperTwoBG.value = '#133561';
                break;
              case '2':
                showError('Account number is awaiting registration approval.');
                break;
              case '3':
                showError('Account number is already registered.');
                break;
            }
          })
          .catch(err => {
            //
          });
      } else {
        setPanelLoading(false);
        showError('No Internet connection detected.');
      }
    });
  }

  function clearPropCust() {
    setPropertyList();
    setCustomerType();
    setPropertyType();
  }

  // ========== User Information Variables and Functions ========== //

  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPhone, setAccountPhone] = useState('');

  const [accountEmailEditable, setAccountEmailEditable] = useState(true);
  const [accountPhoneEditable, setAccountPhoneEditable] = useState(true);

  //const [userInfoValidated, setUserInfoValidated] = useState(false);
  const [userInfoValidated, setUserInfoValidated] = useState(true);

  // useEffect(() => {
  //   if (accountName != '' && accountEmail != '' && accountPhone != '') {
  //     setUserInfoValidated(true);
  //   } else {
  //     setUserInfoValidated(false);
  //   }
  // }, [accountName, accountEmail, accountPhone]);

  function validateUserInfo() {
    setLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        if (userExists == true) {
          setLoading(false);
          proceedToFileUpload();
        } else {
          if (accountName != '' || accountName != undefined) {
            NmCheckRegCount(accountEmail, accountPhone).then(result => {
              try {
                if (result.data.emailCount > 0) {
                  NmGetUserInfo(accountEmail).then(result => {
                    setLoading(false);
                    if (result.status == '200') {
                      showError('Your Email address is already registered.');
                    } else if (result.status == '404') {
                      showError('Your Email address is under approval process.');
                    } else {
                      showError(result.message);
                    }
                  });
                } else {
                  setLoading(false);
                  switch (result.data.mobCount) {
                    case '3':
                      showError('Your Mobile number is already registered.');
                      break;
                    case '2':
                      showError('Your Mobile number is under registration approval.');
                      break;
                    case '1':
                      showError();
                      proceedToFileUpload();
                      break;
                  }
                }
              } catch (error) {
                setLoading(false);
                showError('An Error occured while validating user details.');
              }
            });
          } else {
            setLoading(false);
            showError('Cannot proceed. Name cannot be blank.');
          }
        }
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  }

  function proceedToFileUpload() {
    setErrorMessage('');
    stepperTwoBG.value = '#008C76';
    stepperThreeBG.value = '#133561';
    setStepperUserInfo(2);
    setStepperFileInfo(1);
    setScreenPage(3);
  }

  // ========== File Upload Functions ========== //

  const [IDFileName, setIDFileName] = useState('Select file to upload');
  const [selfieFileName, setSelfieFileName] = useState('Select file to upload');

  const [IDFile, setIDFile] = useState();
  const [selfieFile, setSelfieFile] = useState();

  const [attachFilesValidated, setAttachFilesValidated] = useState(true);
  //const [attachFilesValidated, setAttachFilesValidated] = useState(false);

  // useEffect(() => {
  //   if (IDFile != undefined && selfieFile != undefined) {
  //     setAttachFilesValidated(true);
  //   } else {
  //     setAttachFilesValidated(false);
  //   }
  // }, [IDFile, selfieFile]);

  // ========== General Functions ========== //

  function prepareRegData() {
    NmHasInternet().then(result => {
      if (result == true) {
        // var proofFormData = new FormData();
        // var selfieFormData = new FormData();
        let proofFormData = {};
        let selfieFormData = {};

        proofFormData.name = 'Proof_ID';
        proofFormData.uri = Platform.OS == 'android' ? IDFile[0].fileCopyUri : IDFile[0].uri.replace('file://', '');
        proofFormData.fileName = IDFileName;
        proofFormData.type = Platform.OS == 'android' ? 'image/jpeg' : IDFile[0].type;

        selfieFormData.name = 'Proof_Selfie';
        selfieFormData.uri = Platform.OS == 'android' ? selfieFile[0].fileCopyUri : selfieFile[0].uri.replace('file://', '');
        selfieFormData.fileName = selfieFileName;
        selfieFormData.type = Platform.OS == 'android' ? 'image/jpeg' : selfieFile[0].type;

        // proofFormData.append('Proof_ID', {
        //   uri: Platform.OS == 'android' ? IDFile[0].fileCopyUri : IDFile[0].uri,
        //   type: Platform.OS == 'android' ? 'image/jpeg' : IDFile[0].type,
        //   name: IDFileName,
        // });

        // selfieFormData.append('Proof_Selfie', {
        //   uri: Platform.OS == 'android' ? selfieFile[0].fileCopyUri : selfieFile[0].uri,
        //   type: Platform.OS == 'android' ? 'image/jpeg' : selfieFile[0].type,
        //   name: selfieFileName,
        // });

        const infoObj = {
          accountProperty: propertyType,
          accountCustomerType: custCode,
          accountNoInfo: accountNumber,
          accountNameInfo: accountName,
          accountEmailInfo: accountEmail,
          accountPhoneInfo: accountPhone,
        };

        NmResendRegOTPCode(accountEmail, accountPhone, propertyType).then(result => {
          setLoading(false);

          if (result.status == '200') {
            props.navigation.navigate('OTPMobile', {
              mobToken: NmCreateWebToken(NmAesEncrypt(accountNumber)),
              newAccount: true,
              OTPCode: result.data.OTPCode,
              userDetails: infoObj,
              proofData: proofFormData,
              selfieData: selfieFormData,
              userExists: userExists,
              userLoggedIn: userLoggedIn,
              changeType: 'NEW_REG',
            });
          } else {
            setModalChanged(true);
          }
        });
      } else {
        setLoading(false);
        showError('No Internet connection detected.');
      }
    });
  }

  const [webviewHeight, setWebviewHeight] = useState(0);

  const onProductDetailsWebViewMessage = event => {
    setWebviewHeight(Number(event.nativeEvent.data));
  };

  const showError = err => {
    setErrorMessage(err);
  };

  function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  }

  function ifCloseToTop({layoutMeasurement, contentOffset, contentSize}) {
    return contentOffset.y == 0;
  }

  const stepperOneBG = useSharedValue('#133561'); //008C76 133561
  const stepperTwoBG = useSharedValue('#848588'); //stepperUserInfo == 0 ? '#848588' : stepperUserInfo == 1 ? '#133561' : '#008C76',
  const stepperThreeBG = useSharedValue('#848588'); //stepperFileInfo == 0 ? '#848588' : stepperFileInfo == 1 ? '#133561' : '#008C76',
  const stepperFourBG = useSharedValue('#848588'); //stepperDataInfo == 0 ? '#848588' : stepperDataInfo == 1 ? '#133561' : '#008C76'

  const animStepperOne = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(stepperOneBG.value, {duration: 500}),
    };
  });

  const animStepperTwo = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(stepperTwoBG.value, {duration: 500}),
    };
  });

  const animStepperThree = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(stepperThreeBG.value, {duration: 500}),
    };
  });

  const animStepperFour = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(stepperFourBG.value, {duration: 500}),
    };
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}} nestedScrollEnabled={true}> */}
        <View style={[styles.container]}>
          {loading ? <LoadingScreen /> : null}

          <NmModal
            winVisible={modalChanged}
            setWinVisible={setModalChanged}
            containerStyle={{}}
            onClickOk={() => {
              setModalChanged(false);
            }}
            onClickClose={() => {
              setModalChanged(false);
            }}
            modalType={'WIN_INFO'}
            title={'Registration Error'}
            message={'An error occured while submitting your account details. Please contact customer support.'}></NmModal>

          <View
            style={{
              marginTop: toolbarPadding,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: screenWidth,
            }}>
            <View style={styles.stepperContainer}>
              <Animated.View style={[styles.stepperCircle, animStepperOne]}></Animated.View>
              <Text style={styles.stepperFont}>Property Info</Text>
            </View>

            <View style={[styles.horizontalLine]}></View>

            <View style={styles.stepperContainer}>
              <Animated.View style={[styles.stepperCircle, animStepperTwo]}></Animated.View>
              <Text style={styles.stepperFont}>User Info</Text>
            </View>

            <View style={[styles.horizontalLine]}></View>

            <View style={styles.stepperContainer}>
              <Animated.View style={[styles.stepperCircle, animStepperThree]}></Animated.View>
              <Text style={styles.stepperFont}>Attach Files</Text>
            </View>

            <View style={[styles.horizontalLine]}></View>

            <View style={styles.stepperContainer}>
              <Animated.View style={[styles.stepperCircle, animStepperFour]}></Animated.View>
              <Text style={styles.stepperFont}>Data Privacy</Text>
            </View>
          </View>
          {screenPage != 4 && (
            <View style={{width: '100%', alignItems: 'center', marginTop: 30}}>
              <Image source={UIConfig.RegPropertyIcon} style={{height: 150, resizeMode: 'contain'}} />
            </View>
          )}

          {screenPage == 1 && (
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: 'white',
                alignItems: 'center',
              }}
              style={{
                backgroundColor: 'white',
                width: '100%',
                paddingHorizontal: 0,
              }}>
              <Animated.View style={[styles.pageContainer, {width: screenWidth}]} onStartShouldSetResponder={() => true} entering={FadeIn} exiting={FadeOut}>
                {panelLoading && <LoadingPanel />}
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text style={styles.iconTitle}>Property Information</Text>
                  <Text style={styles.iconDescription}>Please enter the details provided by the property management office.</Text>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.labels}>
                    Account No. <Text style={styles.required}>*</Text>
                  </Text>
                  <NmTextInput
                    containerStyle={{marginBottom: 14}}
                    textInputStyle={{}}
                    value={accountNumber}
                    onChangeText={value => setAccountNumber(value.toString().toUpperCase())}
                    returnKeyType="next"
                    autoCapitalize={'characters'}
                    onSubmitEditing={() => {
                      Keyboard.dismiss;
                    }}
                    onEndEditing={() => {
                      getPropbyAccno();
                    }}
                  />

                  <Text style={styles.labels}>
                    Property <Text style={styles.required}>*</Text>
                  </Text>
                  <NmDropdown items={propertyList} setValue={setPropertyType} value={propertyType} containerStyle={styles.dropdown} />

                  <Text style={styles.labels}>
                    Customer Type <Text style={styles.required}>*</Text>
                  </Text>
                  <NmTextInput
                    containerStyle={{marginBottom: 14, backgroundColor: '#EFEFEF'}}
                    editable={false}
                    textInputStyle={{}}
                    value={customerType}
                    onChangeText={setCustomerType}
                    returnKeyType="next"
                  />

                  {/* <NmDropdown items={CustomerType} setDropdownValue={setCustomerType} initialValue={customerType} style={styles.dropdown} /> */}
                </View>
                <Text style={[styles.errorMessageStyle, {marginTop: 0}]}>{errorMessage}</Text>
                <View style={{flex: 1}}></View>
                <View>
                  <NmButton
                    disabled={!propertyInfoValidated}
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: !propertyInfoValidated ? NmColors.buttonDisabled : NmColors.buttonDark,
                      },
                    ]}
                    titleStyle={styles.buttonTextStyle}
                    title="Next"
                    onPress={() => {
                      //validatePropInfo();

                      showError();
                      setErrorMessage('');
                      setStepperPropInfo(1);
                      setStepperUserInfo(1);
                      setScreenPage(2);
                      stepperOneBG.value = '#008C76';
                      stepperTwoBG.value = '#133561';
                    }}
                  />
                  <NmButton
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: '#FFF',
                        marginBottom: 20,
                        marginTop: 10,
                      },
                    ]}
                    titleStyle={[styles.buttonTextStyle, {color: NmColors.buttonTextNoBackground}]}
                    title="Back"
                    onPress={() => {
                      props.navigation.goBack();
                    }}
                  />
                </View>
              </Animated.View>
            </ScrollView>
          )}
          {screenPage == 2 && (
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: 'white',
                alignItems: 'center',
              }}
              style={{
                backgroundColor: 'white',
                width: '100%',
                paddingHorizontal: 0,
              }}>
              <Animated.View style={[styles.pageContainer, {width: screenWidth}]} onStartShouldSetResponder={() => true} entering={FadeIn} exiting={FadeOut}>
                {panelLoading && <LoadingPanel />}
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text style={styles.iconTitle}>User Information</Text>
                  <Text style={styles.iconDescription}>Please enter the details provided by the property management office.</Text>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.labels}>
                    Name <Text style={styles.required}>*</Text>
                  </Text>
                  <NmTextInput
                    containerStyle={{marginBottom: 14, backgroundColor: '#EEE'}}
                    editable={false}
                    textInputStyle={{}}
                    value={accountName}
                    onChangeText={setAccountName}
                    returnKeyType="next"
                  />

                  <Text style={styles.labels}>
                    Email Address <Text style={styles.required}>*</Text>
                  </Text>
                  <NmTextInput
                    containerStyle={[{marginBottom: 14}, !accountEmailEditable && {backgroundColor: '#EEE'}]}
                    onEndEditing={() => {
                      if (NmCheckEmailFormat(accountEmail) == true) {
                        showError('');
                      } else {
                        showError('Invalid Email Address.');
                        setAccountEmail('');
                      }
                    }}
                    editable={accountEmailEditable}
                    textInputStyle={{}}
                    value={accountEmail}
                    onChangeText={setAccountEmail}
                    returnKeyType="next"
                    maxLength={150}
                  />

                  <Text style={styles.labels}>
                    Mobile Number <Text style={styles.required}>*</Text>
                  </Text>
                  <NmTextInput
                    containerStyle={[{marginBottom: 14}, !accountPhoneEditable && {backgroundColor: '#EEE'}]}
                    onEndEditing={() => {
                      if (accountPhone.toString().length < 11) {
                        showError('Invalid Mobile Number.');
                        setAccountPhone('');
                      } else {
                        showError('');
                      }
                    }}
                    editable={accountPhoneEditable}
                    keyboardType="numeric"
                    textInputStyle={{}}
                    value={accountPhone}
                    onChangeText={setAccountPhone}
                    returnKeyType="next"
                    maxLength={11}
                  />
                </View>
                <Text style={[styles.errorMessageStyle, {marginTop: 0}]}>{errorMessage}</Text>
                <View style={{flex: 1}}></View>
                <View>
                  <NmButton
                    disabled={!userInfoValidated}
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: !userInfoValidated ? NmColors.buttonDisabled : NmColors.buttonDark,
                      },
                    ]}
                    titleStyle={styles.buttonTextStyle}
                    title="Next"
                    onPress={() => {
                      proceedToFileUpload();
                      //validateUserInfo();
                    }}
                  />
                  <NmButton
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: '#FFF',
                        marginBottom: 20,
                        marginTop: 10,
                      },
                    ]}
                    titleStyle={[styles.buttonTextStyle, {color: NmColors.buttonTextNoBackground}]}
                    title="Back"
                    onPress={() => {
                      stepperOneBG.value = '#133561';
                      stepperTwoBG.value = '#848588';
                      setStepperPropInfo(0);
                      setStepperUserInfo(0);
                      setScreenPage(1);
                    }}
                  />
                </View>
              </Animated.View>
            </ScrollView>
          )}
          {screenPage == 3 && (
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: 'white',
                alignItems: 'center',
              }}
              style={{
                backgroundColor: 'white',
                width: '100%',
                paddingHorizontal: 0,
              }}>
              <View style={[styles.pageContainer, {width: screenWidth}]} onStartShouldSetResponder={() => true}>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text style={styles.iconTitle}>Attach Files</Text>
                  <Text style={styles.iconDescription}>Please attach a picture of your I.D and a selfie while holding it.</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labels}>
                    Attach Proof of Identification <Text style={styles.required}>*</Text>
                  </Text>
                  <NmGalleryPicker
                    fileUploadContainerStyle={{marginBottom: 14}}
                    NmSetFile={setIDFile}
                    NmSetFileName={setIDFileName}
                    NmFileName={IDFileName}
                    NmFileType="PHOTO"
                    NmShowError={showError}
                  />

                  <Text style={styles.labels}>
                    Take a Selfie holding your Valid I.D <Text style={styles.required}>*</Text>
                  </Text>
                  <NmGalleryPicker NmSetFile={setSelfieFile} NmSetFileName={setSelfieFileName} NmFileName={selfieFileName} NmFileType="PHOTO" NmShowError={showError} />

                  <Text style={[styles.errorMessageStyle, {marginTop: 0}]}>{errorMessage}</Text>
                  <View style={{flex: 1}}></View>
                </View>
                <View style={{flex: 1}}></View>
                <View>
                  <NmButton
                    disabled={!attachFilesValidated}
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: !attachFilesValidated ? NmColors.buttonDisabled : NmColors.buttonDark,
                      },
                    ]}
                    titleStyle={styles.buttonTextStyle}
                    title="Next"
                    onPress={() => {
                      NmHasInternet().then(result => {
                        if (result == true) {
                          setStepperFileInfo(2);
                          setStepperDataInfo(1);
                          setScreenPage(4);
                          setPrivacyScrolled(false);
                          stepperThreeBG.value = '#008C76';
                          stepperFourBG.value = '#133561';
                        } else {
                          showError('No Internet connection detected.');
                        }
                      });
                    }}
                  />
                  <NmButton
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: '#FFF',
                        marginBottom: 20,
                        marginTop: 10,
                      },
                    ]}
                    titleStyle={[styles.buttonTextStyle, {color: NmColors.buttonTextNoBackground}]}
                    title="Back"
                    onPress={() => {
                      stepperTwoBG.value = '#133561';
                      stepperThreeBG.value = '#848588';
                      setStepperFileInfo(0);
                      setStepperUserInfo(1);
                      setScreenPage(2);
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          )}
          {screenPage == 4 && (
            <View style={[styles.pageContainer, {marginTop: 10, width: screenWidth}]}>
              {/* <Text style={{fontFamily: 'Poppins-Bold', fontSize: 26, color: 'black', marginBottom: 0}}>Data Privacy Policy</Text> */}
              <ScrollView
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent)) {
                    setPrivacyScrolled(true);
                  } else {
                    setPrivacyScrolled(false);
                  }
                }}
                contentContainerStyle={{flexGrow: 1}}
                style={{width: '100%', marginHorizontal: -5}}>
                <View style={{flex: 1, paddingHorizontal: 0}} onStartShouldSetResponder={() => true}>
                  <WebView
                    source={{
                      html: '<html><meta name="viewport" content="width=device-width, initial-scale=1">' + AssetManager.appAssets.BibleVerseData + '</html>',
                    }}
                    onMessage={onProductDetailsWebViewMessage}
                    injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
                    style={{
                      width: '100%',
                      height: webviewHeight,
                    }}
                  />
                </View>
              </ScrollView>
              <View style={{display: 'flex'}}>
                <NmButton
                  disabled={!privacyScrolled}
                  style={[
                    styles.buttonStyle,
                    {
                      backgroundColor: !privacyScrolled ? NmColors.buttonDisabled : NmColors.buttonDark,
                    },
                  ]}
                  titleStyle={styles.buttonTextStyle}
                  title="I Accept"
                  onPress={() => {
                    setLoading(true);
                    NmHasInternet().then(result => {
                      if (result == true) {
                        prepareRegData();
                      } else {
                        setLoading(false);
                        showError('No Internet connection detected.');
                      }
                    });
                  }}
                />
                <NmButton
                  style={[
                    styles.buttonStyle,
                    {
                      backgroundColor: '#FFF',
                      marginBottom: 20,
                      marginTop: 10,
                    },
                  ]}
                  titleStyle={[styles.buttonTextStyle, {color: NmColors.buttonTextNoBackground}]}
                  title="Back"
                  onPress={() => {
                    stepperThreeBG.value = '#133561';
                    stepperFourBG.value = '#848588';
                    setStepperFileInfo(1);
                    setStepperDataInfo(0);
                    setScreenPage(3);
                  }}
                />
              </View>
            </View>
          )}
        </View>
        {/* </ScrollView> */}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pageContainer: {
    width: '100%',
    marginTop: 0,
    flex: 1,
  },
  errorMessageStyle: {
    marginTop: 20,
    fontSize: 12,
    color: '#ff005e',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  iconTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#13151B',
  },
  iconDescription: {
    width: '80%',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A4A8B0',
    textAlign: 'center',
  },
  dropdown: {
    marginBottom: 14,
    height: 45,
  },
  inputContainer: {
    marginTop: 40,
  },
  labels: {
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#13151B',
  },
  required: {
    color: 'red',
  },
  buttonStyle: {
    backgroundColor: '#7F8083',
    marginTop: 15,
    borderRadius: 6,
    width: '100%',
    height: 45,
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  horizontalLine: {
    marginHorizontal: -10,
    borderBottomColor: '#E0DFE4',
    borderBottomWidth: 3,
    flex: 1,
    marginTop: -18,
  },
  stepperContainer: {
    width: '22%',
    alignItems: 'center',
  },
  stepperCircle: {
    marginTop: 10,
    marginBottom: 10,
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  stepperFont: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: 'black',
  },
});

export default RegistrationAnimatedScreen;
