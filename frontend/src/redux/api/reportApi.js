import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../utils/Utils';

const BASE_URL = process.env.REACT_APP_SERVER_ENDPOINT;

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/reports`,
    prepareHeaders: (headers) => {
      const accessToken = getToken();
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getReport: builder.query({
      query(args) {
        return {
          url: '/',
          params: { ...args },
          credentials: 'include',
        };
      },
      transformResponse(result) {
        return result;
      },
    }),
  }),
});

export const {
  useGetReportQuery,
} = reportApi
