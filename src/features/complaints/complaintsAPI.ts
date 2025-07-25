import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TComplaint = {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: string; // e.g., 'pending', 'resolved'
  createdAt?: string;
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
  tagTypes: ["Complaint"],

  endpoints: (builder) => ({
    // GET /complaints
    getComplaints: builder.query<TComplaint[], void>({
      query: () => "/complaints",
      providesTags: ["Complaint"],
    }),

    // GET /complaints/:id
    getComplaintById: builder.query<TComplaint, number>({
      query: (id) => `/complaints/${id}`,
    }),

    // POST /complaints
    createComplaint: builder.mutation<TComplaint, Partial<TComplaint>>({
      query: (complaint) => ({
        url: "/complaints",
        method: "POST",
        body: complaint,
      }),
      invalidatesTags: ["Complaint"],
    }),

    // PUT /complaints/:id
    updateComplaint: builder.mutation<TComplaint, Partial<TComplaint> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/complaints/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Complaint"],
    }),

    // DELETE /complaints/:id
    deleteComplaint: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/complaints/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Complaint"],
    }),
  }),
});

// Export hooks for React usage
export const {
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useCreateComplaintMutation,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = complaintsAPI;
