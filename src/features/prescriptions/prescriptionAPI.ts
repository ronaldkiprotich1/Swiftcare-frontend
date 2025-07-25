// src/features/prescription/prescriptionAPI.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const prescriptionAPI = createApi({
  reducerPath: 'prescriptionAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8081/api/prescriptions' }),
  tagTypes: ['Prescription'],
  endpoints: (builder) => ({
    getAllPrescriptions: builder.query({
      query: () => '/',
      providesTags: ['Prescription'],
    }),
    getPrescriptionById: builder.query({
      query: (id: number) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Prescription', id }],
    }),
    createPrescription: builder.mutation({
      query: (newPrescription) => ({
        url: '/',
        method: 'POST',
        body: newPrescription,
      }),
      invalidatesTags: ['Prescription'],
    }),
    updatePrescription: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Prescription', id }],
    }),
    deletePrescription: builder.mutation({
      query: (id: number) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Prescription', id }],
    }),
  }),
});

export const {
  useGetAllPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
} = prescriptionAPI;
