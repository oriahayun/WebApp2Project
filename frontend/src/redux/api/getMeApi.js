import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setUser } from '../features/userSlice';
import { getToken, removeToken, removeUserData, setUserData } from '../../utils/Utils';
import socketIOClient from 'socket.io-client';

const BASE_URL = process.env.REACT_APP_SERVER_ENDPOINT;
const socket = socketIOClient(BASE_URL);

export const getMeApi = createApi({
  reducerPath: 'getMeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/users`,
    prepareHeaders: (headers) => {
      const accessToken = getToken();
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getMe: builder.query({
      query() {
        return {
          url: '/personal/me',
          credentials: 'include',
        };
      },
      transformResponse(result) {
        return result.user;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) { }
      },
    }),
    updateMe: builder.mutation({
      query({ id, user }) {
        return {
          url: `/update/${id}`,
          method: "PUT",
          credentials: "include",
          body: user,
        };
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          setUserData(JSON.stringify(response.data.user));
        } catch (error) { }
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
          const response = await queryFulfilled;
          socket.emit('logout', response.data.userId);
          socket.disconnect();
          removeToken();
          removeUserData();
          dispatch(logout());
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useUpdateMeMutation,
  useLogoutUserMutation,
} = getMeApi
