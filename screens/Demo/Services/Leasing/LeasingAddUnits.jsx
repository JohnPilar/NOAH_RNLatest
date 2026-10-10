import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, FlatList, Image, StatusBar, TouchableOpacity, PermissionsAndroid} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import {NmDropdown, NmButton} from '../../../../components';
import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmPicKMultiplePhotos} from '../../../../functions/NmFunctions';

export default function LeasingAddUnits(props) {
  const unitInfo = props?.route?.params?.editInfo;

  const [property, setProperty] = useState(unitInfo?.propCode);
  const [unit, setUnit] = useState(unitInfo?.unitCode);

  const IMG_PLACEHOLDER_ADD = {id: 'DEF_ADD', img: require('../../../../assets/Images/AddImage.jpg')};
  const propImages = unitInfo?.unitImages == undefined ? [IMG_PLACEHOLDER_ADD] : [IMG_PLACEHOLDER_ADD].concat(unitInfo.unitImages);

  const [unitImages, setUnitImages] = useState(propImages);

  const headerText = unitInfo == undefined ? 'Add New Property' : 'Edit Images';
  const buttonText = unitInfo == undefined ? 'Add Property' : 'Save Changes';

  const imgDimensions = WINDOW_WIDTH * 0.3;

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        title: 'NOAH',
        message: 'Allow app to access your files',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //
      } else {
        //cannot continue due to declined permission request
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const properties = [
    {
      label: 'Noah Towers',
      value: 'NOAHTW',
    },
    {
      label: 'Noah Condominium',
      value: 'NOAHCDM',
    },
    {
      label: 'Noah Properties',
      value: 'NOAHPROP',
    },
  ];

  const units = [
    {
      property: 'NOAHTW',
      label: 'Noah-Tower1-9F',
      value: 'NT9F',
      unitImage: require('../../../../assets/Images/Parking/reserved.jpg'),
      address: 'Monserrat St., Gil Puyat Ave. Makati City',
    },
    {
      property: 'NOAHCDM',
      label: 'CDM-01-7A',
      value: 'BA017A',
      unitImage: require('../../../../assets/Images/Parking/condo_2.jpg'),
      address: '8 Gov I Rodriguez, Taguig City',
    },
    {
      property: 'NOAHPROP',
      label: 'NPR-04-3A',
      value: 'NPR043A',
      unitImage: require('../../../../assets/Images/Leasing/unit_3.jpg'),
      address: '2178 Chino Roces Avenue, Makati City',
    },
    //====================================================================
    {
      property: 'NOAHTW',
      label: 'Noah-Tower1-10F',
      value: 'NT10F',
      unitImage: require('../../../../assets/Images/Parking/reserved.jpg'),
      address: 'Monserrat St., Gil Puyat Ave. Makati City',
    },
    {
      property: 'NOAHCDM',
      label: 'CDM-02-8A',
      value: 'BA023A',
      unitImage: require('../../../../assets/Images/Parking/condo_2.jpg'),
      address: '8 Gov I Rodriguez, Taguig City',
    },
    {
      property: 'NOAHPROP',
      label: 'NPR-02-6A',
      value: 'NPR042C',
      unitImage: require('../../../../assets/Images/Leasing/unit_3.jpg'),
      address: '2178 Chino Roces Avenue, Makati City',
    },
  ];

  const renderImages = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={item?.uri != undefined ? true : false}
        style={{width: imgDimensions, height: imgDimensions, padding: 5, paddingLeft: index == 0 ? 0 : 5, paddingRight: index == unitImages.length - 1 ? 0 : 5}}
        activeOpacity={0.5}
        onPress={() => {
          if (item?.id == 'DEF_ADD') {
            NmPicKMultiplePhotos('PHOTO').then(res => {
              if (res != undefined && res.length > 0) {
                let tmpArray = unitImages.filter(item => item?.id == undefined);
                tmpArray = tmpArray.concat(res);
                tmpArray.unshift(IMG_PLACEHOLDER_ADD);
                setUnitImages(tmpArray);
              }
            });
          }
        }}>
        {item?.id != 'DEF_ADD' && (
          <TouchableOpacity
            style={{position: 'absolute', top: 10, right: 10, zIndex: 1, backgroundColor: '#AAA', borderRadius: 6}}
            onPress={() => {
              const tmpArray = [...unitImages];
              tmpArray.splice(index, 1);
              setUnitImages(tmpArray);
            }}>
            <MaterialCommunityIcons name={'close'} size={imgDimensions * 0.2} color={'#FFF'} />
          </TouchableOpacity>
        )}

        <Image source={item?.uri ? {uri: item.uri} : item.img} style={{flex: 1, width: undefined, height: undefined, resizeMode: 'cover', borderRadius: 12}} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#FFF'} />
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{headerText}</Text>
      </View>

      <View style={{width: '100%', marginTop: 20, paddingHorizontal: 16}}>
        <Text style={styles.componentHeader}>{'Select Property'}</Text>
        <NmDropdown
          items={properties}
          value={property}
          setValue={setProperty}
          containerStyle={{borderRadius: 12}}
          mainContainerStyle={{borderRadius: 12}}
          itemStyle={{paddingVertical: 5}}
          disabled={unitInfo != undefined ? true : false}
        />
      </View>

      <View style={{width: '100%', marginTop: 20, paddingHorizontal: 16}}>
        <Text style={styles.componentHeader}>{'Select Unit'}</Text>
        <NmDropdown
          items={units.filter(item => item.property == property)}
          value={unit}
          setValue={setUnit}
          containerStyle={{borderRadius: 12}}
          mainContainerStyle={{borderRadius: 12}}
          itemStyle={{paddingVertical: 5}}
          disabled={unitInfo != undefined ? true : false}
        />
      </View>

      <View style={{width: '100%', marginTop: 20, paddingHorizontal: 16}}>
        <Text style={styles.componentHeader}>{'Add Images'}</Text>
        <FlatList data={unitImages} renderItem={renderImages} keyExtractor={(item, index) => index} horizontal={true} />
      </View>

      <View style={{flex: 1, width: '100%', marginTop: 20, paddingHorizontal: 16, justifyContent: 'flex-end', marginBottom: 10}}>
        <NmButton
          buttonTheme={'dark'}
          style={{borderRadius: 12}}
          titleStyle={{}}
          title={buttonText}
          onPress={() => {
            const tmpUnitImages = [];

            if (unitImages.length > 0) {
              unitImages.slice(1).map(item => {
                if (item?.uri != undefined) {
                  tmpUnitImages.push({uri: item.uri});
                }

                if (item?.img != undefined) {
                  tmpUnitImages.push({img: item.img});
                }
              });
            }

            const newProp = {
              propCode: property,
              itemAction: unitInfo == undefined ? 'ADD' : 'UPDATE',
              unitName: properties.filter(item => item.value == property)[0].label,
              unitNumber: units.filter(item => item.value == unit)[0].label,
              unitCode: unit,
              unitAddress: units.filter(item => item.property == property)[0].address,
              unitLessee: unitInfo == undefined ? 'N/A' : unitInfo.unitLessee,
              lesseePhone: unitInfo == undefined ? 'N/A' : unitInfo.lesseePhone,
              lesseeEmail: unitInfo == undefined ? 'N/A' : unitInfo.lesseeEmail,
              unitImage: units.filter(item => item.property == property)[0].unitImage,
              unitStatus: unitInfo == undefined ? 'N/A' : unitInfo.unitStatus,
              contractExpiration: unitInfo == undefined ? 'N/A' : unitInfo.contractExpiration,
              unitImages: tmpUnitImages,
            };

            EventRegister.emit('updateMyUnits', newProp);
            props.navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  componentHeader: {
    color: '#000',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
});
