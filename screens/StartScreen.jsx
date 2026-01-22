import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import setSound from '../util/setSound';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';
import ExitBox from '../components/ExitBox';

Sound.setCategory('Playback');

const StartScreen = () => {
  const navigation = useNavigation();
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

  // 초기 화면을 열자마자 1회 실행하는 코드
  // useEffect(() => {
  //   const time = setTimeout(() => {
  //     const sound = welcomeRef.current;
  //     if (!sound) return;
  //     try {
  //       sound.stop(() => sound.play());
  //     } catch {}
  //   }, 120);

  //   return () => clearTimeout(time);
  // }, []);

  // 반복 실행하는 코드
  useEffect(() => {
    const interval = setInterval(() => {
      const sound = welcomeRef.current;
      if (sound) {
        try {
          sound.stop(() => sound.play());
        } catch {}
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ExitBox>
      <LinearGradient style={styles.container} colors={['#CCDFFF', '#ffffff']}>
        <Text style={styles.mainText}>어서오세요</Text>
        <Text style={styles.subText}>
          안내를 받으시려면 {'\n'}아래 버튼을 눌러주세요.
        </Text>
        <Pressable
          onPress={() => navigation.navigate('slide')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>START</Text>
        </Pressable>
      </LinearGradient>
    </ExitBox>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 48,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    gap: 80,
  },
  mainText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4A7FDA',
  },
  subText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4A7FDA',
    textAlign: 'center',
    lineHeight: 50,
  },
  button: {
    width: '100%',
    height: 110,
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: '#A6BCEC',
    borderWidth: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 40,
    color: '#4A7FDA',
    fontWeight: '500',
  },
});
