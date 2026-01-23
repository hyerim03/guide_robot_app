// hook/useEyeSequence.js
import { useEffect } from 'react';

export function useEyeSequence({
  connected,
  selectedId,
  portIf,
  list,
  sendChar,
}) {
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

    run(0);

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [connected, selectedId, portIf]);
}
