import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, View, Dimensions } from 'react-native';
import ExitBox from './ExitBox';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const { width: W, height: H } = Dimensions.get('screen');

const img = [
  require('../assets/app_02.png'),
  require('../assets/app_03.png'),
  require('../assets/app_04.png'),
  require('../assets/app_05.png'),
];

const Slide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);
  const timerRef = useRef(null);

  const navigation = useNavigation();

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (currentIndex === img.length - 1) {
        navigation.navigate('start');
        return;
      }

      sliderRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }, 10000);
  }, [currentIndex, navigation]);

  const viewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems?.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timerRef.current);
  }, [currentIndex, resetTimer]);

  const renderItem = ({ item }) => (
    <View
      style={{
        width: W,
        height: H,
      }}
    >
      <Image
        source={item}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <ExitBox>
      <FlatList
        ref={sliderRef}
        data={img}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(_, i) => String(i)}
        onScrollBeginDrag={resetTimer}
        onMomentumScrollEnd={resetTimer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </ExitBox>
  );
};

export default Slide;
