import { useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
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

  useEffect(() => {
    welcomeRef.current = setSound({
      file: 'welcome_sound.mp3',
      name: 'welcome_sound',
    });

    return () => {
      try {
        welcomeRef.current?.stop();
        welcomeRef.current?.release();
      } catch {}
      welcomeRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (index !== 0) return;

    const time = setTimeout(() => {
      const sound = welcomeRef.current;
      if (!sound) return;
      try {
        sound.stop(() => sound.play());
      } catch {}
    }, 120);

    return () => clearTimeout(time);
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        if (prev === 4) {
          const sound = welcomeRef.current;
          if (sound) {
            try {
              sound.stop(() => sound.play());
            } catch {}
          }
        }
        return (prev + 1) % img.length;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Image source={img[index]} style={{ width: '100%', height: '100%' }} />
  );
};

export default Slide;
