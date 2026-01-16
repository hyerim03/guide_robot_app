import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SerialScreen = () => {
  return (
    <View>
      <Text style={styles.title}>USB Serial (UNO) - char send</Text>

      <View style={styles.row}>
        {/* <Button title="Search" onPress={search} /> */}
        {/* <Button title="Connect" onPress={connect} /> */}
      </View>

      <Text style={styles.box}>{deviceInfo}</Text>
      <Text style={styles.box}>
        {connected
          ? `CONNECTED \ndeviceId=${selectedId}\nportInterface=${portIf}`
          : 'DISCONNECTED'}
      </Text>

      <View style={styles.row}>
        <Button title="blink (기본)" onPress={() => sendChar('b')} />
        <Button title="Star (별 눈)" onPress={() => sendChar('s')} />
        <Button title="Heart (하트 눈)" onPress={() => sendChar('h')} />
        <Button title="Happy (웃음)" onPress={() => sendChar('y')} />
        <Button title="Wink (윙크)" onPress={() => sendChar('w')} />
        <Button title="Frown (찡그리기)" onPress={() => sendChar('f')} />
        <Button title="Whirl (어지러움)" onPress={() => sendChar('r')} />
      </View>

      <Text style={styles.logTitle}>Log</Text>
      <ScrollView style={styles.logBox}>
        <Text style={styles.logText}>{log || '(no log yet)'}</Text>
      </ScrollView>
    </View>
  );
};

export default SerialScreen;
