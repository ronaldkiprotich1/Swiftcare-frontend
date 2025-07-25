// src/pages/payment/PaymentPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const PaymentPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("KES");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/payments/intent/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
        setAmount(data.amount);
        setCurrency(data.currency || "KES");
        setLoading(false);
      } catch (err) {
        setError("Unable to initiate payment.");
        setLoading(false);
      }
    };
    fetchClientSecret();
  }, [appointmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed.");
    }
  };

  if (loading) return <p className="text-center py-20">Loading payment...</p>;
  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-blue-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">Complete Your Payment</h2>
        <p className="text-center mb-2">Total: <strong>{currency} {amount}</strong></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <button
            type="submit"
            disabled={!stripe || !elements}
            className="btn btn-primary w-full"
          >
            Pay Now
          </button>
        </form>
      </div>
    </section>
  );
};

export default PaymentPage;
