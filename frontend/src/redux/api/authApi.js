import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getMeApi } from './getMeApi';
import { removeToken, removeUserData, setToken, setUserData } from '../../utils/Utils';
import { logout } from '../features/userSlice';

const BASE_URL = process.env.REACT_APP_SERVER_ENDPOINT;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/auth/`,
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query(data) {
        return {
          url: 'register',
          method: 'POST',
          body: data,
        };
      },
    }),
    loginUser: builder.mutation({
      query(data) {
        return {
          url: 'login',
          method: 'POST',
          body: data,
          credentials: 'include',
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          setToken(response.data.accessToken);
          setUserData(JSON.stringify(response.data.userData));
          await dispatch(getMeApi.endpoints.getMe.initiate(null));
        } catch (error) {}
      },
    }),
    adminLoginUser: builder.mutation({
      query(data) {
        return {
          url: 'admin/login',
          method: 'POST',
          body: data,
          credentials: 'include',
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          setToken(response.data.accessToken);
          setUserData(JSON.stringify(response.data.userData));
          await dispatch(getMeApi.endpoints.getMe.initiate(null));
        } catch (error) {}
      },
    }),
    logoutUser: builder.mutation({
      query() {
        return {
          url: 'logout',
          credentials: 'include',
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          removeToken();
          removeUserData();
          dispatch(logout());
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useAdminLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = authApi;
