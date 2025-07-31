import { Routes, Route } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/footer/Footer";

import AboutPage from "./pages/AboutPage";
import LandingPage from "./pages/LandingPage";
import Appointment from "./pages/Appointment";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyUser from "./pages/auth/VerifyUser";

// Dashboards
import AdminDashboard from "./dashboard/adminDashboard/AdminDashboard";
import DoctorDashboard from "./dashboard/doctorDashboard/DoctorDashboard";
// import UserDashboard from "./dashboard/UserDashboard/userDashboard";
import Analytics from "./dashboard/adminDashboard/analytics/Analysis";
import Users from "./dashboard/adminDashboard/manageUsers/Users";






import AdminDoctors from "./dashboard/adminDashboard/doctor/AdminDoctor";
import AdminComplaints from "./dashboard/adminDashboard/complaints/Complaints";

// Doctor Pages
import DoctorAppointments from "./dashboard/doctorDashboard/appointment/DoctorAppointment";
import DoctorPrescriptions from "./dashboard/doctorDashboard/prescription/Prescription";
import DoctorAnalysis from './dashboard/doctorDashboard/analytics/Analysis'

// Shared
import Profile from "./dashboard/Profile";
import UserAppointments from "./dashboard/UserDashboard/appointment/Appointment";
// import UserComplaints from './dashboard/UserDashboard/complaint/UserComplaint';
import UserPrescriptions from "./dashboard/UserDashboard/prescription/UserPrescription";
import UserDoctors from "./dashboard/UserDashboard/doctor/Doctor";
import UserComplaints from "./dashboard/UserDashboard/complaint/UserComplaint";
import UserDashboard from "./dashboard/UserDashboard/userDashboard";
import ChatWidget from "./components/ChatWidget";
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-xl font-semibold">{title} Page Coming Soon</div>
);

function App() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content font-sans">
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyUser />} />

        {/* User Dashboard - Properly nested */}
        <Route path="/user/dashboard" element={<UserDashboard />}>
          <Route index element={<Placeholder title="User Dashboard" />} />
          <Route path="appointments" element={<UserAppointments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="complaints" element={<UserComplaints />} />
          <Route path="prescriptions" element={<UserPrescriptions />} />
          <Route path="doctors" element={<UserDoctors />} />

        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<Placeholder title="Admin Dashboard" />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="users" element={<Users />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="medical-records" element={<Placeholder title="Medical Records" />} />
          <Route path="departments" element={<Placeholder title="Departments" />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Placeholder title="System Settings" />} />
        </Route>

        {/* Doctor Dashboard */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />}>
          <Route index element={<Placeholder title="Doctor Dashboard" />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
           <Route path="analytics" element={<DoctorAnalysis />} />  {/* <-- Add this line */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
{/* 👇 Floating Chat Assistant */}
      <ChatWidget />
      <Footer />
    </div>
  );
}

export default App;