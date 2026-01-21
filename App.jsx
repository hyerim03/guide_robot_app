// App.js
import React from 'react';
import { StatusBar, View, Text } from 'react-native';

// components&screen
import Slide from './components/Slide';
import ExitBox from './components/ExitBox';
import StartScreen from './screens/StartScreen';

// function
import { useRosConnect } from './hook/useRosConnect';
import { ensureSerialInitOnce } from './util/serialInit';
import { eyeSequence } from './util/eyeSequence';
import { useUsbSerial } from './hook/useUsbSerial';
import { useEyeSequence } from './hook/useEyeSequence';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ensureSerialInitOnce();

const Stack = createStackNavigator();

export default function App() {
  // useRosConnect('ws://192.168.10.141:9090');

  // const { connected, selectedId, portIf, sendChar } = useUsbSerial();

  // useEyeSequence({
  //   connected,
  //   selectedId,
  //   portIf,
  //   list: eyeSequence,
  //   sendChar,
  // });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="start"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="start" component={StartScreen} />
        <Stack.Screen name="slide" component={Slide} />
      </Stack.Navigator>
    </NavigationContainer>
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text style={{ color: 'red', fontSize: 30 }}>APP ROOT OK</Text>
    // </View>
  );
}
