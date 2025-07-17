import throttle from 'lodash/throttle';
import { useEffect, useState } from 'react';

export function useViewport() {
  const [viewport, setViewport] = useState({
    height: window.visualViewport?.height ?? window.innerHeight,
    offsetTop:
      window.visualViewport?.offsetTop ??
      window.document.documentElement.scrollTop,
  });

  useEffect(() => {
    const onResize = throttle(() => {
      if (!window.visualViewport) return;
      setViewport({
        height: window.visualViewport.height ?? window.innerHeight,
        offsetTop:
          window.visualViewport.offsetTop ??
          window.document.documentElement.scrollTop,
      });
    }, 10);

    window.visualViewport?.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('scroll', onResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('scroll', onResize);
    };
  });

  return viewport;
}
