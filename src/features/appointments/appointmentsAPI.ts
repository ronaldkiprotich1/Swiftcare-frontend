import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TAppointment = {
  appointmentId: number;
  userId: number;
  doctorId: number;
  appointmentDate: string; // e.g., "2025-08-01"
  timeSlot: string;         // e.g., "10:00 AM - 11:00 AM"
  status?: string;          // optional: 'scheduled', 'cancelled', etc.
};

export const appointmentsAPI = createApi({
  reducerPath: "appointmentsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Appointment"],

  endpoints: (builder) => ({
    // GET /appointments
    getAppointments: builder.query<TAppointment[], void>({
      query: () => "/appointments",
      providesTags: ["Appointment"],
    }),

    // GET /appointments/:id
    getAppointmentById: builder.query<TAppointment, number>({
      query: (id) => `/appointments/${id}`,
    }),

    // POST /appointments
    createAppointment: builder.mutation<TAppointment, Partial<TAppointment>>({
      query: (appointment) => ({
        url: "/appointments",
        method: "POST",
        body: appointment,
      }),
      invalidatesTags: ["Appointment"],
    }),

    // PUT /appointments/:id
    updateAppointment: builder.mutation<TAppointment, Partial<TAppointment> & { appointmentId: number }>({
      query: ({ appointmentId, ...rest }) => ({
        url: `/appointments/${appointmentId}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Appointment"],
    }),

    // DELETE /appointments/:id
    deleteAppointment: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointment"],
    }),
  }),
});

// Export hooks for React usage
export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentsAPI;
