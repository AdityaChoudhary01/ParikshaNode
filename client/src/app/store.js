import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/app/slices/authSlice'; // Use path alias for consistency

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});