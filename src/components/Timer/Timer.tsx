import { type FC, useEffect, useMemo, useState } from 'react';
import { useBrowserTabActive } from '../../hooks/useBrowserTabActive';
import { useRefCallback } from '../../hooks/useRefCallback';

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
      setNow(Date.now());
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

  const hours = Math.floor(delta / 1000 / 60 / 60);
  const mins = Math.floor((delta - hours * 1000 * 60 * 60) / 1000 / 60);
  const secs = Math.floor(
    (delta - hours * 1000 * 60 * 60 - mins * 1000 * 60) / 1000,
  );

  return (
    <div className={className}>
      {!!hours && <span>{`${hours}`.padStart(2, '0')}:</span>}
      <span>{`${mins}`.padStart(2, '0')}:</span>
      <span>{`${secs}`.padStart(2, '0')}</span>
    </div>
  );
};
