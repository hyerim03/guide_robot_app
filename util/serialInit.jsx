// util/serialInit.js
import {
  DataBit,
  DriverType,
  FlowControl,
  initSerialport,
  Mode,
  Parity,
  ReturnedDataType,
  StopBit,
} from '@serserm/react-native-turbo-serialport';

export function ensureSerialInitOnce() {
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
}
