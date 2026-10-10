import React, {useState, useEffect, useContext, Fragment} from 'react';
import {Text, StyleSheet, Platform, Image, ScrollView, View, TouchableWithoutFeedback, Keyboard, DimensionValue, NativeScrollEvent} from 'react-native';

import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import DeviceInfo from 'react-native-device-info';
import {useDeviceOrientation} from '../../functions/NmFunctions.tsx';
import {WebView} from 'react-native-webview';
import ReactNativeBlobUtil from 'react-native-blob-util';

import NmColors from '../../constants/NmColors.js';
import {NmTitleCase, NmCheckEmailFormat, NmCreateWebToken} from '../../functions/NmFunctions.tsx';
import {NmResendRegOTPCode, NmValidateAccountNo, NmValidatePropertyInfo, NmGetUserInfo, NmCheckRegCount} from '../../functions/NmNetwork.tsx';
import {NmAesEncrypt} from '../../functions/NmCipher.tsx';
import {NmHasInternet} from '../../functions/NmFunctions.tsx';

import {NmModal, LoadingScreen, LoadingPanel, NmDropdown, NmButton, NmTextInput, NmGalleryPicker, NmStatusBar} from '../../components/index.jsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemesContext} from '../../functions/ThemeContext.tsx';
import {getEndpointDetails} from '../../functions/NmEndpoint.tsx';
import {UIConfig} from '../../Global/UIConfig.js';
import {AppConfigContext} from '../../functions/Contexts.tsx';

import {StackScreenProps} from '../../navigation/NavigationTypes.tsx';
import {IRegFilePicker, IRegProofData, IRegUserDetails} from '../../constructs/interfaces/AccountFunctionsInterface.tsx';

type Props = StackScreenProps<'RegistrationScreen'>;

const RegistrationScreen = ({navigation, route}: Props): React.JSX.Element => {
  const orientation = useDeviceOrientation();
  const {theme} = useContext(ThemesContext);
  const {Endpoint} = getEndpointDetails();
  const {AssetManager} = useContext(AppConfigContext);

  const userExists = route.params?.userExists;
  const userDetails = route.params?.userDetails;
  const userLoggedIn = route.params?.userLoggedIn;

  const [screenWidth, setScreenWidth] = useState<DimensionValue>('100%');

  const [loading, setLoading] = useState<boolean>(false);
  const [panelLoading, setPanelLoading] = useState<boolean>(false);

  const [modalChanged, setModalChanged] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [screenPage, setScreenPage] = useState<number>(1);
  const [privacyScrolled, setPrivacyScrolled] = useState<boolean>(false);
  const toolbarPadding: number = 0; //Variable for iOS devices with notch

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

    // if (Platform.OS == 'ios') {
    //   if (DeviceInfo.hasNotch() == true) {
    //     setToolbarPadding(20);
    //   }
    // }
  }, [orientation]);

  // ========== Property Information Variables and Functions ========== //

  const [accountNumber, setAccountNumber] = useState<string>('');
  const [propertyList, setPropertyList] = useState<Array<any>>([]);
  const [propertyType, setPropertyType] = useState<string>('');
  const [customerType, setCustomerType] = useState<string>('');
  const [custCode, setCustCode] = useState<string>('');

  const [propertyInfoValidated, setPropertyInfoValidated] = useState(false);

  useEffect(() => {
    clearPropCust();
    showError('');
  }, [accountNumber]);

  useEffect(() => {
    setPanelLoading(true);
    NmHasInternet().then(result => {
      if (result == true) {
        if (propertyType?.trim() && accountNumber?.trim()) {
          NmValidatePropertyInfo(accountNumber, propertyType).then(result => {
            const userData = result?.data;

            setPanelLoading(false);
            if (result?.status == '200') {
              showError('');
              setAccountName(NmTitleCase(userData.Name));
              setCustCode(userData.CustCode);
              setCustomerType(userData.CustDesc);
            } else {
              setCustomerType('');
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

  useEffect(() => {
    if (propertyType?.trim() && customerType?.trim() && accountNumber?.trim()) {
      setPropertyInfoValidated(true);
    } else {
      setPropertyInfoValidated(false);
    }
  }, [customerType]);

  function getPropbyAccno() {
    setPanelLoading(true);
    NmHasInternet().then(result => {
      if (result == true) {
        if (accountNumber?.trim()) {
          NmValidateAccountNo(accountNumber).then(result => {
            setPanelLoading(false);

            if (result.status == '200') {
              const custProps = result.data.CustProps.Property;

              let tempPropertyList = custProps.map((elem: any) => {
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
          .fetch('GET', Endpoint + 'APIM/ValidatePropertyInfo?_accountNo=' + accountNumber + '&_property=' + propertyType, {
            //method: 'POST',
            //headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            //},
          })
          .then(response => response.json())
          .then(responseData => {
            let status = responseData.status;
            setPanelLoading(false);

            switch (status) {
              case '0':
                showError('Account number does not exist.');
                break;
              case '1':
                showError('');
                setErrorMessage('');
                setScreenPage(2);
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
            console.log(err);
          });
      } else {
        setPanelLoading(false);
        showError('No Internet connection detected.');
      }
    });
  }

  function clearPropCust() {
    setPropertyList([]);
    setCustomerType('');
    setPropertyType('');
  }

  // ========== User Information Variables and Functions ========== //

  const [accountName, setAccountName] = useState<string>('');
  const [accountEmail, setAccountEmail] = useState<string>('');
  const [accountPhone, setAccountPhone] = useState<string>('');

  const [accountEmailEditable, setAccountEmailEditable] = useState<boolean>(true);
  const [accountPhoneEditable, setAccountPhoneEditable] = useState<boolean>(true);

  const [userInfoValidated, setUserInfoValidated] = useState<boolean>(false);

  useEffect(() => {
    if (accountName != '' && accountEmail != '' && accountPhone != '') {
      setUserInfoValidated(true);
    } else {
      setUserInfoValidated(false);
    }
  }, [accountName, accountEmail, accountPhone]);

  function validateUserInfo() {
    setLoading(true);

    NmHasInternet().then(result => {
      if (result == true) {
        if (userExists == true) {
          setLoading(false);
          proceedToFileUpload();
        } else {
          if (accountName?.trim()) {
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
                      showError('');
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
    setScreenPage(3);
  }

  // ========== File Upload Functions ========== //

  const [IDFileName, setIDFileName] = useState<string | undefined>('Select file to upload');
  const [selfieFileName, setSelfieFileName] = useState<string | undefined>('Select file to upload');

  const [IDFile, setIDFile] = useState<IRegFilePicker[]>([]);
  const [selfieFile, setSelfieFile] = useState<IRegFilePicker[]>([]);

  const [attachFilesValidated, setAttachFilesValidated] = useState<boolean>(false);

  useEffect(() => {
    if (IDFile.length && selfieFile.length) {
      setAttachFilesValidated(true);
    } else {
      setAttachFilesValidated(false);
    }
  }, [IDFile, selfieFile]);

  // ========== General Functions ========== //

  function prepareRegData() {
    NmHasInternet().then(result => {
      if (result == true) {
        const proofFormData = {} as IRegProofData;
        const selfieFormData = {} as IRegProofData;

        proofFormData.name = 'Proof_ID';
        proofFormData.uri = Platform.OS == 'android' ? IDFile[0].uri : IDFile[0].uri.replace('file://', '');
        proofFormData.fileName = IDFileName ?? '';
        proofFormData.type = Platform.OS == 'android' ? 'image/jpeg' : IDFile[0].type;

        selfieFormData.name = 'Proof_Selfie';
        selfieFormData.uri = Platform.OS == 'android' ? selfieFile[0].uri : selfieFile[0].uri.replace('file://', '');
        selfieFormData.fileName = selfieFileName ?? '';
        selfieFormData.type = Platform.OS == 'android' ? 'image/jpeg' : selfieFile[0].type;

        const infoObj: IRegUserDetails = {
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
            navigation.navigate('OTPMobile', {
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

  const [webviewHeight, setWebviewHeight] = useState<number>(0);
  const PageHeaders: Array<string> = ['Property Info', 'User Info', 'Attach Files', 'Data Privacy'];

  const onProductDetailsWebViewMessage = (event: any) => {
    setWebviewHeight(Number(event.nativeEvent.data));
  };

  const showError = (err: string | undefined) => {
    setErrorMessage(err ?? '');
  };

  function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  }

  function ifCloseToTop({layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent) {
    return contentOffset.y == 0;
  }

  const themedStyles = {
    stepperFont: {
      fontFamily: 'Poppins-Regular',
      fontSize: 11,
      color: theme.textColor,
    },
    labels: {
      marginBottom: 5,
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: theme.textColor,
    },
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.regBackground}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'padding'} keyboardVerticalOffset={Platform.OS == 'android' ? 0 : 0} style={{flex: 1}}>
          {/* <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}} nestedScrollEnabled={true}> */}
          <NmStatusBar barColor="transparent" translucent={true} />
          {panelLoading && <LoadingPanel />}
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
              {PageHeaders.map((value, index) => {
                return (
                  <Fragment key={index}>
                    <View style={[styles.stepperContainer, {}]}>
                      <View
                        style={{
                          marginTop: 0,
                          marginBottom: 10,
                          width: 30,
                          height: 30,
                          backgroundColor: index == screenPage - 1 ? '#133561' : index < screenPage - 1 ? '#008C76' : '#848588',
                          borderRadius: 50,
                        }}></View>
                      <Text style={themedStyles.stepperFont}>{value}</Text>
                    </View>
                    {index < PageHeaders.length - 1 && <View style={[styles.horizontalLine]}></View>}
                  </Fragment>
                );
              })}
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
                  alignItems: 'center',
                }}
                style={{
                  width: '100%',
                  paddingHorizontal: 0,
                }}>
                <View style={[styles.pageContainer, {width: screenWidth}]} onStartShouldSetResponder={() => true}>
                  <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={[styles.iconTitle, {color: theme.textColor}]}>{'Property Information'}</Text>
                    <Text style={styles.iconDescription}>{'Please enter the details provided by the property management office.'}</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={[themedStyles.labels]}>
                      {'Account No. '}
                      <Text style={styles.required}>*</Text>
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

                    <Text style={[themedStyles.labels]}>
                      {'Property '}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <NmDropdown items={propertyList} setValue={setPropertyType} value={propertyType} containerStyle={styles.dropdown} />

                    <Text style={[themedStyles.labels]}>
                      {'Customer Type '}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <NmTextInput
                      containerStyle={{marginBottom: 14, backgroundColor: theme.regCustType}}
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
                      titleStyle={[styles.buttonTextStyle, {color: theme.regNextButtonText}]}
                      title="Next"
                      onPress={() => {
                        validatePropInfo();
                      }}
                    />
                    <NmButton
                      style={[
                        styles.buttonStyle,
                        {
                          backgroundColor: theme.regBackButton,
                          marginBottom: 20,
                          marginTop: 10,
                        },
                      ]}
                      titleStyle={[styles.buttonTextStyle, {color: NmColors.buttonTextNoBackground}]}
                      title="Back"
                      onPress={() => {
                        navigation.goBack();
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
            )}
            {screenPage == 2 && (
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  alignItems: 'center',
                }}
                style={{
                  width: '100%',
                  paddingHorizontal: 0,
                }}>
                <View style={[styles.pageContainer, {width: screenWidth}]} onStartShouldSetResponder={() => true}>
                  <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={[styles.iconTitle, {color: theme.textColor}]}>{'User Information'}</Text>
                    <Text style={styles.iconDescription}>{'Please enter the details provided by the property management office.'}</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    {/* <Text style={themedStyles.labels}>
                      {'Name '}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <NmTextInput
                      containerStyle={{marginBottom: 14, backgroundColor: theme.regCustType}}
                      editable={false}
                      textInputStyle={{}}
                      textValue={accountName}
                      textValueHandler={setAccountName}
                      returnKeyType="next"
                    /> */}

                    <Text style={themedStyles.labels}>
                      {'Email Address '}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <NmTextInput
                      containerStyle={[{marginBottom: 14}, !accountEmailEditable && {backgroundColor: theme.regCustType}]}
                      onEndEditing={() => {
                        if (accountEmail != '') {
                          if (NmCheckEmailFormat(accountEmail) == true) {
                            showError('');
                          } else {
                            showError('Invalid Email Address.');
                            setAccountEmail('');
                          }
                        }
                      }}
                      editable={accountEmailEditable}
                      textInputStyle={{}}
                      value={accountEmail}
                      onChangeText={setAccountEmail}
                      returnKeyType="next"
                      maxLength={150}
                    />

                    <Text style={themedStyles.labels}>
                      {'Mobile Number '}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <NmTextInput
                      containerStyle={[{marginBottom: 14}, !accountPhoneEditable && {backgroundColor: theme.regCustType}]}
                      onEndEditing={() => {
                        if (accountPhone != '') {
                          if (accountPhone.toString().length < 11) {
                            showError('Invalid Mobile Number.');
                            setAccountPhone('');
                          } else {
                            showError('');
                          }
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
                      titleStyle={[styles.buttonTextStyle, {color: theme.regNextButtonText}]}
                      title="Next"
                      onPress={() => {
                        validateUserInfo();
                      }}
                    />
                    <NmButton
                      style={[
                        styles.buttonStyle,
                        {
                          backgroundColor: theme.regBackButton,
                          marginBottom: 20,
                          marginTop: 10,
                        },
                      ]}
                      titleStyle={[styles.buttonTextStyle, {color: NmColors.buttonTextNoBackground}]}
                      title="Back"
                      onPress={() => {
                        setScreenPage(1);
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
            )}
            {screenPage == 3 && (
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  alignItems: 'center',
                }}
                style={{
                  width: '100%',
                  paddingHorizontal: 0,
                }}>
                <View style={[styles.pageContainer, {width: screenWidth}]} onStartShouldSetResponder={() => true}>
                  <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={[styles.iconTitle, {color: theme.textColor}]}>{'Attach Files'}</Text>
                    <Text style={styles.iconDescription}>{'Please attach a picture of your I.D and a selfie while holding it.'}</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={themedStyles.labels}>
                      {'Attach Proof of Identification '}
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <NmGalleryPicker
                      fileUploadContainerStyle={{marginBottom: 14}}
                      NmSetFile={setIDFile}
                      NmSetFileName={setIDFileName}
                      NmFileName={IDFileName}
                      NmFileType="PHOTO"
                      NmShowError={showError}
                    />

                    <Text style={themedStyles.labels}>
                      {'Take a Selfie holding your Valid I.D '}
                      <Text style={styles.required}>*</Text>
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
                      titleStyle={[styles.buttonTextStyle, {color: theme.regNextButtonText}]}
                      title="Next"
                      onPress={() => {
                        NmHasInternet().then(result => {
                          if (result == true) {
                            setScreenPage(4);
                            setPrivacyScrolled(false);
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
                          backgroundColor: theme.regBackButton,
                          marginBottom: 20,
                          marginTop: 10,
                        },
                      ]}
                      titleStyle={[styles.buttonTextStyle, {color: NmColors.buttonTextNoBackground}]}
                      title="Back"
                      onPress={() => {
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
                      javaScriptEnabled={true}
                      source={{
                        html: `
                            <html>
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <body style="background-color: ${theme.regWebBackground}; color: ${theme.textColor};">
                                    ${AssetManager.appAssets.PrivacyPolicy}
                                </body>
                                <script>
                                    window.onload = function() {
                                        setTimeout(() => {
                                          const height = document.body.scrollHeight;
                                          window.ReactNativeWebView.postMessage(height.toString());
                                        }, "400");
                                    }
                                </script>
                            </html>
                        `,
                      }}
                      onMessage={onProductDetailsWebViewMessage}
                      //injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
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
                    titleStyle={[styles.buttonTextStyle, {color: theme.regNextButtonText}]}
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
                        backgroundColor: theme.regBackButton,
                        marginBottom: 20,
                        marginTop: 10,
                      },
                    ]}
                    titleStyle={[styles.buttonTextStyle, {color: NmColors.buttonTextNoBackground}]}
                    title="Back"
                    onPress={() => {
                      setScreenPage(3);
                    }}
                  />
                </View>
              </View>
            )}
          </View>
          {/* </ScrollView> */}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
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
    marginTop: -27,
  },
  stepperContainer: {
    width: '22%',
    alignItems: 'center',
  },
  stepperFont: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: 'black',
  },
});

export default RegistrationScreen;
