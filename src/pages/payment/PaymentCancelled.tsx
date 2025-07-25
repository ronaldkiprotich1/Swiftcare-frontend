// src/pages/payment/PaymentCancelled.tsx
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white p-8 shadow-lg rounded text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-700 mb-4">
          Your payment was not completed. You can try again or contact support.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/appointments" className="btn btn-outline btn-error">
            Back to Appointments
          </Link>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
