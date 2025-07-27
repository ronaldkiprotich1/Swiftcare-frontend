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

function App() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyUser />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />

        {/*  Patient dashboard with nested routes */}
        <Route path="/patient/dashboard/*" element={<PatientDashboard />}>
          <Route path="complaint" element={<PatientComplaints />} />
          
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
