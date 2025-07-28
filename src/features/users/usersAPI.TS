// src/features/users/usersAPI.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../../utils/ApiDomain';
import type { RootState } from '../../app/store';

export type UserRole = 'user' | 'admin' | 'doctor';

export type TUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactPhone?: string;
  address?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
    image_url?: string; 
};

export type NewUser = Omit<TUser, 'userId' | 'isVerified' | 'createdAt' | 'updatedAt'> & {
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  role: UserRole;
  user: Pick<TUser, 'userId' | 'firstName' | 'lastName' | 'email'>;
};

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain + '/auth',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    registerUser: builder.mutation<{ message: string }, NewUser>({
      query: (user) => ({
        url: '/register',
        method: 'POST',
        body: user,
      }),
    }),

    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    verifyUser: builder.mutation<
      { message: string; user: TUser },
      { email: string; code: string }
    >({
      query: (data) => ({
        url: '/verify',
        method: 'POST',
        body: data,
      }),
    }),

    getAllUsers: builder.query<TUser[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),

    getUserById: builder.query<TUser, number>({
      query: (id) => `/user/${id}`,
      providesTags: ['Users'],
    }),

    updateUserById: builder.mutation<TUser, { id: number } & Partial<TUser>>({
      query: ({ id, ...data }) => ({
        url: `/user/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
} = usersAPI;
