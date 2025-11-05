import { type FC, useEffect, useState } from 'react';
import { useRefCallback } from '../../hooks/useRefCallback';
import { formatDuration } from '../../utils/formatDuration';

export const Countdown: FC<{
  className?: string;
  timeout: number;
  onTimeout?: () => void;
}> = ({ className, timeout, onTimeout = () => {} }) => {
  const [start, setStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  const handleTimeout = useRefCallback(onTimeout);

  const isTimedOut = start + timeout <= now;

  useEffect(() => {
    if (isTimedOut) {
      handleTimeout();
      return;
    }

    const now = Date.now();

    setStart(now);
    setNow(now);

    const timer = setInterval(() => {
      setNow((prevNow) => {
        const now = Date.now();

        if (now - prevNow < 5000) {
          return now;
        }

        return prevNow;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [isTimedOut, handleTimeout]);

  const delta = timeout + (start - now);

  const { h, m, s } = formatDuration(delta);

  return (
    <div className={className}>
      {!!h && <span>{h}:</span>}
      <span>{m}:</span>
      <span>{s}</span>
    </div>
  );
};
