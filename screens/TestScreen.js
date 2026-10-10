import React, {useState, useRef} from 'react';
import {Text, View, StyleSheet, Button, StatusBar, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import Animated, {Transitioning, Transition} from 'react-native-reanimated';

import {LoadingScreen, NmButton, NmTable} from '../components';
import {SafeAreaView} from 'react-native-safe-area-context';

const TestScreen = props => {
  const dropdownValue = props.route?.params?.dropdownValue;
  const radiobuttonValue = props.route?.params?.radiobuttonValue;

  const testTable = [
    {
      'Request Docno': '001-MO0UVUKGQF',
      'Request Type': 'Non Billable',
      'Proposed Date': '09/02/2023',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/04/2023',
      Status: 'Draft',
      btnView: '',
    },
    {
      'Request Docno': '002-B1NIL9EVWX',
      'Request Type': 'Non Billable',
      'Proposed Date': '12/30/2023',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/05/2023',
      Status: 'Ongoing',
      btnView: '',
    },
    {
      'Request Docno': '003-0M7J2GTQ3X',
      'Request Type': 'Non Billable',
      'Proposed Date': '05/20/2023',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/06/2023',
      Status: 'Completed',
      btnView: '',
    },
    {
      'Request Docno': '004-VWQ8I7BJWH',
      'Request Type': 'Non Billable',
      'Proposed Date': '01/19/2020',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/07/2023',
      Status: 'Draft',
      btnView: '',
    },
    {
      'Request Docno': '005-7B4WNAVK0I',
      'Request Type': 'Non Billable',
      'Proposed Date': '03/30/2020',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/08/2023',
      Status: 'Ongoing',
      btnView: '',
    },
    {
      'Request Docno': '006-3KMWIF4Y4X',
      'Request Type': 'Non Billable',
      'Proposed Date': '08/11/2023',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/09/2023',
      Status: 'Completed',
      btnView: '',
    },
    {
      'Request Docno': '007-843EJJWOFX',
      'Request Type': 'Non Billable',
      'Proposed Date': '07/30/2023',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/12/2023',
      Status: 'Draft',
      btnView: '',
    },
    {
      'Request Docno': '008-LJ5I80RKU3',
      'Request Type': 'Non Billable',
      'Proposed Date': '06/09/2023',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/14/2023',
      Status: 'Ongoing',
      btnView: '',
    },
    {
      'Request Docno': '009-VOKRXXCT85',
      'Request Type': 'Non Billable',
      'Proposed Date': '10/09/2022',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/17/2023',
      Status: 'Completed',
      btnView: '',
    },
    {
      'Request Docno': '010-IK8JFSO3SE',
      'Request Type': 'Non Billable',
      'Proposed Date': '04/02/2021',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/24/2023',
      Status: 'Draft',
      btnView: '',
    },
    {
      'Request Docno': '011-H3R3CJZFUJ',
      'Request Type': 'Non Billable',
      'Proposed Date': '12/04/2022',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/30/2023',
      Status: 'Ongoing',
      btnView: '',
    },
    {
      'Request Docno': '012-VKGN6UWUN5',
      'Request Type': 'Non Billable',
      'Proposed Date': '02/30/2023',
      'Basis for Billing': 'Daily',
      'disTransaction Date': '07/01/2023',
      Status: 'Completed',
      btnView: '',
    },
  ];

  const [tableStyle, setTableStyle] = useState('TABLE_LIST');
  const [loading, setLoading] = useState(false);

  const [myTable, setMyTable] = useState(testTable);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingBottom: 16}}>
        {loading && <LoadingScreen />}
        <NmButton
          style={styles.actionButtons}
          title={'Change View'}
          onPress={() => {
            setTableStyle(tableStyle == 'TABLE_GRID' ? 'TABLE_LIST' : 'TABLE_GRID');
          }}
        />
        <NmTable tableStyle={tableStyle} items={myTable} setItems={setMyTable} style={{marginTop: 16}}></NmTable>
      </View>
    </SafeAreaView>
  );
};

const componentDidUpdate = () => {
  setLoading(false);
};

const styles = StyleSheet.create({
  actionButtons: {
    marginTop: 20,
  },
});

export default TestScreen;

// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
// }

// const Hour = ({hour, min, pm}) => (
//   <View
//     style={{
//       flexDirection: 'row',
//       alignItems: 'flex-end',
//     }}>
//     <Text style={{fontSize: 40, textAlignVertical: 'center', color: 'black'}}>
//       {hour}:{min}
//     </Text>
//     <Text style={{color: 'gray', marginBottom: 7, marginLeft: 4}}>{pm ? 'PM' : 'AM'}</Text>
//   </View>
// );

// const Location = ({label, name, delay}) => (
//   <>
//     <Text style={{color: 'gray'}}>{label}</Text>
//     <Text style={{fontSize: 26, color: 'black'}}>{name}</Text>
//   </>
// );

// const Spacer = ({height}) => <View style={{flex: 1, maxHeight: height}} />;

// const Tix = () => (
//   <View style={{marginHorizontal: 20, flexGrow: 1}}>
//     <Spacer height={20} />
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'flex-end',
//         justifyContent: 'space-between',
//       }}>
//       <Hour hour="11" min="45" am />
//       <Text style={{fontSize: 40, color: 'black'}}>✈</Text>
//       <Hour hour="1" min="55" pm />
//     </View>
//     <Spacer height={20} />
//     <Location label="From" name="Kraków (KRK)" delay={40} />
//     <Spacer height={20} />
//     <Location label="To" name="Amsterdam (AMS)" delay={80} />
//     <Spacer height={20} />
//     <Text style={{color: 'gray'}}>Notes</Text>
//     <Text style={{lineHeight: 20, color: 'black'}}>
//       Crashtest Airlanes · Economy · Embraer RJ-175 {'\n'}
//       CRA 2199 {'\n'}
//       Plane and crew by Bold & Brave ltd.
//     </Text>
//     <View style={{flex: 2}} />
//   </View>
// );

// function TestScreen() {
//   let [refreshed, setRefreshed] = useState(1);
//   const ref = useRef();

//   const transition = (
//     <Transition.Sequence>
//       <Transition.Out type="fade" durationMs={400} interpolation="easeIn" />
//       <Transition.Change />
//       <Transition.Together>
//         <Transition.In type="slide-bottom" durationMs={400} interpolation="easeOut" propagation="bottom" />
//         <Transition.In type="fade" durationMs={200} delayMs={200} />
//       </Transition.Together>
//     </Transition.Sequence>
//   );

//   return (
//     <View style={{flex: 1}}>
//       <Button
//         title="refresh"
//         color="#FF5252"
//         onPress={() => {
//           ref.current.animateNextTransition();
//           setRefreshed(refreshed + 1);
//         }}
//       />
//       <Transitioning.View
//         ref={ref}
//         transition={transition}
//         style={{
//           flexGrow: 1,
//           justifyContent: 'center',
//         }}>
//         <Tix key={refreshed} />
//       </Transitioning.View>
//     </View>
//   );
// }
