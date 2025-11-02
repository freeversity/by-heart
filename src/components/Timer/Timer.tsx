import { type FC, useEffect, useMemo, useState } from 'react';
import { useBrowserTabActive } from '../../hooks/useBrowserTabActive';
import { useRefCallback } from '../../hooks/useRefCallback';
import { formatDuration } from '../../utils/formatDuration';

export const Timer: FC<{
  className?: string;
  onPause?: (start: number, end: number) => void;
  timeout?: number;
  onTimeout?: () => void;
}> = ({ className, onPause, timeout }) => {
  const [ranges, setTimeRanges] = useState<[number, number][]>([]);
  const [start, setStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  const isDocVisible = useBrowserTabActive();

  const pauseTimer = useRefCallback((now: number = Date.now()) => {
    onPause?.(start, now);
    setTimeRanges((ranges) => [...ranges, [start, now]]);
    setStart(Date.now());
    setNow(Date.now());
  });

  useEffect(() => {
    const onUnload = () => {
      pauseTimer();
    };
    window.addEventListener('beforeunload', onUnload);

    return () => {
      window.removeEventListener('beforeunload', onUnload);
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
          pauseTimer(prevNow);
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
  const formattedTimeout = timeout && formatDuration(timeout);

  return (
    <div className={className}>
      {!!h && <span>{h}:</span>}
      <span>{m}:</span>
      <span>{s}</span>
      {!!formattedTimeout && (
        <>
          /{!!formattedTimeout.h && <span>{formattedTimeout.h}:</span>}
          <span>{formattedTimeout.m}:</span>
          <span>{formattedTimeout.s}</span>
        </>
      )}
    </div>
  );
};
