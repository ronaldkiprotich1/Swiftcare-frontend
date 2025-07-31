import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../../utils/ApiDomain';
import type { RootState } from '../../app/store';

// Updated interface to match your userSlice and backend response
export interface TUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional since backend shouldn't return this in real responses
  contactPhone: string | null;
  address: string | null; 
  role: string;
  isVerified: boolean;
  verificationCode: string | null;
  createdAt: string;
  updatedAt: string;
  image_url?: string; // Added missing image_url property
}

// User interface for components that expect non-nullable address
export interface User {
  userId: number; // Changed from userID to userId to match
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  contactPhone: string;
  address: string; // Non-nullable for components that require it
  role: string;
  isVerified: boolean;
  verificationCode: string | null;
  createdAt: string;
  updatedAt: string;
  image_url?: string;
}

// Registration request interface - removed userId since it's auto-generated
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  contactPhone?: string;
  address?: string;
  image_url?: string;
}

// Login interfaces - updated to match your userSlice
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ApiDomain}/api`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.user?.token;
      
      headers.set('Content-Type', 'application/json');
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      console.log('UsersAPI - Token from Redux:', token ? 'Present' : 'Not present');
      console.log('UsersAPI - User ID from Redux:', state.user?.user?.userId);
      
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // Registration endpoint
    register: builder.mutation<TUser, RegisterRequest>({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
      transformErrorResponse: (response: any) => {
        console.error('Registration Error:', response);
        return response;
      },
    }),

    // Login endpoint - updated response type
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      transformErrorResponse: (response: any) => {
        console.error('Login Error:', response);
        return response;
      },
    }),

    // Get all users
    getAllUsers: builder.query<TUser[], void>({
      query: () => '/users',
      providesTags: ['Users'],
      transformErrorResponse: (response: any) => {
        console.error('Get All Users Error:', response);
        return response;
      },
    }),

    // Get user by ID
    getUserById: builder.query<TUser, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
      transformErrorResponse: (response: any) => {
        console.error('Get User By ID Error:', response);
        return response;
      },
    }),

    // Update user by ID (general update)
    updateUserById: builder.mutation<TUser, { userId: number; [key: string]: any }>({
      query: ({ userId, ...updates }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Users'],
      transformErrorResponse: (response: any) => {
        console.error('Update User Error:', response);
        return response;
      },
    }),

    // Delete user
    deleteUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
      transformErrorResponse: (response: any) => {
        console.error('Delete User Error:', response);
        return response;
      },
    }),

    // Update user role - using general update endpoint since specific role endpoint may not exist
    updateUserRole: builder.mutation<TUser, { userId: number; role: string }>({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['Users'],
      transformErrorResponse: (response: any) => {
        console.error('Update User Role Error:', response);
        return response;
      },
    }),
  }),
});

// Utility function to convert TUser to User (handling null values)
export const convertTUserToUser = (tUser: TUser): User => ({
  ...tUser,
  contactPhone: tUser.contactPhone || '',
  address: tUser.address || '',
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} = usersAPI;