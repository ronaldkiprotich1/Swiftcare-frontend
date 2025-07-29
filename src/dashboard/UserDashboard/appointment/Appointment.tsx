import { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import UpdateAppointment from "./UpdateAppointment";
import DeleteAppointment from "./DeleteAppointment";
import CreatePayment from "../../adminDashboard/payments/CreatePayment";
import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";
import { toast } from "sonner";
import type { RootState } from "../../../app/store";

const UserAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<TAppointment | null>(null);
  const [paymentAppointment, setPaymentAppointment] = useState<TAppointment | null>(null);

  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchResult, setSearchResult] = useState<TAppointment | null>(null);

  const userID = useSelector((state: RootState) => state.user.user?.userID);

  const [getAppointmentById] = appointmentsAPI.useLazyGetAppointmentByIdQuery();

  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    error: appointmentsError,
    refetch,
  } = appointmentsAPI.useGetAppointmentsByUserIdQuery(userID ?? 0, {
    skip: !userID,
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const handleEdit = (appointment: TAppointment) => {
    setSelectedAppointment(appointment);
    (document.getElementById("update_appointment_modal") as HTMLDialogElement)?.showModal();
  };

  const handleMakePayment = (appointment: TAppointment) => {
    setPaymentAppointment(appointment);
    (document.getElementById("create_payment_modal") as HTMLDialogElement)?.showModal();
  };

  const handlePaymentCreated = () => {
    // Refetch appointments to get updated data
    refetch();
    // Clear search results to show updated list
    setSearchResult(null);
    setSearchAppointmentID("");
    // Show success message
    toast.success("Payment created successfully!");
  };

  const handleSearch = async () => {
    setSearchResult(null);

    if (!searchAppointmentID.trim()) {
      toast.info("Enter an Appointment ID to search.");
      return;
    }

    try {
      const result = await getAppointmentById(parseInt(searchAppointmentID)).unwrap();
      if (!result.appointment) {
        toast.error("Appointment not found.");
      } else if (result.appointment.userID !== userID) {
        toast.error("You can only view your own appointments.");
      } else {
        setSearchResult(result.appointment);
      }
    } catch (err) {
      console.error(err);
      toast.error("Appointment not found.");
    }
  };

  const renderStatusBadge = (status: string) => (
    <span className={`badge ${status === "Confirmed" ? "badge-success" : "badge-warning"}`}>
      <span className="lg:text-base text-white">{status}</span>
    </span>
  );

  const renderAppointmentRow = (appointment: TAppointment) => (
    <tr key={appointment.appointmentID} className="hover:bg-gray-300 border-b border-gray-400">
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.appointmentID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.userID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.doctorID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.appointmentDate}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.timeSlot}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">${appointment.totalAmount}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
        {renderStatusBadge(appointment.appointmentStatus)}
      </td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-primary text-blue-500 hover:bg-blue-50"
            onClick={() => handleEdit(appointment)}
            title="Edit Appointment"
          >
            <FaEdit size={18} />
          </button>
          <button
            className="btn btn-sm btn-danger text-red-500 hover:bg-red-50"
            onClick={() => {
              setAppointmentToDelete(appointment);
              (document.getElementById("delete_appointment_modal") as HTMLDialogElement)?.showModal();
            }}
            title="Delete Appointment"
          >
            <MdDeleteForever size={18} />
          </button>
          <button
            className="btn btn-sm bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded-md"
            onClick={() => handleMakePayment(appointment)}
            title="Make Payment"
          >
            Pay Now
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      {/* Modal Components */}
      <CreatePayment
        refetch={refetch}
        appointment={paymentAppointment}
        onPaymentCreated={handlePaymentCreated}
      />
      <UpdateAppointment appointment={selectedAppointment} refetch={refetch} />
      <DeleteAppointment appointment={appointmentToDelete} refetch={refetch} />

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchAppointmentID}
            onChange={(e) => setSearchAppointmentID(e.target.value)}
            placeholder="Search by Appointment ID"
            className="input input-bordered px-4 py-2 rounded-md bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button 
            className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
          {searchResult && (
            <button 
              className="btn btn-secondary bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              onClick={() => {
                setSearchResult(null);
                setSearchAppointmentID("");
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading and Error States */}
      {appointmentsLoading && (
        <div className="text-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-2 text-gray-600">Loading your appointments...</p>
        </div>
      )}

      {appointmentsError && (
        <div className="alert alert-error mb-4">
          <p className="text-red-700">Error fetching appointments. Please try again.</p>
        </div>
      )}

      {/* Results Table */}
      {!appointmentsLoading && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-600 text-white">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">User ID</th>
                <th className="text-left px-4 py-3">Doctor ID</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResult ? (
                renderAppointmentRow(searchResult)
              ) : (
                appointmentsData?.appointments?.map(renderAppointmentRow)
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!appointmentsLoading && 
       !searchResult && 
       appointmentsData?.appointments?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <FaEdit size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Appointments Found</h3>
          <p className="text-gray-500">You haven't scheduled any appointments yet.</p>
        </div>
      )}

      {/* Search No Results */}
      {searchResult === null && searchAppointmentID && !appointmentsLoading && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">No appointment found with ID: {searchAppointmentID}</p>
        </div>
      )}
    </div>
  );
};

export default UserAppointments;