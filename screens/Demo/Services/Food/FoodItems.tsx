import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList, TextInput, StyleSheet, TouchableOpacity, ListRenderItem} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EventRegister} from 'react-native-event-listeners';

import {NmGetCurrencyFormat} from '../../../../functions/NmFunctions';
import NmStyles from '../../../../constants/NmStyles';
import NmColors from '../../../../constants/NmColors';
import {WINDOW_WIDTH} from '../../../../constants/NmStyles';
import {LoadingPanel} from '../../../../components';
import {SampleFoodItems} from '../../../../Global/GlobalVariable';

interface FoodItemsProps {
  route?: {
    params?: {
      foodCategory?: string;
    };
  };
}

export default function FoodItems(props: FoodItemsProps): React.JSX.Element {
  const foodCategory = props?.route?.params?.foodCategory;

  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [foodItems, setFoodItems] = useState<any[]>(SampleFoodItems);
  const [headerTitle, setHeaderTitle] = useState<string>('Browse Items');

  useEffect(() => {
    if (foodCategory != undefined) {
      let tmpItems = foodItems.filter((i: any) => i.itemCategory == foodCategory);
      setFoodItems(tmpItems);
      setHeaderTitle('Select items to add');
    }

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const renderItem: ListRenderItem<any> = ({item, index}) => {
    const imgDimensions = WINDOW_WIDTH * 0.2;

    return (
      <View style={{width: '100%', paddingVertical: 5}}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{width: '100%', backgroundColor: '#f4f4f4', borderRadius: 12, padding: 10}}
          onPress={() => {
            //
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image source={item.itemImage} style={{width: imgDimensions, height: imgDimensions, borderRadius: 12, backgroundColor: '#FFF'}} />
            <View style={{flex: 1, paddingLeft: 10, justifyContent: 'center'}}>
              <Text style={{color: '#000', fontSize: 16, fontFamily: 'Poppins-Bold'}} numberOfLines={1}>
                {item.itemName}
              </Text>
              <Text style={{color: 'rgba(0,0,0,0.3)', fontSize: 16, fontFamily: 'Poppins-Medium'}} numberOfLines={1}>
                {item.itemSeller}
              </Text>
              <Text style={{color: '#000', fontSize: 18, fontFamily: 'Poppins-Bold'}}>{NmGetCurrencyFormat(item.itemPrice, 'PHP', 2)}</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity
                style={{backgroundColor: '#FFF', borderRadius: 12, padding: 10}}
                onPress={() => {
                  let tmpItem = item;
                  tmpItem.itemAction = 'ADD';
                  tmpItem.itemQuantity = 1;
                  tmpItem.type = 'CART';
                  EventRegister.emit('updateFoodOrders', tmpItem);
                }}>
                <MaterialCommunityIcons style={{}} name={'cart-plus'} size={20} color={'#777'} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Browse Items'}</Text>
      </View>

      <View style={{width: '100%', paddingHorizontal: 16, marginBottom: 10}}>
        <View style={[NmStyles.textInputContainer, {borderRadius: 12, borderWidth: 0, marginRight: 16, backgroundColor: '#EEE'}]}>
          <View style={{paddingLeft: 10, flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <MaterialCommunityIcons style={{paddingHorizontal: 0}} name={'magnify'} size={30} color={'#CCC'} />
          </View>
          <TextInput
            style={[NmStyles.textInput, {marginLeft: -2}]}
            placeholderTextColor={NmColors.placeholderTextColor}
            onChangeText={(value: string) => setSearchValue(value)}
            value={searchValue}
            placeholder="Search by name"
          />
        </View>
      </View>

      <View style={{flex: 1, width: '100%', paddingHorizontal: 16, marginBottom: 5, alignItems: 'center'}}>
        {loading == true ? <LoadingPanel panelStyle={{}} /> : <FlatList data={foodItems} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} style={{width: '100%'}} />}
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
});
