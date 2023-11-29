import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../utils/Utils';

const BASE_URL = process.env.REACT_APP_SERVER_ENDPOINT;

export const appointmentApi = createApi({
    reducerPath: 'appointmentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/appointments`,
        prepareHeaders: (headers) => {
            const accessToken = getToken();
            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Appointments'],
    endpoints: (builder) => ({
        createAppointment: builder.mutation({
            query(appointment) {
                return {
                    url: "/create",
                    method: "POST",
                    credentials: "include",
                    body: appointment,
                };
            },
            invalidatesTags: [{ type: "Appointments", id: "LIST" }],
            transformResponse: (result) => result.note,
        }),
        updateAppointment: builder.mutation({
            query({ id, appointment }) {
                return {
                    url: `/update/${id}`,
                    method: "PUT",
                    credentials: "include",
                    body: appointment,
                };
            },
            invalidatesTags: [{ type: "Appointments", id: "LIST" }],
            transformResponse: (result) => result.appointment,
        }),
        changeStatusAppointment: builder.mutation({
            query({ id, status }) {
                return {
                    url: `/changeStatus/${id}`,
                    method: "PUT",
                    credentials: "include",
                    body: status,
                };
            },
            invalidatesTags: [{ type: "Appointments", id: "LIST" }],
            transformResponse: (result) => result,
        }),
        getAppointments: builder.query({
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
                            type: "Appointments",
                            id,
                        })),
                        { type: "Appointments", id: "LIST" },
                    ];
                } else {
                    return [{ type: "Appointments", id: "LIST" }];
                }
            },
            transformResponse(results) {
                return results.appointments;
            },

            async onQueryStarted(args, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) { }
            },
        }),
        getAppointment: builder.query({
            query(id) {
                return {
                    url: `/getAppointment/${id}`,
                    credentials: "include",
                };
            },
            providesTags: (result, error, id) => {
                return [{ type: "Appointments", id }];
            },
            transformResponse(result) {
                return result;
            },
        }),
        deleteAppointment: builder.mutation({
            query(id) {
                return {
                    url: `/delete/${id}`,
                    method: "DELETE",
                    credentials: "include",
                };
            },
            invalidatesTags: [{ type: "Appointments", id: "LIST" }],
        }),
    })
});

export const {
    useCreateAppointmentMutation,
    useGetAppointmentsQuery,
    useGetAppointmentQuery,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useChangeStatusAppointmentMutation,
} = appointmentApi