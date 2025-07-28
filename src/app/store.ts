
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { loginAPI } from "../features/login/loginAPI";
import userSlice from "../features/users/userSlice";
import { appointmentsAPI } from "../features/appointments/appointmentsAPI";
import { paymentsAPI } from "../features/payments/paymentAPI";
import { complaintsAPI } from "../features/complaints/complaintsAPI";
import { prescriptionsAPI } from "../features/prescriptions/prescriptionAPI";
import { doctorsAPI } from "../features/doctors/doctorsAPI";
import { usersAPI } from "../features/users/userAPI";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user', 'admin']
}
const rootReducer = combineReducers({
    [usersAPI.reducerPath]: usersAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    [appointmentsAPI.reducerPath]: appointmentsAPI.reducer,
    [paymentsAPI.reducerPath]: paymentsAPI.reducer,
    [complaintsAPI.reducerPath]: complaintsAPI.reducer,
    [prescriptionsAPI.reducerPath]:prescriptionsAPI.reducer,
    [doctorsAPI.reducerPath]:doctorsAPI.reducer,
    user: userSlice,


});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(usersAPI.middleware)
        .concat(loginAPI.middleware)
        .concat(appointmentsAPI.middleware)
        .concat(paymentsAPI.middleware)
        .concat(complaintsAPI.middleware)
        .concat(prescriptionsAPI.middleware)
        .concat(doctorsAPI.middleware)

});
export const persistedStore = persistStore(store)
export type RootState = ReturnType<typeof store.getState>