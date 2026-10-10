import React from 'react';
import {View, StatusBar, Text, FlatList} from 'react-native';

const FoodFavorites = props => {
  // const favorites = [
  //   {
  //     itemName: '',
  //     itemSeller: '',
  //     itemPrice: '',
  //   },
  // ];

  const favorites = [];

  const renderFavorites = ({item, index}) => {
    return <View></View>;
  };

  return (
    <View style={{flex: 1, width: '100%', height: '100%'}}>
      <StatusBar backgroundColor={'#FFF'} />
      <View style={{width: '100%', alignItems: 'center', backgroundColor: '#FFF'}}>
        <Text style={{color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20, paddingVertical: 10}}>{'Favorites'}</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList data={favorites} renderItem={renderFavorites} keyExtractor={(item, index) => index} style={{width: '100%'}} />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: '#555', fontFamily: 'Poppins-Bold', fontSize: 20}}>{'Empty'}</Text>
          <Text style={{color: '#AAA', fontFamily: 'Poppins-Medium', fontSize: 14}}>{'Add your favorites here'}</Text>
        </View>
      )}
    </View>
  );
};

export default FoodFavorites;
