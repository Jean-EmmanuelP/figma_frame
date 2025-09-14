import { configureStore } from '@reduxjs/toolkit';
import figmaReducer from './figmaSlice';

export const store = configureStore({
  reducer: {
    figma: figmaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;