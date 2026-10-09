import {useEffect, useState} from 'react';
import {Dimensions, useWindowDimensions} from 'react-native';

/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

/**
 * A React Hook which updates when the orientation changes
 * @returns whether the user is in 'PORTRAIT' or 'LANDSCAPE'
 */
export function useOrientation() {
  // State to hold the connection status
  const [orientation, setOrientation] = useState(
    isPortrait() ? 'PORTRAIT' : 'LANDSCAPE',
  );

  useEffect(() => {
    const callback = () => setOrientation(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');

    const listener = Dimensions.addEventListener('change', callback);

    return () => {
      listener.remove();
    };
  }, []);

  return orientation;
}

export function useDeviceOrientation(){
  const [orientation, setOrientation] = useState("PORTRAIT");

  useEffect(() => {
    Dimensions.addEventListener('change', ({window:{width,height}})=>{
      if (width<height) {
        setOrientation("PORTRAIT")
      } else {
        setOrientation("LANDSCAPE")
      }
    });

  }, []);

  return orientation;
}

export function useIsLandscape() {
  const {height, width} = useWindowDimensions();


  
  return width > height
}