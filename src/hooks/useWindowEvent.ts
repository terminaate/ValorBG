import { useCallback, useEffect } from 'react';

export const useWindowEvent = <K extends keyof WindowEventMap>(
  type: K,
  callback: (ev: WindowEventMap[K]) => void,
) => {
  const listener = useCallback(callback, []);

  useEffect(() => {
    window.addEventListener(type, listener);

    return () => {
      window.removeEventListener(type, listener);
    };
  }, []);
};
