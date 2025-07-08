
// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// import storage from 'redux-persist/lib/storage'; 
// import { persistReducer, persistStore } from 'redux-persist';

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth'], 
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);
// export default store;


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
