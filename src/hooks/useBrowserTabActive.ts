import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

export function useBrowserTabActive() {
  const [isActive, setActive] = useState(
    document.visibilityState === 'visible',
  );

  useEffect(() => {
    let timer: number;

    const scheduleInactive = () => {
      setActive(document.visibilityState === 'visible');
      clearTimeout(timer);

      timer = setTimeout(() => {
        setActive(false);
      }, 120000);
    };

    scheduleInactive();

    window.addEventListener('touchstart', scheduleInactive);
    window.addEventListener('mousemove', scheduleInactive);

    return () => {
      window.removeEventListener('touchstart', scheduleInactive);
      window.removeEventListener('mousemove', scheduleInactive);
    };
  }, []);

  useEffect(() => {
    const updateVisibility = debounce(() => {
      setActive(document.visibilityState === 'visible');
    });

    document.addEventListener('visibilitychange', updateVisibility);
    document.addEventListener('focus', updateVisibility, false);
    document.addEventListener('blur', updateVisibility, false);
    window.addEventListener('focus', updateVisibility, false);
    window.addEventListener('blur', updateVisibility, false);

    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      document.removeEventListener('focus', updateVisibility, false);
      document.removeEventListener('blur', updateVisibility, false);
      window.removeEventListener('focus', updateVisibility, false);
      window.removeEventListener('blur', updateVisibility, false);
    };
  }, []);

  return isActive;
}
