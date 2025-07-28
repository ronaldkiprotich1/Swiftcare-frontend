import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";


export type TPayment = {
  paymentID: number;
  appointmentID: number;
  amount: number;
  paymentStatus: string;
  transactionID: string;
  paymentDate: string;
};

export const paymentsAPI = createApi({
  reducerPath: "paymentsAPI",
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
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
       createPayment: builder.mutation<TPayment, Partial<TPayment>>({
      query: (newPayment) => ({
        url: "/payment",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Payments"],
    }),

    getPayments: builder.query<{ payments: TPayment[] }, void>({
      query: () => "/payment",
      providesTags: ["Payments"],
    }),
    getPaymentById: builder.query<{ payment: TPayment }, number>({
      query: (paymentID) => `/payment/${paymentID}`,
      providesTags: ["Payments"],
    }),
    getPaymentsByAppointmentId: builder.query<{ payments: TPayment[] }, number>({
      query: (appointmentID) => `/payment/appointment/${appointmentID}`,
      providesTags: ["Payments"],
    }),
    getPaymentsByUserId: builder.query<{ payments: TPayment[] }, number>({
      query: (userID) => `/payment/user/${userID}`,
      providesTags: ["Payments"],
    }),
    updatePayment: builder.mutation<TPayment, Partial<TPayment> & { paymentID: number }>({
      query: (updatedPayment) => ({
        url: `/payment/${updatedPayment.paymentID}`,
        method: "PUT",
        body: updatedPayment,
      }),
      invalidatesTags: ["Payments"],
    }),
    deletePayment: builder.mutation<{ message: string }, number>({
      query: (paymentID) => ({
        url: `/payment/${paymentID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

