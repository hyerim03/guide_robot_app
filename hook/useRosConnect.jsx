import { useEffect, useRef, useState } from 'react';
import * as ROSLIB from 'roslib';

export function useRosConnect(url = 'ws://192.168.10.141:9090') {
  const rosRef = useRef(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const ros = new ROSLIB.Ros();
    rosRef.current = ros;

    const hello = new ROSLIB.Topic({
      ros,
      name: '/hello',
      messageType: 'std_msgs/String',
    });

    ros.connect(url);

    ros.on('connection', () => {
      console.log('ROS Connected!');

      ros.getTopics(result => {
        console.log('ROS Topics:', result);
      });

      hello.subscribe(msg => {
        console.log('ros 전달 데이터', msg.data);
      });
    });

    ros.on('error', error => {
      console.log('rosError', error);
    });

    ros.on('close', () => console.log('ros closed'));

    return () => {
      try {
        ros.close?.();
      } catch {}
      rosRef.current = null;
    };
  }, [url]);

  return rosRef;
}
