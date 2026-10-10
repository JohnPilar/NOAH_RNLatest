import React, {useEffect, useState} from 'react';
import {StyleSheet, StatusBar, View, Text, ScrollView} from 'react-native';

import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {NmDropdown, NmTextInput, NmButton} from '../../../../components';
import {NmNullOrEmpty} from '../../../../functions/NmFunctions';

export default function PaymentScreen(props) {
  const {billInfo} = props?.route?.params;

  const [biller, setBiller] = useState();
  const [accountNo, setAccountNo] = useState();
  const [accountName, setAccountName] = useState();
  const [amount, setAmount] = useState();
  const [email, setEmail] = useState();
  const [detailsComplete, setDetailsComplete] = useState(false);

  const billerList = [
    {
      billerType: 'BILL_ELECT',
      billerList: [
        {
          value: 'MERALCO',
          label: 'Meralco',
        },
        {
          value: 'CANORECO',
          label: 'Camarines Norte Electric',
        },
        {
          value: 'ISECO',
          label: 'Ilocos Sur Electric',
        },
      ],
    },
    {
      billerType: 'BILL_WATER',
      billerList: [
        {
          value: 'MAN_WATER',
          label: 'Manila Water',
        },
        {
          value: 'CRK_WATER',
          label: 'Clark Water',
        },
        {
          value: 'LAGNA_WATER',
          label: 'Laguna Water',
        },
      ],
    },
    {
      billerType: 'BILL_CARDS',
      billerList: [
        {
          value: 'BDO_AMX',
          label: 'BDO Amex',
        },
        {
          value: 'PNB_CRD',
          label: 'PNB Credit Card',
        },
        {
          value: 'EWBNK',
          label: 'EastWest Bank',
        },
      ],
    },
  ];

  useEffect(() => {
    if (NmNullOrEmpty([biller, accountNo, accountName]) || isNaN(amount) || amount == '0.00') {
      setDetailsComplete(false);
    } else {
      setDetailsComplete(true);
    }
  }, [biller, accountNo, accountName, amount]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#133561'} />
      <ScrollView style={{width: WINDOW_WIDTH}} contentContainerStyle={{flexGrow: 1}}>
        <View style={{width: '100%', alignItems: 'center', backgroundColor: '#133561'}}>
          <Text style={{color: '#FFF', fontFamily: 'Poppins-Bold', fontSize: 20, marginTop: 5, paddingVertical: 10}}>{billInfo.itemName}</Text>
        </View>

        <View style={{width: '100%', marginTop: 20, paddingHorizontal: 16}}>
          <Text style={styles.componentHeader}>{'Select Biller'}</Text>
          <NmDropdown
            items={billerList.filter(item => item.billerType == billInfo.itemCode)[0].billerList}
            value={biller}
            setValue={setBiller}
            containerStyle={{borderRadius: 12}}
            mainContainerStyle={{borderRadius: 12}}
            itemStyle={{paddingVertical: 5}}
          />
        </View>

        <View style={{width: '100%', marginTop: 20, paddingHorizontal: 16}}>
          <Text style={styles.componentHeader}>{'Enter Account Number'}</Text>
          <NmTextInput containerStyle={{borderRadius: 12}} textInputStyle={{fontFamily: 'Poppins-Medium'}} value={accountNo} onChangeText={c => setAccountNo(c.toUpperCase())} blurOnSubmit={false} />
        </View>

        <View style={{width: '100%', marginTop: 20, paddingHorizontal: 16}}>
          <Text style={styles.componentHeader}>{'Enter Account Name'}</Text>
          <NmTextInput
            autoCapitalize={'words'}
            containerStyle={{borderRadius: 12}}
            textInputStyle={{fontFamily: 'Poppins-Medium'}}
            value={accountName}
            onChangeText={setAccountName}
            blurOnSubmit={false}
          />
        </View>

        <View style={{width: '100%', marginTop: 20, paddingHorizontal: 16}}>
          <Text style={styles.componentHeader}>{'Enter Amount'}</Text>
          <NmTextInput
            keyboardType="numeric"
            containerStyle={{borderRadius: 12}}
            textInputStyle={{fontFamily: 'Poppins-Medium'}}
            value={amount}
            onChangeText={setAmount}
            blurOnSubmit={false}
            onBlur={() => {
              const formatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              setAmount(formatter.format(amount));
            }}
          />
        </View>

        <View style={{width: '100%', marginTop: 20, paddingHorizontal: 16}}>
          <Text style={styles.componentHeader}>{'Email'}</Text>
          <NmTextInput
            placeholder="Email address for receipt (Optional)"
            containerStyle={{borderRadius: 12}}
            textInputStyle={{fontFamily: 'Poppins-Medium'}}
            value={email}
            onChangeText={setEmail}
            blurOnSubmit={false}
          />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end', width: '100%', marginTop: 20, paddingHorizontal: 16}}>
          <NmButton
            buttonTheme={'dark'}
            disabled={!detailsComplete}
            style={{borderRadius: 12, marginBottom: 10}}
            titleStyle={{}}
            title={'Next'}
            onPress={() => {
              //
            }}
          />
        </View>
      </ScrollView>
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
