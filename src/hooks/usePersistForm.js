import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { APPLICATION_STORAGE_KEY } from '@/store/applicationSlice.js';

const STORAGE_KEY = APPLICATION_STORAGE_KEY;

/**
 * Persists Redux application state to localStorage on every relevant change.
 */
export function usePersistForm() {
  const application = useSelector((state) => state.application);

  useEffect(() => {
    console.log('usePersistForm: saving application', application);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(application));
    } catch (e) {
      console.warn('usePersistForm: failed to save', e);
    }
  }, [application]);
}

export default usePersistForm;
