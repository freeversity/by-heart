import { type FC, useEffect, useRef } from 'react';
import { useRefCallback } from '../../hooks/useRefCallback';
import { useRefValue } from '../../hooks/useRefValue';
import { useTestAtom } from '../../hooks/useTestId';
import { testActiveTryTimeout } from '../../state/tests/testActiveTryAtoms';
import { formatDuration } from '../../utils/formatDuration';

export const Countdown: FC<{
  className?: string;
  timeout: number;
  onTimeout?: () => void;
  isPaused?: boolean;
}> = ({
  className,
  timeout: initialTimeout,
  onTimeout = () => {},
  isPaused,
}) => {
  const [timeoutS, updateTimeout] = useTestAtom(testActiveTryTimeout);

  const handleTimeout = useRefCallback(onTimeout);

  const timeout = (timeoutS ?? initialTimeout) * 1000;

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

      updateTimeout(timeout / 1000);
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [isPaused, isTimedOut, handleTimeout, updateTimeout, timeoutRef]);

  const { h, m, s } = formatDuration(timeout);

  return (
    <div className={className}>
      {!!+h && <span>{h}:</span>}
      <span>{m}:</span>
      <span>{s}</span>
    </div>
  );
};
