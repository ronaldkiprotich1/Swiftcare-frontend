import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../../utils/ApiDomain';
import type { RootState } from '../../app/store';

export type TPayment = {
  id: number;
  userId: number;
  amount: number;
  method: string;
  status: string;
  date: string; // e.g. "2025-07-25T12:00:00Z"
};

export const paymentAPI = createApi({
  reducerPath: 'paymentAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ApiDomain}/payments`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    getAllPayments: builder.query<TPayment[], void>({
      query: () => '/',
      providesTags: ['Payment'],
    }),

    getPaymentById: builder.query<TPayment, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Payment', id }],
    }),

    createPayment: builder.mutation<TPayment, Partial<TPayment>>({
      query: (paymentData) => ({
        url: '/',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),

    updatePayment: builder.mutation<TPayment, Partial<TPayment> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Payment', id }],
    }),

    deletePayment: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Payment', id }],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentAPI;
