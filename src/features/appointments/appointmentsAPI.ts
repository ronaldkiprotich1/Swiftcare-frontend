import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";


export type TAppointment = {
  appointmentID: number;
  userID: number;
  doctorID: number;
  appointmentDate: string;
  timeSlot: string;
  totalAmount: number | null;
  appointmentStatus: "Pending" | "Confirmed";
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
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    createAppointment: builder.mutation<TAppointment, Partial<TAppointment>>({
      query: (newAppointment) => ({
        url: "/appointment",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: ["Appointments"],
    }),
    getAppointments: builder.query<{ appointments: TAppointment[] }, void>({
      query: () => "/appointment",
      providesTags: ["Appointments"],
    }),
    getAppointmentById: builder.query<{ appointment: TAppointment }, number>({
      query: (appointmentID) => `/appointment/${appointmentID}`,
      providesTags: ["Appointments"],
    }),
    getAppointmentsByUserId: builder.query<{ appointments: TAppointment[] }, number>({
      query: (userID) => `/appointment/user/${userID}`,
      providesTags: ["Appointments"],
    }),
    getAppointmentsByDoctorId: builder.query<{ appointments: TAppointment[] }, number>({
      query: (doctorID) => `/appointment/doctor/${doctorID}`,
      providesTags: ["Appointments"],
    }),
    updateAppointment: builder.mutation<TAppointment, Partial<TAppointment> & { appointmentID: number }>({
      query: (updatedAppointment) => ({
        url: `/appointment/${updatedAppointment.appointmentID}`,
        method: "PUT",
        body: updatedAppointment,
      }),
      invalidatesTags: ["Appointments"],
    }),
    deleteAppointment: builder.mutation<{ message: string }, number>({
      query: (appointmentID) => ({
        url: `/appointment/${appointmentID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),
  }),
});


