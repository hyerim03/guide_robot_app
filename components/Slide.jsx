import { useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
import Sound from 'react-native-sound';
import setSound from '../util/setSound';
import ExitBox from './ExitBox';
import { useNavigation } from '@react-navigation/native';

const img = [
  require('../assets/app_02.png'),
  require('../assets/app_03.png'),
  require('../assets/app_04.png'),
  require('../assets/app_05.png'),
];

const Slide = () => {
  const [index, setIndex] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        if (prev === 3) {
          navigation.navigate('start');
        } else {
          return (prev + 1) % 4;
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ExitBox>
      <Image source={img[index]} style={{ width: '100%', height: '100%' }} />
    </ExitBox>
  );
};

export default Slide;
