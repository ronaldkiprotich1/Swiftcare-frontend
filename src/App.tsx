import { Routes, Route } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/footer/Footer";
import AboutPage from "./pages/AboutPage";
import LandingPage from "./pages/LandingPage";
import Appointment from "./pages/Appointment";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyUser from "./pages/auth/VerifyUser";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancelled from "./pages/payment/PaymentCancelled";

import PatientDashboard from "./dashboard/patientDashboard/PatientDashboard";
import PatientComplaints from "./dashboard/patientDashboard/main/complaints/PatientComplaints";

import AdminDashboard from "./dashboard/adminDashboard/AdminDashboard";
import AdminComplaints from "./dashboard/adminDashboard/main/complaints/AdminComplaints";
import Users from "./dashboard/adminDashboard/main/users/Users";
import DoctorDashboard from "./dashboard/doctorDashboard/DoctorDashboard";
import DoctorAppointments from "./dashboard/doctorDashboard/appointment/DoctorAppointment";
import DoctorPrescriptions from "./dashboard/doctorDashboard/prescription/Prescription";
import Profile from "./dashboard/patientDashboard/Profile";



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
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />

        {/* Patient dashboard with nested route(s) */}
        <Route path="/patient/dashboard/*" element={<PatientDashboard />}>
          <Route path="complaint" element={<PatientComplaints />} />
        </Route>

        {/* Admin dashboard with nested routes */}
        <Route path="/admin/dashboard/*" element={<AdminDashboard />}>
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* Doctor dashboard with nested routes */}
        <Route path="/doctor/dashboard/*" element={<DoctorDashboard />}>
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
