import { useEffect, useState, useRef } from 'react';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import setSound from '../util/setSound';

const img = [
  require('../assets/app_01.png'),
  require('../assets/app_02.png'),
  require('../assets/app_03.png'),
  require('../assets/app_04.png'),
  require('../assets/app_05.png'),
];

Sound.setCategory('Playback');

const Slide = () => {
  const [index, setIndex] = useState(0);

  const welcomeRef = useRef(null);

  const welcome = setSound({
    file: 'welcome_sound.mp3',
    name: 'welcome_sound',
  });

  const welcomeRef = useRef(null);
  const readyRef = useRef(false);

  // 첫 인사 음원 재생 로직
  useEffect(() => {
    readyRef.current = true;
    if (index === 0) {
      setTimeout(() => {
        welcome.stop(() => welcome.play());
      }, 120);
    }

    welcomeRef.current = welcome;

    return () => {
      try {
        welcome.stop();
        welcome.release();
      } catch {}
      welcomeRef.current = null;
      readyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        if (prev === 4) {
          welcome.play();
        }
        return (prev + 1) % img.length;
      });
      console.log(index);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Image source={img[index]} style={{ width: '100%', height: '100%' }} />
  );
};

export default Slide;
