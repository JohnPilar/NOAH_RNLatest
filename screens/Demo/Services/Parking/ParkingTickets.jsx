import React, {useState, useRef, useEffect, memo, useContext} from 'react';
import {View, StatusBar, Text, StyleSheet, ScrollView} from 'react-native';

import QRCodeStyled, {SVGGradient} from 'react-native-qrcode-styled';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Defs, Rect} from 'react-native-svg';

import {LoadingScreen, NmModal} from '../../../../components';
import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {AccountDetailsContext, ParkingTicketContext} from '../../../../functions/Contexts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

var RNFS = require('react-native-fs');

const ParkingTickets = props => {
  const {recname} = useContext(AccountDetailsContext);
  const [loading, setLoading] = useState(true);
  const [savedModalVisible, setSavedModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState();
  const ticketContext = useContext(ParkingTicketContext);

  const QRRef = useRef();

  useEffect(() => {
    StatusBar.setBackgroundColor('#FFF');
  });

  const downloadCurrentQR = async () => {
    try {
      QRRef.current?.toDataURL(async base64Code => {
        const filename = RNFS.PicturesDirectoryPath + '/' + ticketContext.ticketId + '.png';

        RNFS.writeFile(filename, base64Code, 'base64')
          .then(success => {
            setModalMessage('Parking Ticket QR saved to gallery');
            setSavedModalVisible(true);
          })
          .catch(err => {
            setModalMessage('An error occured in saving the QR code to gallery');
            setSavedModalVisible(true);
          });
      });
    } catch (error) {
      console.error('QR downloading failed: ', error);
    }
  };

  const renderBackground = (pieceSize, matrix) => {
    const size = matrix.length * pieceSize + 50;

    return (
      <>
        <Defs>
          <SVGGradient
            id="bgGradient"
            origin={[0, 0]}
            size={size}
            type={'linear'}
            options={{
              colors: ['#01fff2', '#b634e6'],
              start: [-0.3, -0.3],
              end: [0.7, 0.7],
            }}
          />
        </Defs>

        <Rect x={-25} y={-25} width={size} height={size} fill={'#FFF'} />
      </>
    );
  };

  const TicketComponent = memo(function () {
    return (
      <View style={{width: '100%', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#FFF',
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <QRCodeStyled
            ref={QRRef}
            logo={{
              href: require('../../../../assets/Images/NoahQrLogo.jpg'),
              padding: 4,
              scale: 0.8,
            }}
            data={ticketContext.ticketId}
            padding={13}
            pieceSize={10}
            pieceScale={1.02}
            color={'#133561'}
            outerEyesOptions={{borderRadius: 6}}
            renderBackground={renderBackground}
          />
        </View>
        <View style={[{width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingLeft: 0}]}>
          <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 22}} numberOfLines={1}>
            {ticketContext.ticketBuilding}
          </Text>
          <Text style={{fontFamily: 'Poppins-Regular', color: '#000', fontSize: 16}} numberOfLines={1}>
            {ticketContext.ticketAddress}
          </Text>
          <Text style={{fontFamily: 'Poppins-Bold', color: '#000', fontSize: 18}}>{ticketContext.ticketParkId}</Text>
        </View>
      </View>
    );
  });

  useEffect(() => {
    setLoading(false);
  });

  return (
    <View style={{flex: 1, width: '100%', height: '100%', backgroundColor: '#FFF', alignItems: 'center', paddingTop: useSafeAreaInsets().top}}>
      {loading && <LoadingScreen containerStyle={{backgroundColor: '#FFF'}} />}
      <NmModal
        modalType={'WIN_INFO'}
        title={'Parking Ticket'}
        message={modalMessage}
        winVisible={savedModalVisible}
        setWinVisible={setSavedModalVisible}
        onClickOk={() => setSavedModalVisible(false)}
        onClickClose={() => setSavedModalVisible(false)}
        modalStyle={{paddingHorizontal: 20}}
        containerStyle={{width: '100%'}}
      />
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Active Ticket'}</Text>
      </View>
      <ScrollView style={{width: WINDOW_WIDTH}} contentContainerStyle={{flexGrow: 1}}>
        {/* <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16}}>
          <Text style={[styles.poppinsBlack.bold, {fontSize: 18, marginLeft: 0}]}>{'Active Ticket'}</Text>
        </View> */}

        <View style={{flex: 1, width: '100%', paddingHorizontal: 16, paddingBottom: 20}}>
          {ticketContext != undefined ? (
            <View style={{flex: 1}}>
              <TouchableOpacity
                onLongPress={() => {
                  downloadCurrentQR();
                }}
                style={[{backgroundColor: '#EEE', width: '100%', padding: 10, borderRadius: 12, alignItems: 'center'}]}
                activeOpacity={0.85}>
                <TicketComponent />
              </TouchableOpacity>
              <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
                <Text style={[styles.poppinsBlack.bold, {fontSize: 18, marginLeft: 0}]}>{'Ticket Details'}</Text>
              </View>
              <View style={{width: '100%', paddingHorizontal: 16, marginTop: 0}}>
                <Text style={[styles.poppinsBlack.regular, {fontSize: 16}]}>{'Name: '}</Text>
                <Text style={[styles.poppinsBlack.bold, {fontSize: 16}]}>{recname}</Text>
                <Text style={[styles.poppinsBlack.regular, {fontSize: 16, marginTop: 5}]}>{'Vehicle: '}</Text>
                <Text style={[styles.poppinsBlack.bold, {fontSize: 16}]}>{ticketContext.ticketVehicle.details}</Text>
                <Text style={[styles.poppinsBlack.regular, {fontSize: 16, marginTop: 5}]}>{'Plate No: '}</Text>
                <Text style={[styles.poppinsBlack.bold, {fontSize: 16}]}>{ticketContext.ticketVehicle.plateNo}</Text>
                <Text style={[styles.poppinsBlack.regular, {fontSize: 16, marginTop: 5}]}>{'Date: '}</Text>
                <Text style={[styles.poppinsBlack.bold, {fontSize: 16}]}>{ticketContext.ticketDate}</Text>
              </View>
            </View>
          ) : (
            <View style={[{backgroundColor: '#EEE', width: '100%', height: '100%', borderRadius: 12, alignItems: 'center'}]} activeOpacity={0.85}>
              <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: '#555', fontFamily: 'Poppins-Bold', fontSize: 20}}>{'No Active Ticket'}</Text>
                <Text style={{color: '#AAA', fontFamily: 'Poppins-Medium', fontSize: 14}}>{'Your active ticket will appear here'}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  activeBookingBackground: {
    flex: 1,
    backgroundColor: '#FFF',
    width: undefined,
    height: undefined,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    marginHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginBottom: 10,
  },
  poppinsBlack: {
    regular: {fontFamily: 'Poppins-Regular', color: '#000'},
    medium: {fontFamily: 'Poppins-Medium', color: '#000'},
    bold: {fontFamily: 'Poppins-Bold', color: '#000'},
  },
  logoContainer: {
    position: 'absolute',
    width: 88,
    height: 88,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '90%',
    height: '90%',
    top: -2,
  },
});

export default ParkingTickets;
