import { type FC, useEffect, useRef, useState } from 'react';
import { useRefCallback } from '../../hooks/useRefCallback';
import { useRefValue } from '../../hooks/useRefValue';
import { formatDuration } from '../../utils/formatDuration';

export const Countdown: FC<{
  className?: string;
  timeout: number;
  onTimeout?: () => void;
  onTick?: (timeout: number, delta: number) => void;
  isPaused?: boolean;
}> = ({
  className,
  timeout: initialTimeout,
  onTimeout = () => {},
  onTick = () => {},
  isPaused,
}) => {
  const [timeout, setTimeLeft] = useState(initialTimeout);

  const handleTimeout = useRefCallback(onTimeout);
  const handleTick = useRefCallback(onTick);

  const isTimedOut = timeout <= 0;

  const timeoutRef = useRefValue(timeout);
  const nowRef = useRef(Date.now());

  useEffect(() => {
    if (isPaused) return;

    if (isTimedOut) {
      handleTimeout();
      return;
    }

    nowRef.current = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();

      const delta = now - nowRef.current;
      const timeout = timeoutRef.current - delta;

      nowRef.current = now;
      setTimeLeft(timeout);

      handleTick(timeout, delta);
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [isPaused, isTimedOut, handleTimeout, handleTick, timeoutRef]);

  const { h, m, s } = formatDuration(timeout);

  return (
    <div className={className}>
      {!!+h && <span>{h}:</span>}
      <span>{m}:</span>
      <span>{s}</span>
    </div>
  );
};
