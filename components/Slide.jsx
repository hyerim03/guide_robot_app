import { useEffect, useState, useRef } from 'react';
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
  const readyRef = useRef(false);

  useEffect(() => {
    const welcome = setSound({
      file: 'welcome_sound.mp3',
      name: 'welcome_sound',
    });

    welcomeRef.current = welcome;
    readyRef.current = true;

    const t = setTimeout(() => {
      const s = welcomeRef.current;
      if (!s || !readyRef.current) return;
      try {
        s.stop(() => s.play());
      } catch {}
    }, 120);

    return () => {
      clearTimeout(t);
      const s = welcomeRef.current;
      try {
        s?.stop();
        s?.release();
      } catch {}
      welcomeRef.current = null;
      readyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        // if (prev === 4) {
        const s = welcomeRef.current;
        if (s && readyRef.current) {
          try {
            s.stop(() => s.play());
          } catch {}
        }
        // }

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
