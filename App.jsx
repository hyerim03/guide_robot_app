// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import Slide from './components/Slide';
import ExitBox from './components/ExitBox';

import { useRosConnect } from './hook/useRosConnect';
import { ensureSerialInitOnce } from './util/serialInit';
import { eyeSequence } from './util/eyeSequence';
import { useUsbSerial } from './hook/useUsbSerial';
import { useEyeSequence } from './hook/useEyeSequence';

ensureSerialInitOnce();

export default function App() {
  useRosConnect('ws://192.168.10.141:9090');

  const { connected, selectedId, portIf, sendChar } = useUsbSerial();

  useEyeSequence({
    connected,
    selectedId,
    portIf,
    list: eyeSequence,
    sendChar,
  });

  return (
    <ExitBox>
      <StatusBar hidden={true} />
      <Slide />
    </ExitBox>
  );
}
