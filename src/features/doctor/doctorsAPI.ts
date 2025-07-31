import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TDoctor = {
  doctorId: number;
  name: string;
  lastName: string;
  specialization: string;
  email: string;
  contactPhone: string;
  consultationFee: number;
  availability: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DoctorsResponse = {
  doctors: TDoctor[];
};

export type DoctorResponse = {
  doctor: TDoctor;
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
    getDoctors: builder.query<DoctorsResponse, void>({
      query: () => "/doctors",
      transformResponse: (response: any) => ({
        doctors: response.doctors || [],
      }),
      providesTags: ["Doctors"],
    }),

    // Fetch doctor by ID
    getDoctorById: builder.query<DoctorResponse, number>({
      query: (doctorId) => `/doctors/${doctorId}`,
      transformResponse: (response: any) => ({
        doctor: response.doctor || response,
      }),
      providesTags: ["Doctors"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useLazyGetDoctorByIdQuery,
} = doctorsAPI;