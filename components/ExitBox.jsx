import { useRef } from 'react';
import {
  Alert,
  BackHandler,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const ExitBox = ({ children }) => {
  const tapCounterRef = useRef(0);
  const timeRef = useRef(null);

  const onTap = () => {
    tapCounterRef.current += 1;

    if (tapCounterRef.current === 1) {
      timeRef.current = setTimeout(() => {
        tapCounterRef.current = 0;
      }, 2000);
    }

    if (tapCounterRef.current >= 3) {
      clearTimeout(timeRef.current);
      tapCounterRef.current = 0;

      Alert.alert('앱 종료', '앱을 종료합니다.', [
        { text: '취소' },
        { text: '확인', onPress: () => BackHandler.exitApp() },
      ]);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={onTap}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: 80, // 상단 80px
            zIndex: 10,
          }}
        />
      </TouchableWithoutFeedback>
      {children}
    </View>
  );
};

export default ExitBox;
