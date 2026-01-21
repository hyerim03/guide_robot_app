import { Text, StyleSheet, Pressable, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const StartScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
    </View>
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
