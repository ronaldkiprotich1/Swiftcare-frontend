// src/pages/payment/PaymentSuccess.tsx
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 shadow-lg rounded text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-700 mb-4">
          Thank you! Your payment has been processed successfully.
        </p>
        <Link to="/appointments" className="btn btn-success">
          View Appointment
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
