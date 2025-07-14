export function formatDuration(ms: number) {
  const hours = Math.floor(ms / 1000 / 60 / 60);
  const mins = Math.floor((ms - hours * 1000 * 60 * 60) / 1000 / 60);
  const secs = Math.floor(
    (ms - hours * 1000 * 60 * 60 - mins * 1000 * 60) / 1000,
  );

  return {
    h: `${hours}`.padStart(2, '0'),
    m: `${mins}`.padStart(2, '0'),
    s: `${secs}`.padStart(2, '0'),
  };
}
