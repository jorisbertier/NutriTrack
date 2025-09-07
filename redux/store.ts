import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from "./subscriptionSlice";
import userReducer from './userSlice';
import badgesReducer from './slices/badgeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer,
    badges: badgesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
