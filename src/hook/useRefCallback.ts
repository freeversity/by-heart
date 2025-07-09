import { useCallback, useRef } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: used for extension
export function useRefCallback<TCallback extends (...args: any[]) => any>(
  callback: TCallback,
): (...args: Parameters<TCallback>) => ReturnType<TCallback> {
  const callbackRef = useRef<TCallback>(callback);

  callbackRef.current = callback;

  return useCallback(
    (...args: Parameters<TCallback>) => callbackRef.current(...args),
    [],
  );
}
