import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from './api/authApi';
import { getMeApi } from './api/getMeApi';
import userReducer from './features/userSlice';
import usersReducer from './features/usersSlice';
import { userApi } from './api/userApi';
import { salonApi } from './api/salonApi';
import { appointmentApi } from './api/appointmentApi';
import { reportApi } from './api/reportApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [getMeApi.reducerPath]: getMeApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [salonApi.reducerPath]: salonApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    userState: userReducer,
    usersState: usersReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([authApi.middleware, getMeApi.middleware, userApi.middleware, salonApi.middleware, appointmentApi.middleware, reportApi.middleware]),
});

export var RootState = store.getState();
export var AppDispatch = store.dispatch;
export function useAppDispatch() {
  return useDispatch(AppDispatch);
}
export function useAppSelector(selector) {
  return useSelector(selector);
}
