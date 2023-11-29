import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../utils/Utils';

const BASE_URL = process.env.REACT_APP_SERVER_ENDPOINT;

export const salonApi = createApi({
    reducerPath: 'salonApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/salons`,
        prepareHeaders: (headers) => {
            const accessToken = getToken();
            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Salons'],
    endpoints: (builder) => ({
        createSalon: builder.mutation({
            query(salon) {
              return {
                url: "/create",
                method: "POST",
                credentials: "include",
                body: salon,
              };
            },
            invalidatesTags: [{ type: "Salons", id: "LIST" }],
            transformResponse: (result) => result.note,
          }),
        updateSalon: builder.mutation({
            query({ id, salon }) {
                return {
                    url: `/update/${id}`,
                    method: "PUT",
                    credentials: "include",
                    body: salon,
                };
            },
            invalidatesTags: [{ type: "Salons", id: "LIST" }],
            transformResponse: (result) => result.salon,
        }),
        getSalons: builder.query({
            query: (args) => {
                return {
                    url: '/',
                    params: { ...args },
                    credentials: 'include',
                }
            },
            providesTags(result) {
                if (result) {
                    return [
                        ...result.map(({ id }) => ({
                            type: "Salons",
                            id,
                        })),
                        { type: "Salons", id: "LIST" },
                    ];
                } else {
                    return [{ type: "Salons", id: "LIST" }];
                }
            },
            transformResponse(results) {
                return results.salons;
            },

            async onQueryStarted(args, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) { }
            },
        }),
        getSalon: builder.query({
            query(id) {
                return {
                    url: `/getSalon/${id}`,
                    credentials: "include",
                };
            },
            providesTags: (result, error, id) => {
                return [{ type: "Salons", id }];
            },
            transformResponse(result) {
                return result;
            },
        }),
        deleteSalon: builder.mutation({
            query(id) {
                return {
                    url: `/delete/${id}`,
                    method: "DELETE",
                    credentials: "include",
                };
            },
            invalidatesTags: [{ type: "Salons", id: "LIST" }],
        }),
    })
});

export const {
    useCreateSalonMutation,
    useGetSalonsQuery,
    useGetSalonQuery,
    useUpdateSalonMutation,
    useDeleteSalonMutation,
} = salonApi