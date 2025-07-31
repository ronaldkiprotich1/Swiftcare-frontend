import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TPrescription = {
  prescriptionId: number;
  appointmentId: number;
  doctorId: number;
  patientId: number; // This matches your backend structure
  userId?: number; // Optional alias for compatibility
  medications: string;
  dosage?: string;
  instructions?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Response types to match different API patterns
export type PrescriptionsResponse = TPrescription[];
export type PrescriptionResponse = TPrescription;

export const prescriptionsAPI = createApi({
  reducerPath: "prescriptionsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ApiDomain}/api/prescription`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Prescriptions"],
  endpoints: (builder) => ({
    // Create
    createPrescription: builder.mutation<TPrescription, Partial<TPrescription>>({
      query: (newPrescription) => ({
        url: "",
        method: "POST",
        body: newPrescription,
      }),
      invalidatesTags: ["Prescriptions"],
    }),

    // Get All
    getPrescriptions: builder.query<PrescriptionsResponse, void>({
      query: () => "",
      providesTags: ["Prescriptions"],
    }),

    // Get by ID
    getPrescriptionById: builder.query<PrescriptionResponse, number>({
      query: (prescriptionId) => `/${prescriptionId}`,
      providesTags: (result, error, prescriptionId) => [
        { type: "Prescriptions", id: prescriptionId }
      ],
    }),

    // Get by Appointment ID
    getPrescriptionsByAppointmentId: builder.query<PrescriptionsResponse, number>({
      query: (appointmentId) => `/appointment/${appointmentId}`,
      providesTags: (result, error, appointmentId) => [
        { type: "Prescriptions", id: `appointment-${appointmentId}` }
      ],
    }),

    // Get by Doctor ID
    getPrescriptionsByDoctorId: builder.query<PrescriptionsResponse, number>({
      query: (doctorId) => `/doctor/${doctorId}`,
      providesTags: (result, error, doctorId) => [
        { type: "Prescriptions", id: `doctor-${doctorId}` }
      ],
    }),

    // Get by User ID (maps to patientId in backend)
    getPrescriptionsByUserId: builder.query<PrescriptionsResponse, number>({
      query: (userId) => {
        console.log("Fetching prescriptions for userId (patientId):", userId);
        return `/patient/${userId}`;
      },
      transformResponse: (response: TPrescription[]) => {
        console.log("Prescription API response:", response);
        // Ensure compatibility by adding userId field
        return response.map(prescription => ({
          ...prescription,
          userId: prescription.patientId // Add userId alias for frontend compatibility
        }));
      },
      providesTags: (result, error, userId) => [
        { type: "Prescriptions", id: `patient-${userId}` },
        "Prescriptions"
      ],
    }),

    // Update
    updatePrescription: builder.mutation<TPrescription, Partial<TPrescription> & { prescriptionId: number }>({
      query: ({ prescriptionId, ...data }) => ({
        url: `/${prescriptionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { prescriptionId }) => [
        "Prescriptions",
        { type: "Prescriptions", id: prescriptionId }
      ],
    }),

    // Delete
    deletePrescription: builder.mutation<{ message: string }, number>({
      query: (prescriptionId) => ({
        url: `/${prescriptionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, prescriptionId) => [
        "Prescriptions",
        { type: "Prescriptions", id: prescriptionId }
      ],
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useLazyGetPrescriptionByIdQuery,
  useGetPrescriptionsByUserIdQuery,
  useLazyGetPrescriptionsByUserIdQuery,
  useGetPrescriptionsByAppointmentIdQuery,
  useLazyGetPrescriptionsByAppointmentIdQuery,
  useGetPrescriptionsByDoctorIdQuery,
  useLazyGetPrescriptionsByDoctorIdQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
} = prescriptionsAPI;