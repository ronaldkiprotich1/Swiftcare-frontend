import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import UpdateAppointment from "./UpdateAppointment";
import DeleteAppointment from "./DeleteAppointment";
import CreateAppointment from "./BookAppointment";
import CreatePayment from "../payments/CreatePayment";
// import { InitiateMpesaPayment } from "../payments/InitiateMpesaPayment";
import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";
import { toast } from "sonner";

const Appointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<TAppointment | null>(null);
  const [paymentAppointment, setPaymentAppointment] = useState<TAppointment | null>(null);

  const [mpesaPaymentID, setMpesaPaymentID] = useState<number | null>(null);
  const [mpesaAmount, setMpesaAmount] = useState<number | null>(null);

  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchUserID, setSearchUserID] = useState("");
  const [searchResult, setSearchResult] = useState<TAppointment | null>(null);
  const [searchUserResults, setSearchUserResults] = useState<TAppointment[] | null>(null);

  const [getAppointmentById] = appointmentsAPI.useLazyGetAppointmentByIdQuery();
  const [getAppointmentsByUserId] = appointmentsAPI.useLazyGetAppointmentsByUserIdQuery();

  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    error: appointmentsError,
    refetch,
  } = appointmentsAPI.useGetAppointmentsQuery(undefined, {
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

  const handlePaymentCreated = (paymentID: number, amount: number) => {
    setMpesaPaymentID(paymentID);
    setMpesaAmount(amount);
    (document.getElementById("initiate_mpesa_payment_modal") as HTMLDialogElement)?.showModal();
  };

  const handleSearch = async () => {
    setSearchResult(null);
    setSearchUserResults(null);

    if (searchAppointmentID.trim()) {
      try {
        const result = await getAppointmentById(parseInt(searchAppointmentID)).unwrap();
        if (!result.appointment) {
          toast.error("Appointment not found.");
        } else {
          setSearchResult(result.appointment);
        }
      } catch (err) {
        console.error(err);
        toast.error("Appointment not found.");
      }
    } else if (searchUserID.trim()) {
      try {
        const result = await getAppointmentsByUserId(parseInt(searchUserID)).unwrap();
        if (!result.appointments || result.appointments.length === 0) {
          toast.error("No appointments found for this user.");
        } else {
          setSearchUserResults(result.appointments);
        }
      } catch (err) {
        console.error(err);
        toast.error("No appointments found for this user.");
      }
    } else {
      toast.info("Please enter an Appointment ID or User ID to search.");
    }
  };

  const renderStatusBadge = (status: string) => (
    <span className={`badge ${status === "Confirmed" ? "badge-success" : "badge-warning"}`}>
      <span className="lg:text-base text-white">{status}</span>
    </span>
  );

  return (
    <div>
      <CreateAppointment refetch={refetch} />
      <CreatePayment refetch={refetch} appointment={paymentAppointment} onPaymentCreated={handlePaymentCreated} />
      {/* <InitiateMpesaPayment appointment={paymentAppointment} paymentID={mpesaPaymentID} amount={mpesaAmount} refetch={refetch} /> */}
      <UpdateAppointment appointment={selectedAppointment} refetch={refetch} />
      <DeleteAppointment appointment={appointmentToDelete} refetch={refetch} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 mt-4 gap-3">
        <button
          className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg"
          onClick={() => (document.getElementById("create_appointment_modal") as HTMLDialogElement)?.showModal()}
        >
          Book Appointment
        </button>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchAppointmentID}
            onChange={(e) => setSearchAppointmentID(e.target.value)}
            placeholder="Search by Appointment ID"
            className="input input-bordered p-2 rounded-md bg-white"
          />
          <input
            type="text"
            value={searchUserID}
            onChange={(e) => setSearchUserID(e.target.value)}
            placeholder="Search by User ID"
            className="input input-bordered p-2 rounded-md bg-white"
          />
          <button className="btn btn-primary bg-white text-black" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Single search result */}
      {searchResult && (
        <div className="overflow-x-auto mb-4">
          <table className="table table-xs">
            <thead>
              <tr className="bg-blue-700 text-white text-md">
                <th>Appointment ID</th>
                <th>User ID</th>
                <th>Doctor ID</th>
                <th>Appointment Date</th>
                <th>Time Slot</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-300 border-b border-gray-400">
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{searchResult.appointmentID}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{searchResult.userID}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{searchResult.doctorID}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{searchResult.appointmentDate}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{searchResult.timeSlot}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{searchResult.totalAmount}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{renderStatusBadge(searchResult.appointmentStatus)}</td>
                <td className="flex">
                  <button
                    className="btn btn-sm btn-primary mr-4 text-blue-500"
                    onClick={() => handleEdit(searchResult)}
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger text-red-500"
                    onClick={() => {
                      setAppointmentToDelete(searchResult);
                      (document.getElementById("delete_appointment_modal") as HTMLDialogElement)?.showModal();
                    }}
                  >
                    <MdDeleteForever size={20} />
                  </button>
                  <button
                    className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2"
                    onClick={() => handleMakePayment(searchResult)}
                  >
                    Create Payment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* User results */}
      {searchUserResults && (
        <div className="md:overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr className="bg-gray-600 text-white text-md lg:text-lg">
                <th>Appointment ID</th>
                <th>User ID</th>
                <th>Doctor ID</th>
                <th>Appointment Date</th>
                <th>Time Slot</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchUserResults.map((appointment) => (
                <tr key={appointment.appointmentID} className="hover:bg-gray-300 border-b border-gray-400">
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.appointmentID}</td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.userID}</td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.doctorID}</td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.appointmentDate}</td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.timeSlot}</td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.totalAmount}</td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{renderStatusBadge(appointment.appointmentStatus)}</td>
                  <td className="flex">
                    <button
                      className="btn btn-sm btn-primary mr-4 text-blue-500"
                      onClick={() => handleEdit(appointment)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger text-red-500"
                      onClick={() => {
                        setAppointmentToDelete(appointment);
                        (document.getElementById("delete_appointment_modal") as HTMLDialogElement)?.showModal();
                      }}
                    >
                      <MdDeleteForever size={20} />
                    </button>
                    <button
                      className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg"
                      onClick={() => handleMakePayment(appointment)}
                    >
                      Create Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!searchResult && !searchUserResults && (
        <>
          {appointmentsLoading && <p>Loading Appointments...</p>}
          {appointmentsError && <p className="text-red-500">Error fetching appointments.</p>}
          {appointmentsData?.appointments?.length ? (
            <div className="md:overflow-x-auto">
              <table className="table table-xs">
                <thead>
                  <tr className="bg-gray-600 text-white text-md lg:text-lg">
                    <th>Appointment ID</th>
                    <th>User ID</th>
                    <th>Doctor ID</th>
                    <th>Appointment Date</th>
                    <th>Time Slot</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsData.appointments.map((appointment) => (
                    <tr key={appointment.appointmentID} className="hover:bg-gray-300 border-b border-gray-400">
                      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.appointmentID}</td>
                      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.userID}</td>
                      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.doctorID}</td>
                      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.appointmentDate}</td>
                      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.timeSlot}</td>
                      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appointment.totalAmount}</td>
                      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{renderStatusBadge(appointment.appointmentStatus)}</td>
                      <td className="flex">
                        <button
                          className="btn btn-sm btn-primary mr-4 text-blue-500"
                          onClick={() => handleEdit(appointment)}
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger text-red-500"
                          onClick={() => {
                            setAppointmentToDelete(appointment);
                            (document.getElementById("delete_appointment_modal") as HTMLDialogElement)?.showModal();
                          }}
                        >
                          <MdDeleteForever size={20} />
                        </button>
                        <button
                          className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg ml-2"
                          onClick={() => handleMakePayment(appointment)}
                        >
                          Make Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !appointmentsLoading && <p>No Appointments Found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Appointments;