import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TDoctor = {
  doctorId: number;
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  contactPhone: string;
  consultationFee: number;
  availableDays: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateDoctorRequest = {
  userID: number;
  firstName: string;
  lastName: string;
  specialization: string;
  email?: string;
  contactPhone?: string;
  consultationFee?: number;
  availableDays?: string;
};

export type UpdateDoctorRequest = {
  doctorId: number;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  email?: string;
  contactPhone?: string;
  consultationFee?: number;
  availableDays?: string;
};

export type DoctorResponse = {
  success: boolean;
  message: string;
  doctor?: TDoctor;
};

export const doctorsAPI = createApi({
  reducerPath: "doctorsAPI",
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
  tagTypes: ["Doctors"],
  endpoints: (builder) => ({
    // Fetch all doctors
    getDoctors: builder.query<TDoctor[], void>({
      query: () => "/doctors",
      transformResponse: (response: any) => {
        console.log("Raw API Response:", response);
        
        // Handle different possible response structures
        if (Array.isArray(response)) {
          console.log("Response is direct array");
          return response;
        }
        
        if (response?.doctors && Array.isArray(response.doctors)) {
          console.log("Response has doctors array");
          return response.doctors;
        }
        
        if (response?.data && Array.isArray(response.data)) {
          console.log("Response has data array");
          return response.data;
        }
        
        if (response?.result && Array.isArray(response.result)) {
          console.log("Response has result array");
          return response.result;
        }
        
        console.warn("Unexpected response structure:", response);
        return [];
      },
      transformErrorResponse: (response: any) => {
        console.error("API Error Response:", response);
        return response;
      },
      providesTags: ["Doctors"],
    }),
    
    // Fetch doctor by ID
    getDoctorById: builder.query<TDoctor, number>({
      query: (doctorId) => `/doctors/${doctorId}`,
      transformResponse: (response: any) => {
        console.log("Get Doctor By ID Response:", response);
        
        if (response?.doctor) {
          return response.doctor;
        }
        
        if (response?.data) {
          return response.data;
        }
        
        return response;
      },
      providesTags: ["Doctors"],
    }),
    
    // Create doctor
    createDoctor: builder.mutation<DoctorResponse, CreateDoctorRequest>({
      query: (newDoctor) => ({
        url: "/doctors",
        method: "POST",
        body: newDoctor,
      }),
      transformResponse: (response: any) => {
        console.log("Create Doctor Response:", response);
        return response;
      },
      invalidatesTags: ["Doctors"],
    }),
    
    // Update doctor
    updateDoctor: builder.mutation<DoctorResponse, UpdateDoctorRequest>({
      query: ({ doctorId, ...updates }) => ({
        url: `/doctors/${doctorId}`,
        method: "PUT",
        body: updates,
      }),
      transformResponse: (response: any) => {
        console.log("Update Doctor Response:", response);
        return response;
      },
      invalidatesTags: ["Doctors"],
    }),
    
    // Delete doctor
    deleteDoctor: builder.mutation<DoctorResponse, number>({
      query: (doctorId) => ({
        url: `/doctors/${doctorId}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => {
        console.log("Delete Doctor Response:", response);
        return response;
      },
      invalidatesTags: ["Doctors"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useLazyGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsAPI;