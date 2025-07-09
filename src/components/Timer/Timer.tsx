import { type FC, useEffect, useMemo, useState } from 'react';

export const Timer: FC<{ className?: string }> = ({ className }) => {
  const [now, setNow] = useState(() => Date.now());
  const start = useMemo(() => Date.now(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    });

    return () => {
      clearInterval(timer);
    };
  });

  const delta = now - start;

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
