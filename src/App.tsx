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
import AdminComplaints from "./dashboard/adminDashboard/complaints/Complaints";

// // Patient Dashboard
// import PatientDashboard from "./dashboard/patientDashboard/PatientDashboard";
// import PatientComplaints from "./dashboard/patientDashboard/main/complaints/PatientComplaints";

// Admin Dashboard
import AdminDashboard from "./dashboard/adminDashboard/AdminDashboard";


// Doctor Dashboard
import DoctorDashboard from "./dashboard/doctorDashboard/DoctorDashboard";
import DoctorAppointments from "./dashboard/doctorDashboard/appointment/DoctorAppointment";
import DoctorPrescriptions from "./dashboard/doctorDashboard/prescription/Prescription";
import Profile from "./dashboard/patientDashboard/Profile";
import Payments from "./dashboard/adminDashboard/payments/Payments";
import Prescriptions from "./dashboard/adminDashboard/prescription/Prescription";
import AdminDoctors from "./dashboard/adminDashboard/doctor/AdminDoctor";
import { Users } from "lucide-react";
import { IoAnalytics } from "react-icons/io5";


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

        {/* Patient dashboard with nested routes
        <Route path="/patient/dashboard/*" element={<PatientDashboard />}>
          <Route path="complaint" element={<PatientComplaints />} />
        </Route> */}

        {/* Admin dashboard with full nested routes */}
        <Route path="/admin/dashboard/*" element={<AdminDashboard />}>
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="payments" element={<Payments />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
          <Route path="analytics" element={<IoAnalytics />} />
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
