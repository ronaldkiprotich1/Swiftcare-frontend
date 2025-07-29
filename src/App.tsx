import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import AboutPage from './pages/AboutPage';
import LandingPage from './pages/LandingPage';
import { Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';

import UserPayments from './dashboard/UserDashboard/payment/Payment';
import UserComplaints from './dashboard/UserDashboard/complaint/UserComplaint';
import UserPrescriptions from './dashboard/UserDashboard/prescription/UserPrescription';
import UserDoctors from './dashboard/UserDashboard/doctor/Doctor';
import Profile from './dashboard/Profile';
import Appointments from './dashboard/adminDashboard/appointments/Appointments';
import Login from './pages/auth/Login';
import VerifyUser from './pages/auth/VerifyUser';
import Register from './pages/auth/Register';
import DoctorPrescriptions from './dashboard/doctorDashboard/prescription/Prescription';
import { IoAnalytics } from 'react-icons/io5';
import AdminDoctors from './dashboard/adminDashboard/doctor/AdminDoctor';
import DoctorAppointments from './dashboard/doctorDashboard/appointment/DoctorAppointment';
import DoctorDashboard from './dashboard/doctorDashboard/DoctorDashboard';
import AdminDashboard from './dashboard/adminDashboard/AdminDashboard';
import UserDashboard from './dashboard/UserDashboard/appointment/UserDashboard';
import { Users } from 'lucide-react';
import Payments from './dashboard/adminDashboard/payments/Payments';
import UserAppointments from './dashboard/UserDashboard/appointment/Appointment';
import Prescriptions from './dashboard/adminDashboard/prescription/Prescription';
import Complaints from './dashboard/adminDashboard/complaints/Complaints';
import DoctorAnalysis from './dashboard/doctorDashboard/analytics/Analysis';

const App = () => {
  const isAdmin = useSelector((state: RootState) => state.user.user?.role === 'admin');
  const isUser = useSelector((state: RootState) => state.user.user?.role === 'user');
  const isDoctor = useSelector((state: RootState) => state.user.user?.role === 'doctor');

  const router = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/register', element: <Register /> },
    { path: '/login', element: <Login /> },
    { path: '/verify', element: <VerifyUser /> },

    {
      path: '/user/dashboard',
      element: isUser ? <UserDashboard /> : <Login />,
      children: [
        { path: 'appointments', element: <UserAppointments /> },
        { path: 'payments', element: <UserPayments /> },
        { path: 'prescriptions', element: <UserPrescriptions /> },
        { path: 'complaints', element: <UserComplaints /> },
        { path: 'doctors', element: <UserDoctors /> },
        { path: 'profile', element: <Profile /> },
      ],
    },

    {
      path: '/admin/dashboard',
      element: isAdmin ? <AdminDashboard /> : <Login />,
      children: [
        { path: 'appointments', element: <Appointments /> },
        { path: 'payments', element: <Payments /> },
        { path: 'prescriptions', element: <Prescriptions /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'doctors', element: <AdminDoctors /> },
        { path: 'users', element: <Users /> },
        { path: 'profile', element: <Profile /> },
        { path: 'analytics', element: <IoAnalytics /> },
      ],
    },

    {
      path: '/doctor/dashboard',
      element: isDoctor ? <DoctorDashboard /> : <Login />,
      children: [
        { path: 'appointments', element: <DoctorAppointments /> },
        { path: 'prescriptions', element: <DoctorPrescriptions /> },
        { path: 'profile', element: <Profile /> },
        { path: 'analytics', element: <DoctorAnalysis /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            error: 'bg-red-500 text-white',
            success: 'bg-green-500 text-white',
            info: 'bg-blue-500 text-white',
          },
        }}
      />
    </>
  );
};

export default App;
