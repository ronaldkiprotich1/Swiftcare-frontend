import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userSlice from '../features/login/userSlice';
import { usersAPI } from '../features/users/usersAPI';
import { loginAPI } from '../features/login/loginAPI';
import { doctorsAPI } from '../features/doctors/doctorsAPI';
import { appointmentsAPI } from '../features/appointments/appointmentsAPI';
import { complaintsAPI } from '../features/complaints/complaintsAPI';
import { prescriptionAPI } from '../features/prescriptions/prescriptionAPI';
import { paymentAPI } from '../features/payments/paymentAPI'; // ✅ fixed import
import tokenExpirationMiddleware from '../utils/tokenExpiryMiddleware';

// redux-persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'], // only persist the user slice
};

// Combine all slices and API reducers
const rootReducer = combineReducers({
  [usersAPI.reducerPath]: usersAPI.reducer,
  [loginAPI.reducerPath]: loginAPI.reducer,
  [doctorsAPI.reducerPath]: doctorsAPI.reducer,
  [appointmentsAPI.reducerPath]: appointmentsAPI.reducer,
  [complaintsAPI.reducerPath]: complaintsAPI.reducer,
  [prescriptionAPI.reducerPath]: prescriptionAPI.reducer,
  [paymentAPI.reducerPath]: paymentAPI.reducer, // ✅ fixed
  user: userSlice,
});

// Apply redux-persist to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(usersAPI.middleware)
      .concat(loginAPI.middleware)
      .concat(doctorsAPI.middleware)
      .concat(appointmentsAPI.middleware)
      .concat(complaintsAPI.middleware)
      .concat(prescriptionAPI.middleware)
      .concat(paymentAPI.middleware) 
      .concat(tokenExpirationMiddleware),
});

export const persistedStore = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
