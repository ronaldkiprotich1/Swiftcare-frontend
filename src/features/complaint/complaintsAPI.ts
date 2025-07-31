import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

// Complaint type
export type TComplaint = {
  complaintId: number;
  userId: number;
  relatedAppointmentId?: number | null;
  subject: string;
  description: string;
  status: string;
  adminResponse?: string | null;
  priority?: string | null;
  resolvedAt?: string | null;
  assignedTo?: number | null;
  createdAt: string;
  updatedAt: string;
};

// Response types
export type ComplaintsResponse = {
  complaints: TComplaint[];
};

export type ComplaintResponse = TComplaint;
export type DeleteResponse = { message: string };
export type UpdateStatusResponse = {
  message: string;
  updated: TComplaint;
};

// Create complaint input type
export type CreateComplaintInput = {
  userId: number;
  relatedAppointmentId?: number | null;
  subject: string;
  description: string;
  status?: string;
  adminResponse?: string | null;
  priority?: string;
  assignedTo?: number | null;
};

// API setup
export const complaintsAPI = createApi({
  reducerPath: "complaintsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ApiDomain}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Complaints"],
  endpoints: (builder) => ({
    // Create complaint
    createComplaint: builder.mutation<TComplaint, CreateComplaintInput>({
      query: (newComplaint) => ({
        url: "/complaints",
        method: "POST",
        body: {
          userId: newComplaint.userId,
          relatedAppointmentId: newComplaint.relatedAppointmentId || null,
          subject: newComplaint.subject,
          description: newComplaint.description,
          status: newComplaint.status || "Open",
          adminResponse: newComplaint.adminResponse || null,
          priority: newComplaint.priority || "Medium",
          assignedTo: newComplaint.assignedTo || null,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        "Complaints",
        { type: "Complaints", id: `user-${arg.userId}` }
      ],
    }),

    // Get all complaints (for admin)
    getComplaints: builder.query<ComplaintsResponse, void>({
      query: () => "/complaints",
      providesTags: ["Complaints"],
    }),

    // Get complaint by ID
    getComplaintById: builder.query<ComplaintResponse, number>({
      query: (complaintId) => `/complaints/${complaintId}`,
      providesTags: (result, error, complaintId) => [
        { type: "Complaints", id: complaintId }
      ],
    }),

    // Get complaints by User ID - Simplified approach
    getComplaintsByUserId: builder.query<ComplaintsResponse, number>({
      query: (userId) => {
        console.log("API Query - fetching complaints for userId:", userId);
        return "/complaints";
      },
      transformResponse: (response: ComplaintsResponse, meta, userId) => {
        console.log("Transform Response - Original response:", response);
        console.log("Transform Response - Filtering for userId:", userId);

        const filtered = {
          complaints: response.complaints.filter(
            (complaint) => Number(complaint.userId) === Number(userId)
          ),
        };

        console.log("Transform Response - Filtered result:", filtered);
        return filtered;
      },
      providesTags: (result, error, userId) => [
        { type: "Complaints", id: `user-${userId}` },
        "Complaints"
      ],
    }),

    // Get complaints by Appointment ID - Simplified approach  
    getComplaintsByAppointmentId: builder.query<ComplaintsResponse, number>({
      query: (appointmentId) => {
        console.log("API Query - fetching complaints for appointmentId:", appointmentId);
        return "/complaints";
      },
      transformResponse: (response: ComplaintsResponse, meta, appointmentId) => {
        console.log("Transform Response - Original response:", response);
        console.log("Transform Response - Filtering for appointmentId:", appointmentId);

        const filtered = {
          complaints: response.complaints.filter(
            (complaint) =>
              Number(complaint.relatedAppointmentId) === Number(appointmentId)
          ),
        };

        console.log("Transform Response - Filtered result:", filtered);
        return filtered;
      },
      providesTags: (result, error, appointmentId) => [
        { type: "Complaints", id: `appointment-${appointmentId}` },
        "Complaints"
      ],
    }),

    // Update complaint status
    updateComplaintStatus: builder.mutation<
      UpdateStatusResponse,
      { complaintId: number; status: string }
    >({
      query: ({ complaintId, status }) => ({
        url: `/complaints/status/${complaintId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { complaintId }) => [
        "Complaints",
        { type: "Complaints", id: complaintId }
      ],
    }),

    // Update complaint (PUT)
    updateComplaint: builder.mutation<
      TComplaint,
      Partial<TComplaint> & { complaintId: number }
    >({
      query: ({ complaintId, ...body }) => ({
        url: `/complaints/${complaintId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { complaintId }) => [
        "Complaints",
        { type: "Complaints", id: complaintId },
        // Also invalidate user-specific cache if userId is in the update
        ...(result && 'userId' in result ? [{ type: "Complaints" as const, id: `user-${result.userId}` }] : [])
      ],
    }),

    // Delete complaint
    deleteComplaint: builder.mutation<DeleteResponse, number>({
      query: (complaintId) => ({
        url: `/complaints/${complaintId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, complaintId) => [
        "Complaints",
        { type: "Complaints", id: complaintId }
      ],
    }),
  }),
});

// Export hooks
export const {
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useLazyGetComplaintsByUserIdQuery,
  useLazyGetComplaintsByAppointmentIdQuery,
  useGetComplaintsByUserIdQuery,
  useGetComplaintsByAppointmentIdQuery,
  useUpdateComplaintStatusMutation,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = complaintsAPI;