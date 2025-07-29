import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TComplaint = {
  complaintID: number;
  userID: number;
  relatedAppointmentID?: number | null;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const complaintsAPI = createApi({
  reducerPath: "complaintsAPI",
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
  tagTypes: ["Complaints"],
  endpoints: (builder) => ({
    createComplaint: builder.mutation<TComplaint, Partial<TComplaint>>({
      query: (newComplaint) => ({
        url: "/complaint",
        method: "POST",
        body: newComplaint,
      }),
      invalidatesTags: ["Complaints"],
    }),
    getComplaints: builder.query<{ complaints: TComplaint[] }, void>({
      query: () => "/complaint",
      providesTags: ["Complaints"],
    }),
    getComplaintById: builder.query<{ complaint: TComplaint }, number>({
      query: (complaintID) => `/complaint/${complaintID}`,
      providesTags: ["Complaints"],
    }),
    getComplaintsByUserId: builder.query<{ complaints: TComplaint[] }, number>({
      query: (userID) => `/complaint/user/${userID}`,
      providesTags: ["Complaints"],
    }),
    getComplaintsByAppointmentId: builder.query<{ complaints: TComplaint[] }, number>({
      query: (appointmentID) => `/complaint/appointment/${appointmentID}`,
      providesTags: ["Complaints"],
    }),
    updateComplaint: builder.mutation<TComplaint, Partial<TComplaint> & { complaintID: number }>({
      query: (updatedComplaint) => ({
        url: `/complaint/${updatedComplaint.complaintID}`,
        method: "PUT",
        body: updatedComplaint,
      }),
      invalidatesTags: ["Complaints"],
    }),
    deleteComplaint: builder.mutation<{ message: string }, number>({
      query: (complaintID) => ({
        url: `/complaint/${complaintID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Complaints"],
    }),
  }),
});

// ✅ EXPORT the RTK Query hooks here
export const {
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useGetComplaintsByUserIdQuery,
  useGetComplaintsByAppointmentIdQuery,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = complaintsAPI;
