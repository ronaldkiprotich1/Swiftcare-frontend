// src/reducers/users/usersAPI.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../../utils/ApiDomain';
import type { RootState } from '../../app/store';

export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isVerified: string;
  image_url?: string;
};

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.user?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    createUsers: builder.mutation<TUser, Partial<TUser>>({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Users'],
    }),
    verifyUser: builder.mutation<{ message: string }, { email: string; code: string }>({
      query: (data) => ({
        url: '/auth/verify',
        method: 'POST',
        body: data,
      }),
    }),
    getUsers: builder.query<TUser[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getUserById: builder.query<TUser, number>({
      query: (id) => `/user/${id}`,
    }),
    updateUser: builder.mutation<TUser, Partial<TUser> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/user/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useCreateUsersMutation,
  useVerifyUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = usersAPI;
