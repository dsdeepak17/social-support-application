import { useState, useCallback } from 'react';

/**
 * Persist state in localStorage and sync on init.
 */
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item != null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const toStore = value instanceof Function ? value(stored) : value;
        setStored(toStore);
        window.localStorage.setItem(key, JSON.stringify(toStore));
      } catch (e) {
        console.warn('useLocalStorage setItem error', e);
      }
    },
    [key, stored]
  );

  return [stored, setValue];
}

export default useLocalStorage;
