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
    userID: number;
    name: string;
    lastName: string;
    email: string;
    contactPhone: string;
  };
  doctor?: {
    doctorID: number;
    name: string;
    lastName: string;
    specialization: string;
    contactPhone?: string;
    email?: string;
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

export type DetailedAppointmentResponse = {
  appointment: TDetailedAppointment;
};

export type DeleteResponse = {
  message: string;
};

// Helper function to transform backend response to frontend format
const transformAppointmentFromBackend = (backendAppointment: any): TAppointment => ({
  appointmentID: backendAppointment.appointmentId || backendAppointment.appointmentID,
  userID: backendAppointment.userId || backendAppointment.userID,
  doctorID: backendAppointment.doctorId || backendAppointment.doctorID,
  appointmentDate: backendAppointment.appointmentDate,
  timeSlot: backendAppointment.timeSlot,
  totalAmount: backendAppointment.totalAmount ? parseFloat(backendAppointment.totalAmount) : null,
  appointmentStatus: backendAppointment.appointmentStatus,
  notes: backendAppointment.notes,
  cancellationReason: backendAppointment.cancellationReason,
  createdAt: backendAppointment.createdAt,
  updatedAt: backendAppointment.updatedAt,
});

// Helper function to transform detailed appointment from backend
const transformDetailedAppointmentFromBackend = (backendAppointment: any): TDetailedAppointment => ({
  ...transformAppointmentFromBackend(backendAppointment),
  patient: backendAppointment.patient ? {
    userID: backendAppointment.patient.userId || backendAppointment.patient.userID,
    name: backendAppointment.patient.name,
    lastName: backendAppointment.patient.lastName,
    email: backendAppointment.patient.email,
    contactPhone: backendAppointment.patient.contactPhone,
  } : undefined,
  doctor: backendAppointment.doctor ? {
    doctorID: backendAppointment.doctor.doctorId || backendAppointment.doctor.doctorID,
    name: backendAppointment.doctor.name,
    lastName: backendAppointment.doctor.lastName,
    specialization: backendAppointment.doctor.specialization,
    contactPhone: backendAppointment.doctor.contactPhone,
    email: backendAppointment.doctor.email,
  } : undefined,
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
  cancellationReason: frontendAppointment.cancellationReason,
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
  tagTypes: ["Appointments", "DetailedAppointments"],
  endpoints: (builder) => ({
    // Create a new appointment
    createAppointment: builder.mutation<TAppointment, Partial<TAppointment>>({
      query: (newAppointment) => ({
        url: "/appointments",
        method: "POST",
        body: transformAppointmentToBackend(newAppointment),
      }),
      transformResponse: (response: any) => transformAppointmentFromBackend(response.appointment || response),
      invalidatesTags: ["Appointments", "DetailedAppointments"],
    }),

    // Fetch all appointments (basic)
    getAppointments: builder.query<AppointmentsResponse, void>({
      query: () => "/appointments",
      transformResponse: (response: any) => ({
        appointments: (response.appointments || response.data || []).map(transformAppointmentFromBackend),
      }),
      providesTags: ["Appointments"],
    }),

    // Fetch detailed appointments with patient and doctor info
    getDetailedAppointments: builder.query<DetailedAppointmentsResponse, void>({
      query: () => "/appointments/detailed",
      transformResponse: (response: any) => ({
        data: (response.data || response.appointments || []).map(transformDetailedAppointmentFromBackend),
      }),
      providesTags: ["DetailedAppointments"],
    }),

    // Fetch appointment by ID
    getAppointmentById: builder.query<AppointmentResponse, number>({
      query: (appointmentID) => `/appointments/${appointmentID}`,
      transformResponse: (response: any) => ({
        appointment: transformAppointmentFromBackend(response.appointment || response),
      }),
      providesTags: (_result, _error, appointmentID) => [
        { type: "Appointments", id: appointmentID },
      ],
    }),

    // Fetch detailed appointment by ID
    getDetailedAppointmentById: builder.query<DetailedAppointmentResponse, number>({
      query: (appointmentID) => `/appointments/${appointmentID}/detailed`,
      transformResponse: (response: any) => ({
        appointment: transformDetailedAppointmentFromBackend(response.appointment || response),
      }),
      providesTags: (_result, _error, appointmentID) => [
        { type: "DetailedAppointments", id: appointmentID },
      ],
    }),

    // Fetch appointments by user ID
    getAppointmentsByUserId: builder.query<AppointmentsResponse, number>({
      query: (userID) => `/appointments/user/${userID}`,
      transformResponse: (response: any) => ({
        appointments: (response.appointments || response.data || []).map(transformAppointmentFromBackend),
      }),
      providesTags: (_result, _error, userID) => [
        { type: "Appointments", id: `USER_${userID}` },
      ],
    }),

    // Fetch detailed appointments by user ID
    getDetailedAppointmentsByUserId: builder.query<DetailedAppointmentsResponse, number>({
      query: (userID) => `/appointments/user/${userID}/detailed`,
      transformResponse: (response: any) => ({
        data: (response.data || response.appointments || []).map(transformDetailedAppointmentFromBackend),
      }),
      providesTags: (_result, _error, userID) => [
        { type: "DetailedAppointments", id: `USER_${userID}` },
      ],
    }),

    // Fetch appointments by doctor ID
    getAppointmentsByDoctorId: builder.query<AppointmentsResponse, number>({
      query: (doctorID) => `/appointments/doctor/${doctorID}`,
      transformResponse: (response: any) => ({
        appointments: (response.appointments || response.data || []).map(transformAppointmentFromBackend),
      }),
      providesTags: (_result, _error, doctorID) => [
        { type: "Appointments", id: `DOCTOR_${doctorID}` },
      ],
    }),

    // Fetch detailed appointments by doctor ID
    getDetailedAppointmentsByDoctorId: builder.query<DetailedAppointmentsResponse, number>({
      query: (doctorID) => `/appointments/doctor/${doctorID}/detailed`,
      transformResponse: (response: any) => ({
        data: (response.data || response.appointments || []).map(transformDetailedAppointmentFromBackend),
      }),
      providesTags: (_result, _error, doctorID) => [
        { type: "DetailedAppointments", id: `DOCTOR_${doctorID}` },
      ],
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
      transformResponse: (response: any) => transformAppointmentFromBackend(response.appointment || response),
      invalidatesTags: (_result, _error, { appointmentID }) => [
        "Appointments",
        "DetailedAppointments",
        { type: "Appointments", id: appointmentID },
        { type: "DetailedAppointments", id: appointmentID },
      ],
    }),

    // Update appointment status
    updateAppointmentStatus: builder.mutation<
      TAppointment,
      { appointmentID: number; status: TAppointment["appointmentStatus"]; cancellationReason?: string }
    >({
      query: ({ appointmentID, status, cancellationReason }) => ({
        url: `/appointments/${appointmentID}/status`,
        method: "PATCH",
        body: { 
          appointmentStatus: status,
          ...(cancellationReason && { cancellationReason }),
        },
      }),
      transformResponse: (response: any) => transformAppointmentFromBackend(response.appointment || response),
      invalidatesTags: (_result, _error, { appointmentID }) => [
        "Appointments",
        "DetailedAppointments",
        { type: "Appointments", id: appointmentID },
        { type: "DetailedAppointments", id: appointmentID },
      ],
    }),

    // Delete appointment
    deleteAppointment: builder.mutation<DeleteResponse, number>({
      query: (appointmentID) => ({
        url: `/appointments/${appointmentID}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, appointmentID) => [
        "Appointments",
        "DetailedAppointments",
        { type: "Appointments", id: appointmentID },
        { type: "DetailedAppointments", id: appointmentID },
      ],
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
  useGetDetailedAppointmentByIdQuery,
  useLazyGetDetailedAppointmentByIdQuery,
  useGetAppointmentsByUserIdQuery,
  useLazyGetAppointmentsByUserIdQuery,
  useGetDetailedAppointmentsByUserIdQuery,
  useLazyGetDetailedAppointmentsByUserIdQuery,
  useGetAppointmentsByDoctorIdQuery,
  useLazyGetAppointmentsByDoctorIdQuery,
  useGetDetailedAppointmentsByDoctorIdQuery,
  useLazyGetDetailedAppointmentsByDoctorIdQuery,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
} = appointmentsAPI;