import Sound from 'react-native-sound';

const setSound = ({ file, name }) => {
  return new Sound(file, Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log(`${name} 음성에 오류 발생 error: `, error);
      return;
    }
  });
};

export default setSound;
