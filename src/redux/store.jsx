
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user'], 
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), 
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
