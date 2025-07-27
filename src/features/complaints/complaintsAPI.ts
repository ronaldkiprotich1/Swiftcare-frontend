// src/features/complaints/complaintAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type ComplaintStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export type TComplaint = {
  complaintId: number;
  userId: number;
  relatedAppointmentId?: number;
  subject: string;
  description: string;
  status: ComplaintStatus;
  adminResponse?: string;
  priority?: string;
  resolvedAt?: string;
  assignedTo?: number;
  createdAt?: string;
  updatedAt?: string;
};

export const complaintsAPI = createApi({
  reducerPath: "complaintsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain + "/complaints", // assume all endpoints are under /complaints
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
    // GET /complaints
    getComplaints: builder.query<TComplaint[], void>({
      query: () => "/",
      providesTags: ["Complaints"],
    }),

    // GET /complaints/:id
    getComplaintById: builder.query<TComplaint, number>({
      query: (id) => `/${id}`,
    }),

    // POST /complaints
    createComplaint: builder.mutation<TComplaint, Partial<TComplaint>>({
      query: (newComplaint) => ({
        url: "/",
        method: "POST",
        body: newComplaint,
      }),
      invalidatesTags: ["Complaints"],
    }),

    // PUT /complaints/:id
    updateComplaint: builder.mutation<TComplaint, { id: number } & Partial<TComplaint>>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Complaints"],
    }),

    // DELETE /complaints/:id
    deleteComplaint: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Complaints"],
    }),
  }),
});

export const {
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useCreateComplaintMutation,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = complaintsAPI;
