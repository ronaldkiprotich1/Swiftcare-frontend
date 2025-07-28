import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the TAppointment type (adjust based on your actual API response)
export type TAppointment = {
  appointmentID: number;
  userID: number;
  doctorID: number;
  appointmentDate: string;
  timeSlot: string;
  totalAmount: number;
  appointmentStatus: string;
};

export const appointmentsAPI = createApi({
  reducerPath: 'appointmentsAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Adjust baseUrl to your API's base URL
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    // Existing queries
    getAppointmentById: builder.query<TAppointment, number>({
      query: (id) => `/appointments/${id}`,
      providesTags: ['Appointment'],
    }),
    // Add new query for appointments by doctor ID
    getAppointmentsByDoctorId: builder.query<{ appointments: TAppointment[] }, number>({
      query: (doctorId) => `/appointments/doctor/${doctorId}`,
      providesTags: ['Appointment'],
    }),
    // ... other endpoints (e.g., getAppointments, deleteAppointment, etc.)
  }),
});

export const {
  useGetAppointmentByIdQuery,
  useLazyGetAppointmentByIdQuery,
  useGetAppointmentsByDoctorIdQuery, // Export the new hook
  // ... other hooks
} = appointmentsAPI;