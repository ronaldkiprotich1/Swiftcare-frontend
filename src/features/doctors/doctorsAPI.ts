import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TDoctor = {
  id: number;
  name: string;
  email: string;
  specialization: string;
  image_url?: string;
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
  tagTypes: ["Doctor"],

  endpoints: (builder) => ({
    // GET /doctors
    getDoctors: builder.query<TDoctor[], void>({
      query: () => "/doctors",
      providesTags: ["Doctor"],
    }),

    // GET /doctors/:id
    getDoctorById: builder.query<TDoctor, number>({
      query: (id) => `/doctors/${id}`,
    }),

    // POST /doctors
    createDoctor: builder.mutation<TDoctor, Partial<TDoctor>>({
      query: (newDoctor) => ({
        url: "/doctors",
        method: "POST",
        body: newDoctor,
      }),
      invalidatesTags: ["Doctor"],
    }),

    // PUT /doctors/:id
    updateDoctor: builder.mutation<TDoctor, Partial<TDoctor> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/doctors/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Doctor"],
    }),

    // DELETE /doctors/:id
    deleteDoctor: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor"],
    }),
  }),
});

// Export hooks
export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsAPI;
