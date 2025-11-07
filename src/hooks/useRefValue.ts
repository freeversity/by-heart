import { type RefObject, useInsertionEffect, useRef } from 'react';

export function useRefValue<TValue>(value: TValue): RefObject<TValue> {
  const valueRef = useRef<TValue>(value);

  useInsertionEffect(() => {
    valueRef.current = value;
  });

  return valueRef;
}
