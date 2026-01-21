// hook/useUsbSerial.js
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import RNRestart from 'react-native-restart';
import { useSerialport } from '@serserm/react-native-turbo-serialport';

export function useUsbSerial() {
  const [selectedId, setSelectedId] = useState(null);
  const [portIf, setPortIf] = useState(0);
  const [connected, setConnected] = useState(false);

  const selectedIdRef = useRef(null);
  const connectingRef = useRef(false);
  const openErrCountRef = useRef(0);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const serialport = useSerialport({
    onError: ({ errorMessage }) => {
      if (String(errorMessage).includes('open')) {
        openErrCountRef.current += 1;
        if (openErrCountRef.current <= 2) {
          connectingRef.current = false;
          setTimeout(() => searchAndConnect(), 700);
          return;
        }
        console.log('errorMessaage', errorMessage);
        Alert.alert(
          'USB 오류',
          '연결을 복구할 수 없습니다.\n앱을 다시 시작합니다.',
          [{ text: '확인', onPress: () => RNRestart.Restart() }],
        );
      }
    },
    onConnected: ({ deviceId, portInterface }) => {
      setSelectedId(deviceId);
      setPortIf(portInterface);
      setConnected(true);
      console.log(
        `CONNECTED  deviceId=${deviceId}, portInterface=${portInterface}`,
      );
    },
    onDisconnected: ({ deviceId, portInterface }) => {
      setConnected(false);
      console.log(
        `DISCONNECTED deviceId=${deviceId}, portInterface=${portInterface}`,
      );
    },
    onDeviceAttached: () => {
      console.log('Device attached');
      setTimeout(() => searchAndConnect(), 500);
    },
    onDeviceDetached: () => {
      console.log('Device detached');
      setConnected(false);
    },
    onReadData: ({ data }) => {
      console.log(`RX: ${data}`);
    },
  });

  async function searchAndConnect() {
    if (connectingRef.current) return;
    connectingRef.current = true;

    try {
      const res = await serialport.listDevices();

      if (!res?.length) {
        setSelectedId(null);
        console.log('No USB devices found');
        return;
      }

      const first = res[0];
      setSelectedId(first.deviceId);
      const currentId = selectedIdRef.current;

      if (connected && currentId === first.deviceId) return;

      if (currentId != null) {
        try {
          await serialport.disconnect(currentId);
        } catch {}
        await new Promise(r => setTimeout(r, 300));
      }

      console.log(
        '[TRY CONNECT]',
        first.deviceId,
        'currentId=',
        currentId,
        'connected=',
        connected,
      );

      await serialport.connect(first.deviceId);
    } finally {
      connectingRef.current = false;
    }
  }

  async function sendChar(ch) {
    if (!connected || selectedId == null) {
      Alert.alert('Not connected');
      return;
    }
    try {
      await serialport.writeString(ch, selectedId, portIf);
      console.log(`TX: ${ch}`);
    } catch (e) {
      console.log('write error: ' + (e?.message ?? String(e)));
    }
  }

  useEffect(() => {
    searchAndConnect();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        searchAndConnect();
      } else {
        const id = selectedIdRef.current;
        if (id != null) {
          try {
            await serialport.disconnect(id);
            setConnected(false);
            setSelectedId(null);
          } catch {}
        }
      }
    });
    return () => sub.remove();
  }, []);

  return {
    connected,
    selectedId,
    portIf,
    sendChar,
  };
}
