import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";
import type { RootState } from "../../../app/store";
// import CreatePrescription from "../prescription/CreatePrescription";

const DoctorAppointments = () => {
  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchUserID, setSearchUserID] = useState("");
  const [searchResults, setSearchResults] = useState<TAppointment[] | null>(null);

  const doctorID = useSelector((state: RootState) => state.user.user?.doctorID);


  const [getAppointmentById] = appointmentsAPI.useLazyGetAppointmentByIdQuery();
  const [getAppointmentsByUserId] = appointmentsAPI.useLazyGetAppointmentsByUserIdQuery();

  const {
    data: appointmentsData,
    isLoading,
    error,
  } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(doctorID ?? 0, {
    skip: !doctorID,
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const handleSearch = async () => {
    setSearchResults(null);

    if (searchAppointmentID.trim()) {
      try {
        const result = await getAppointmentById(parseInt(searchAppointmentID)).unwrap();
        if (!result.appointment) {
          toast.error("Appointment not found.");
        } else if (result.appointment.doctorID !== doctorID) {
          toast.error("This appointment is not for you.");
        } else {
          setSearchResults([result.appointment]);
        }
      } catch {
        toast.error("Appointment not found.");
      }
    } else if (searchUserID.trim()) {
      try {
        const result = await getAppointmentsByUserId(parseInt(searchUserID)).unwrap();
        const filtered = result.appointments.filter((appt) => appt.doctorID === doctorID);
        if (!filtered.length) {
          toast.error("No appointments found for this user with you.");
        } else {
          setSearchResults(filtered);
        }
      } catch {
        toast.error("No appointments found for this user.");
      }
    } else {
      toast.info("Enter Appointment ID or User ID to search.");
    }
  };

  const renderStatusBadge = (status: string) => (
    <span className={`badge ${status === "Confirmed" ? "badge-success" : "badge-warning"}`}>
      <span className="lg:text-base text-white">{status}</span>
    </span>
  );

  return (
    <div>
       {/* <CreatePrescription
        refetch={refetch}
        appointmentID={1}
        doctorID={doctorID ?? 0}
        userID={1}
      /> */}
      <div className="flex flex-wrap gap-2 mb-4 mt-4">
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

      {isLoading && <p>Loading your Appointments...</p>}
      {error && <p className="text-red-500">Error fetching appointments.</p>}

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr className="bg-gray-700 text-white text-md lg:text-lg">
              <th>Appointment ID</th>
              <th>User ID</th>
              <th>Doctor ID</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(searchResults || appointmentsData?.appointments)?.map((appt) => (
              <tr key={appt.appointmentID} className="hover:bg-gray-300 border-b border-gray-400">
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appt.appointmentID}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appt.userID}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appt.doctorID}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appt.appointmentDate}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appt.timeSlot}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{appt.totalAmount}</td>
                <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{renderStatusBadge(appt.appointmentStatus)}</td>
                <td className="flex">
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      (document.getElementById(
                        "create_prescription_modal"
                      ) as HTMLDialogElement).showModal()
                    }
                  >
                    Prescribe
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!(searchResults || appointmentsData?.appointments?.length) && !isLoading && (
        <p>No Appointments Found.</p>
      )}
    </div>
  );
};

export default DoctorAppointments;