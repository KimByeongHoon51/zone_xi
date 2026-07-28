// hooks/useCallbackRef.ts — 콜백을 안정적인 ref로 유지 (리렌더 시 최신값 참조)
import { useRef, useEffect } from 'react';

export function useCallbackRef<T>(cb: T | undefined) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  return ref;
}
