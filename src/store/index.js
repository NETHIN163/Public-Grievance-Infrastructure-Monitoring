import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import complaintsReducer from './slices/complaintsSlice';
import securityReducer from './slices/securitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintsReducer,
    security: securityReducer
  }
});
