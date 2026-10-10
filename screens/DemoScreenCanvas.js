import React, {useContext, useState, useEffect, useRef} from 'react';
import {StyleSheet, View, SafeAreaView, Dimensions, StatusBar} from 'react-native';

import {NmButton} from '../components';
import {CreateTrendChart} from '../functions/P8Charts';

//import Canvas from 'react-native-canvas';

const DemoScreenCanvas = props => {
  const canvasRef = useRef(null);
  const [blankState, setBlankState] = useState(true);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const statusBarHeight = StatusBar.currentHeight;

  //console.log('SCR', screenWidth, screenHeight, statusBarHeight);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   canvas.width = screenWidth;
  //   canvas.height = screenHeight - statusBarHeight;
  //   // ctx.fillStyle = 'blue';
  //   // ctx.fillRect(0, 0, 393, 872);

  //   renderCanvas(ctx);
  // }, []);

  // useEffect(() => {
  //   //if (blankState == false) {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   renderCanvas(ctx);
  //   //}
  // }, [blankState]);

  // function renderCanvas(ctx) {
  //   let options = {};
  //   options.canvasID = 'TrendingChart';
  //   options.size = {width: 300, height: 300};
  //   options.data = Math.floor(Math.random() * (100 * 2)) - 100;
  //   options.total = 100;

  //   options.input = {
  //     low: {fillcolor: 'red', filltype: 'color'},
  //     mid: {fillcolor: 'yellow', filltype: 'color'},
  //     high: {fillcolor: 'green', filltype: 'color'},
  //   };
  //   options.marker = {
  //     fillcolor: 'black',
  //     strokecolor: 'black',
  //     filltype: 'color',
  //     linewidth: 1,
  //   };
  //   options.label = {
  //     text: 'NEW',
  //     fontSize: 16,
  //     fontFamily: 'Arial',
  //     fontWeight: 'Bold',
  //     fontStyle: 'Normal',
  //     color: 'black',
  //     display: true,
  //   };
  //   options.percentfont = {
  //     fontSize: 16,
  //     fontFamily: 'Arial',
  //     fontWeight: 'Bold',
  //     fontStyle: 'Normal',
  //     color: 'black',
  //     display: true,
  //   };

  //   CreateTrendChart(ctx, options);

  //   //RENDER HERE
  // }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#28396F'}}>
      <View style={styles.container}>
        <NmButton
          title={'Re-render'}
          onPress={() => {
            setBlankState(!blankState);
          }}
        />
        <Canvas ref={canvasRef} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: '100%',
    height: '100%',
  },
});

export default DemoScreenCanvas;
