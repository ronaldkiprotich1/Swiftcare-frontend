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
  appointmentStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string | null;
  cancellationReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TDetailedAppointment = TAppointment & {
  patient?: {
    name: string;
    lastName: string;
    email: string;
    contactPhone: string;
  };
  doctor?: {
    name: string;
    lastName: string;
    specialization: string;
  };
};

// Response types for better type safety
export type AppointmentsResponse = {
  appointments: TAppointment[];
};

export type DetailedAppointmentsResponse = {
  data: TDetailedAppointment[];
};

export type AppointmentResponse = {
  appointment: TAppointment;
};

export type DeleteResponse = {
  message: string;
};

// Helper function to transform backend response to frontend format
const transformAppointmentFromBackend = (backendAppointment: any): TAppointment => ({
  appointmentID: backendAppointment.appointmentId,
  userID: backendAppointment.userId,
  doctorID: backendAppointment.doctorId,
  appointmentDate: backendAppointment.appointmentDate,
  timeSlot: backendAppointment.timeSlot,
  totalAmount: backendAppointment.totalAmount ? parseFloat(backendAppointment.totalAmount) : null,
  appointmentStatus: backendAppointment.appointmentStatus,
  notes: backendAppointment.notes,
  cancellationReason: backendAppointment.cancellationReason,
  createdAt: backendAppointment.createdAt,
  updatedAt: backendAppointment.updatedAt,
});

// Helper function to transform frontend data to backend format
const transformAppointmentToBackend = (frontendAppointment: Partial<TAppointment>) => ({
  userId: frontendAppointment.userID,
  doctorId: frontendAppointment.doctorID,
  appointmentDate: frontendAppointment.appointmentDate,
  timeSlot: frontendAppointment.timeSlot,
  totalAmount: frontendAppointment.totalAmount,
  appointmentStatus: frontendAppointment.appointmentStatus,
  notes: frontendAppointment.notes,
});

export const appointmentsAPI = createApi({
  reducerPath: "appointmentsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ApiDomain}/api`,
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
    // Create a new appointment
    createAppointment: builder.mutation<TAppointment, Partial<TAppointment>>({
      query: (newAppointment) => ({
        url: "/appointments",
        method: "POST",
        body: transformAppointmentToBackend(newAppointment),
      }),
      transformResponse: (response: any) => transformAppointmentFromBackend(response),
      invalidatesTags: ["Appointments"],
    }),

    // Fetch all appointments (basic)
    getAppointments: builder.query<AppointmentsResponse, void>({
      query: () => "/appointments",
      transformResponse: (response: any) => ({
        appointments: response.appointments?.map(transformAppointmentFromBackend) || [],
      }),
      providesTags: ["Appointments"],
    }),

    // Fetch detailed appointments with patient and doctor info
    getDetailedAppointments: builder.query<DetailedAppointmentsResponse, void>({
      query: () => "/appointments/detailed",
      transformResponse: (response: any) => ({
        data: response.data?.map((appointment: any) => ({
          ...transformAppointmentFromBackend(appointment),
          patient: appointment.patient,
          doctor: appointment.doctor,
        })) || [],
      }),
      providesTags: ["Appointments"],
    }),

    // Fetch appointment by ID
    getAppointmentById: builder.query<AppointmentResponse, number>({
      query: (appointmentID) => `/appointments/${appointmentID}`,
      transformResponse: (response: any) => ({
        appointment: transformAppointmentFromBackend(response),
      }),
      providesTags: ["Appointments"],
    }),

    // Fetch appointments by user ID
    getAppointmentsByUserId: builder.query<AppointmentsResponse, number>({
      query: (userID) => `/appointments/user/${userID}`,
      transformResponse: (response: any) => ({
        appointments: response.appointments?.map(transformAppointmentFromBackend) || [],
      }),
      providesTags: ["Appointments"],
    }),

    // Fetch appointments by doctor ID
    getAppointmentsByDoctorId: builder.query<AppointmentsResponse, number>({
      query: (doctorID) => `/appointments/doctor/${doctorID}`,
      transformResponse: (response: any) => ({
        appointments: response.appointments?.map(transformAppointmentFromBackend) || [],
      }),
      providesTags: ["Appointments"],
    }),

    // Update appointment
    updateAppointment: builder.mutation<
      TAppointment,
      Partial<TAppointment> & { appointmentID: number }
    >({
      query: ({ appointmentID, ...updatedAppointment }) => ({
        url: `/appointments/${appointmentID}`,
        method: "PUT",
        body: transformAppointmentToBackend(updatedAppointment),
      }),
      transformResponse: (response: any) => transformAppointmentFromBackend(response),
      invalidatesTags: ["Appointments"],
    }),

    // Delete appointment
    deleteAppointment: builder.mutation<DeleteResponse, number>({
      query: (appointmentID) => ({
        url: `/appointments/${appointmentID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),
  }),
});

// Export hooks with proper names
export const {
  useCreateAppointmentMutation,
  useGetAppointmentsQuery,
  useGetDetailedAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useLazyGetAppointmentByIdQuery,
  useGetAppointmentsByUserIdQuery,
  useLazyGetAppointmentsByUserIdQuery,
  useGetAppointmentsByDoctorIdQuery,
  useLazyGetAppointmentsByDoctorIdQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentsAPI;