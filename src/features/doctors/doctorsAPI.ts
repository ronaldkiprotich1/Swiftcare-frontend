import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type TDoctor = {
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    contactPhone: string;
    address: string;
    isVerified: boolean;
     image_url?: string;
  };
  doctor: {
    doctorId: number;
    specialization: string;
    availableDays: string[];
    rating?: number;      
    experience?: number;   
    patients?: number; 
  };
};

export const doctorsAPI = createApi({
  reducerPath: 'doctorsAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/doctors' }),
  tagTypes: ['Doctors'],
  endpoints: (builder) => ({
    getDoctors: builder.query<TDoctor[], void>({
      query: () => '/',
      providesTags: ['Doctors'],
    }),

    getDoctorById: builder.query<TDoctor, number>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'Doctors', id }],
    }),

    createDoctor: builder.mutation<TDoctor, Partial<TDoctor>>({
      query: (doctor) => ({
        url: '/',
        method: 'POST',
        body: doctor,
      }),
      invalidatesTags: ['Doctors'],
    }),

    updateDoctor: builder.mutation<TDoctor, { id: number; data: Partial<TDoctor> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Doctors', id }],
    }),

    deleteDoctor: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Doctors', id }],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsAPI;
