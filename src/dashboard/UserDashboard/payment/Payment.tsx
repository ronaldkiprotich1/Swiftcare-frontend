import { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import { paymentsAPI, type TPayment } from "../../../features/payments/paymentAPI";
import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";
import CreatePayment from "../../adminDashboard/payments/CreatePayment";
import UpdatePayment from "../../adminDashboard/payments/UpdatePayment";
import DeletePayment from "../../adminDashboard/payments/DeletePayment";
import type { RootState } from "../../../app/store";

const UserPayments = () => {
  const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<TPayment | null>(null);
  const [paymentAppointment] = useState<TAppointment | null>(null);

  const [searchPaymentID, setSearchPaymentID] = useState("");
  const [searchResult, setSearchResult] = useState<TPayment | null>(null);

  const userID = useSelector((state: RootState) => state.user.user?.userID);

  const { data: userAppointmentsData } = appointmentsAPI.useGetAppointmentsByUserIdQuery(userID ?? 0, {
    skip: !userID,
  });

  const [getPaymentById] = paymentsAPI.useLazyGetPaymentByIdQuery();
 
  const userAppointmentIDs = userAppointmentsData?.appointments?.map(
    (appt: TAppointment) => appt.appointmentID
  ) || [];

  const {
    data: paymentsData,
    isLoading,
    error,
    refetch,
  } = paymentsAPI.useGetPaymentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const handleSearch = async () => {
    setSearchResult(null);

    if (!searchPaymentID.trim()) {
      toast.info("Enter a Payment ID to search.");
      return;
    }
    try {
      const result = await getPaymentById(parseInt(searchPaymentID)).unwrap();
      if (!result.payment) {
        toast.error("Payment not found.");
      } else if (!userAppointmentIDs.includes(result.payment.appointmentID)) {
        toast.error("You can only view your own payments.");
      } else {
        setSearchResult(result.payment);
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment not found.");
    }
  };

  const handleEdit = (payment: TPayment) => {
    setSelectedPayment(payment);
    (document.getElementById("update_payment_modal") as HTMLDialogElement)?.showModal();
  };

  const handlePaymentCreated = () => {
    // Refetch payments data when a new payment is created
    refetch();
    // Clear search results to show updated list
    setSearchResult(null);
    setSearchPaymentID("");
    // Show success message
    toast.success("Payment created successfully!");
  };

  const renderPaymentRow = (payment: TPayment) => (
    <tr key={payment.paymentID} className="hover:bg-gray-300 border-b border-gray-400">
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{payment.paymentID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{payment.appointmentID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{payment.amount}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{payment.transactionID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{payment.paymentDate}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
        <span className={`badge ${payment.paymentStatus ? "badge-success" : "badge-warning"}`}>
          <span className={payment.paymentStatus ? "text-green-700" : "text-yellow-700"}>
            {payment.paymentStatus ? "Paid" : "Pending"}
          </span>
        </span>
      </td>
      <td className="flex">
        <button
          className="btn btn-sm btn-primary mr-4 text-blue-500"
          onClick={() => handleEdit(payment)}
        >
          <FaEdit size={20} />
        </button>
        <button
          className="btn btn-sm btn-danger text-red-500"
          onClick={() => {
            setPaymentToDelete(payment);
            (document.getElementById("delete_payment_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <MdDeleteForever size={20} />
        </button>
      </td>
    </tr>
  );

  const filteredPayments = paymentsData?.payments?.filter((p) =>
    userAppointmentIDs.includes(p.appointmentID)
  ) || [];

  return (
    <div>
      <CreatePayment 
        refetch={refetch} 
        appointment={paymentAppointment} 
        onPaymentCreated={handlePaymentCreated}
      />
      <UpdatePayment payment={selectedPayment} refetch={refetch} />
      <DeletePayment payment={paymentToDelete} refetch={refetch} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 mt-4 gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchPaymentID}
            onChange={(e) => setSearchPaymentID(e.target.value)}
            placeholder="Search by Payment ID"
            className="input input-bordered p-2 rounded-md bg-white"
          />
          <button className="btn btn-primary bg-white text-black" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {isLoading && <p>Loading payments...</p>}
      {error && <p className="text-red-500">Error fetching payments.</p>}

      <div className="md:overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr className="bg-gray-600 text-white text-md lg:text-lg">
              <th>Payment ID</th>
              <th>Appointment ID</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchResult
              ? renderPaymentRow(searchResult)
              : filteredPayments.map(renderPaymentRow)}
          </tbody>
        </table>
      </div>

      {!searchResult && filteredPayments.length === 0 && !isLoading && (
        <p>No Payments Found.</p>
      )}
    </div>
  );
};

export default UserPayments;