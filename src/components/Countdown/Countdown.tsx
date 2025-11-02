import { type FC, useEffect, useState } from 'react';
import { formatDuration } from '../../utils/formatDuration';

export const Countdown: FC<{
  className?: string;
  timeout: number;
  onTimeout?: () => void;
}> = ({ className, timeout }) => {
  const [start, setStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
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
  }, []);

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
