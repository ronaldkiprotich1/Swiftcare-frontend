import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TDoctor = {
  doctorID: number;
  firstName: string;
  lastName: string;
  specialization: string;
  contactPhone?: string | null;
  availableDays?: string | null;
  createdAt: string;
  updatedAt: string;
};

export const doctorsAPI = createApi({
  reducerPath: "doctorsAPI",
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
  tagTypes: ["Doctors"],
  endpoints: (builder) => ({
    // Get all doctors
    getDoctors: builder.query<{ doctors: TDoctor[] }, void>({
      query: () => "/doctor",
      providesTags: ["Doctors"],
    }),

    // Get doctor by ID
    getDoctorById: builder.query<{ doctor: TDoctor }, number>({
      query: (doctorID) => `/doctor/${doctorID}`,
      providesTags: ["Doctors"],
    }),

    // Get doctors by specialization
    getDoctorsBySpecialization: builder.query<{ doctors: TDoctor[] }, string>({
      query: (specialization) => `/doctor/specialization/${specialization}`,
      providesTags: ["Doctors"],
    }),
    // Create a new doctor
    createDoctor: builder.mutation<TDoctor, Partial<TDoctor>>({
      query: (newDoctor) => ({
        url: "/doctor",
        method: "POST",
        body: newDoctor,
      }),
        invalidatesTags: ["Doctors"],
    }),
    // Update an existing doctor
    updateDoctor: builder.mutation<TDoctor, Partial<TDoctor> & { doctorID: number }>({
      query: (updatedDoctor) => ({
        url: `/doctor/${updatedDoctor.doctorID}`,
        method: "PUT",
        body: updatedDoctor,  
      }),
      invalidatesTags: ["Doctors"],
    }),
    // Delete a doctor
    deleteDoctor: builder.mutation<{ message: string }, number>({
      query: (doctorID) => ({
        url: `/doctor/${doctorID}`,
        method: "DELETE", 
      }),
      invalidatesTags: ["Doctors"],
    }),
  }),
});
