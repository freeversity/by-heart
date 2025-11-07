import { useCallback } from 'react';
import { useRefValue } from './useRefValue';

// biome-ignore lint/suspicious/noExplicitAny: used for extension
export function useRefCallback<TCallback extends (...args: any[]) => any>(
  callback: TCallback,
): (...args: Parameters<TCallback>) => ReturnType<TCallback> {
  const callbackRef = useRefValue(callback);

  return useCallback(
    (...args: Parameters<TCallback>) => callbackRef.current(...args),
    [callbackRef],
  );
}
