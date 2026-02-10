import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from '@/store/applicationSlice.js';

export const store = configureStore({
  reducer: {
    application: applicationReducer,
  },
});
