import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AppState, StatusBar } from 'react-native';
import {
  DataBit,
  DriverType,
  FlowControl,
  initSerialport,
  Mode,
  Parity,
  ReturnedDataType,
  StopBit,
  useSerialport,
} from '@serserm/react-native-turbo-serialport';
import Slide from './components/Slide';
import RNRestart from 'react-native-restart';
import ExitBox from './components/ExitBox';

const list = [
  { time: 10000, char: 'b' },
  { time: 3000, char: 's' },
  { time: 3000, char: 'h' },
  { time: 3000, char: 'y' },
  { time: 3000, char: 'w' },
  { time: 5000, char: 'r' },
];

if (!globalThis.__SERIAL_INITED__) {
  globalThis.__SERIAL_INITED__ = true;

  initSerialport({
    autoConnect: false,
    mode: Mode.ASYNC,
    params: {
      driver: DriverType.AUTO,
      portInterface: -1,
      returnedDataType: ReturnedDataType.UTF8,
      baudRate: 9600,
      dataBit: DataBit.DATA_BITS_8,
      stopBit: StopBit.STOP_BITS_1,
      parity: Parity.PARITY_NONE,
      flowControl: FlowControl.FLOW_CONTROL_OFF,
    },
  });
}

export default function App() {
  const [devices, setDevices] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // 선택된 deviceId
  const [portIf, setPortIf] = useState(0);
  const [connected, setConnected] = useState(false);

  const selectedIdRef = useRef(null);
  const connectingRef = useRef(false);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  // 이벤트 리스너 등록
  const serialport = useSerialport({
    onError: ({ errorMessage }) => {
      if (String(errorMessage).includes('open')) {
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
      searchAndConnect();
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
      if (connected && selectedIdRef.current != null) return;
      const res = await serialport.listDevices();
      setDevices(res || []);

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
        `Found: deviceId=${first.deviceId}, name=${first.deviceName}, first:${first}`,
      );
      console.log(`Connecting... deviceId=${first.deviceId}`);

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

  // 연결된 디바이스 정보: 현재는 사용하지 않음
  const deviceInfo = useMemo(() => {
    if (!devices.length) return 'Devices: 0';
    const d = devices.find(x => x.deviceId === selectedId) || devices[0];
    return `Devices: ${devices.length}\nselectedId=${selectedId}\nname=${
      d?.deviceName ?? '-'
    }`;
  }, [devices, selectedId]);

  // 아두이노 눈 변화 로직
  useEffect(() => {
    if (!connected) return;

    let cancelled = false;
    let timerId;

    const run = async i => {
      if (cancelled) return;

      const item = list[i];
      await sendChar(item.char);

      const next = (i + 1) % list.length;

      timerId = setTimeout(() => {
        run(next);
      }, item.time);
    };

    // 첫 실행
    run(0);

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [connected, selectedId, portIf]);

  useEffect(() => {
    searchAndConnect();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state !== 'active') {
        searchAndConnect();
      } else {
        const id = selectedIdRef.current;
        if (id != null) {
          try {
            await serialport.disconnect(id);
          } catch {}
        }
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    return () => {
      const id = selectedIdRef.current;
      if (id != null) {
        try {
          serialport.disconnect(id);
        } catch {}
      }
    };
  }, []);

  return (
    <ExitBox>
      <StatusBar hidden={true} />
      <Slide />
    </ExitBox>
  );
}
