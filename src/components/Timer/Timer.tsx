import { type FC, useEffect, useMemo, useState } from 'react';
import { useBrowserTabActive } from '../../hooks/useBrowserTabActive';
import { useRefCallback } from '../../hooks/useRefCallback';
import { formatDuration } from '../../utils/formatDuration';

export const Timer: FC<{
  className?: string;
  onPause?: (start: number, end: number) => void;
}> = ({ className, onPause }) => {
  const [ranges, setTimeRanges] = useState<[number, number][]>([]);
  const [start, setStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  const isDocVisible = useBrowserTabActive();

  const pauseTimer = useRefCallback(() => {
    const now = Date.now();

    onPause?.(start, now);
    setTimeRanges((ranges) => [...ranges, [start, now]]);
    setStart(now);
    setNow(now);
  });

  useEffect(() => {
    window.addEventListener('beforeunload', pauseTimer);

    return () => {
      window.removeEventListener('beforeunload', pauseTimer);
    };
  }, [pauseTimer]);

  useEffect(() => {
    if (!isDocVisible) return;

    const now = Date.now();

    setStart(now);
    setNow(now);

    const timer = setInterval(() => {
      setNow((prevNow) => {
        const now = Date.now();

        if (now - prevNow < 5000) {
          return now;
        }

        setTimeout(() => {
          pauseTimer();
        }, 0);

        return prevNow;
      });
    }, 500);

    return () => {
      clearInterval(timer);
      pauseTimer();
    };
  }, [isDocVisible, pauseTimer]);

  const delta =
    useMemo(
      () => ranges.reduce((delta, [start, end]) => delta + end - start, 0),
      [ranges],
    ) +
    now -
    start;

  const { h, m, s } = formatDuration(delta);

  return (
    <div className={className}>
      {!!h && <span>{h}:</span>}
      <span>{m}:</span>
      <span>{s}</span>
    </div>
  );
};
