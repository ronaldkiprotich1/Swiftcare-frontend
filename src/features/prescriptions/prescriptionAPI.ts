import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";


export type TPrescription = {
  prescriptionID: number;
  appointmentID: number;
  doctorID: number;
  userID: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const prescriptionsAPI = createApi({
  reducerPath: "prescriptionsAPI",
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
  tagTypes: ["Prescriptions"],
  endpoints: (builder) => ({
    // Create
    createPrescription: builder.mutation<TPrescription, Partial<TPrescription>>({
      query: (newPrescription) => ({
        url: "/prescription",
        method: "POST",
        body: newPrescription,
      }),
      invalidatesTags: ["Prescriptions"],
    }),

    // Get All
    getPrescriptions: builder.query<{ prescriptions: TPrescription[] }, void>({
      query: () => "/prescription",
      providesTags: ["Prescriptions"],
    }),

    // Get by ID
    getPrescriptionById: builder.query<{ prescription: TPrescription }, number>({
      query: (prescriptionID) => `/prescription/${prescriptionID}`,
      providesTags: ["Prescriptions"],
    }),

    // Get by Appointment ID
    getPrescriptionsByAppointmentId: builder.query<{ prescriptions: TPrescription[] }, number>({
      query: (appointmentID) => `/prescription/appointment/${appointmentID}`,
      providesTags: ["Prescriptions"],
    }),

    // Get by Doctor ID
    getPrescriptionsByDoctorId: builder.query<{ prescriptions: TPrescription[] }, number>({
      query: (doctorID) => `/prescription/doctor/${doctorID}`,
      providesTags: ["Prescriptions"],
    }),

    // Get by User ID
    getPrescriptionsByUserId: builder.query<{ prescriptions: TPrescription[] }, number>({
      query: (userID) => `/prescription/user/${userID}`,
      providesTags: ["Prescriptions"],
    }),

    // Update
    updatePrescription: builder.mutation<TPrescription, Partial<TPrescription> & { prescriptionID: number }>({
      query: (updatedPrescription) => ({
        url: `/prescription/${updatedPrescription.prescriptionID}`,
        method: "PUT",
        body: updatedPrescription,
      }),
      invalidatesTags: ["Prescriptions"],
    }),

    // Delete
    deletePrescription: builder.mutation<{ message: string }, number>({
      query: (prescriptionID) => ({
        url: `/prescription/${prescriptionID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prescriptions"],
    }),
  }),
});
