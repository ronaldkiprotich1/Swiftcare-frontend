import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FaSearch, FaEye, FaPrescriptionBottleAlt } from "react-icons/fa";
import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";
import type { RootState } from "../../../app/store";
// import CreatePrescription from "../prescription/CreatePrescription";

const DoctorAppointments = () => {
  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchUserID, setSearchUserID] = useState("");
  const [searchResults, setSearchResults] = useState<TAppointment[] | null>(null);

  // Get user data - use userId as doctorID since TUser doesn't have a separate doctorID field
  const user = useSelector((state: RootState) => state.user.user);
  const doctorId = user?.userId; // Using userId as the doctor identifier

  const [getAppointmentById] = appointmentsAPI.useLazyGetAppointmentByIdQuery();
  const [getAppointmentsByUserId] = appointmentsAPI.useLazyGetAppointmentsByUserIdQuery();

  const {
    data: appointmentsData,
    isLoading,
    error,
  } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(doctorId ?? 0, {
    skip: !doctorId,
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000, // Reduced polling frequency
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const handleSearch = async () => {
    setSearchResults(null);

    if (searchAppointmentID.trim()) {
      try {
        const result = await getAppointmentById(parseInt(searchAppointmentID)).unwrap();
        if (!result.appointment) {
          toast.error("Appointment not found.");
        } else if (result.appointment.doctorID !== doctorId) {
          toast.error("This appointment is not assigned to you.");
        } else {
          setSearchResults([result.appointment]);
          toast.success("Appointment found!");
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Appointment not found.");
      }
    } else if (searchUserID.trim()) {
      try {
        const result = await getAppointmentsByUserId(parseInt(searchUserID)).unwrap();
        const filtered = result.appointments.filter((appt) => appt.doctorID === doctorId);
        if (!filtered.length) {
          toast.error("No appointments found for this user with you.");
        } else {
          setSearchResults(filtered);
          toast.success(`Found ${filtered.length} appointment(s) for this user.`);
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("No appointments found for this user.");
      }
    } else {
      toast.info("Enter Appointment ID or User ID to search.");
    }
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setSearchAppointmentID("");
    setSearchUserID("");
  };

  const handlePrescribe = (appointment: TAppointment) => {
    console.log("Create prescription for:", appointment);
    (document.getElementById("create_prescription_modal") as HTMLDialogElement)?.showModal();
  };

  const renderStatusBadge = (status: string) => {
    const statusColors = {
      Confirmed: "badge-success bg-green-600",
      Pending: "badge-warning bg-yellow-500",
      Completed: "badge-info bg-blue-600",
      Cancelled: "badge-error bg-red-600",
    };

    return (
      <span className={`badge text-white px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors] || "badge-neutral"}`}>
        {status}
      </span>
    );
  };

  const renderAppointmentRow = (appointment: TAppointment) => (
    <tr key={appointment.appointmentID} className="hover:bg-gray-50 border-b border-gray-200 transition-colors">
      <td className="px-4 py-3 border-r border-gray-200 font-medium">{appointment.appointmentID}</td>
      <td className="px-4 py-3 border-r border-gray-200">{appointment.userID}</td>
      <td className="px-4 py-3 border-r border-gray-200">{appointment.doctorID}</td>
      <td className="px-4 py-3 border-r border-gray-200">{appointment.appointmentDate}</td>
      <td className="px-4 py-3 border-r border-gray-200 font-mono">{appointment.timeSlot}</td>
      <td className="px-4 py-3 border-r border-gray-200 font-semibold text-green-600">
        ${appointment.totalAmount}
      </td>
      <td className="px-4 py-3 border-r border-gray-200">
        {renderStatusBadge(appointment.appointmentStatus)}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
            onClick={() => handlePrescribe(appointment)}
            title="Create Prescription"
            disabled={appointment.appointmentStatus === "Cancelled"}
          >
            <FaPrescriptionBottleAlt size={14} />
            Prescribe
          </button>
          <button
            className="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
            onClick={() => {
              // Handle view details
              console.log("View appointment details:", appointment);
            }}
            title="View Details"
          >
            <FaEye size={14} />
            View
          </button>
        </div>
      </td>
    </tr>
  );

  const displayedAppointments = searchResults || appointmentsData?.appointments || [];

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Prescription Modal - Uncomment when CreatePrescription component is ready */}
      {/* <CreatePrescription
        appointment={selectedAppointment}
        doctorID={doctorId ?? 0}
      /> */}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage and view your scheduled appointments</p>
      </div>

      {/* Search Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Appointment ID
            </label>
            <input
              type="text"
              value={searchAppointmentID}
              onChange={(e) => {
                setSearchAppointmentID(e.target.value);
                if (e.target.value) setSearchUserID("");
              }}
              placeholder="Enter Appointment ID"
              className="input input-bordered w-full px-4 py-2 rounded-md bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by User ID
            </label>
            <input
              type="text"
              value={searchUserID}
              onChange={(e) => {
                setSearchUserID(e.target.value);
                if (e.target.value) setSearchAppointmentID("");
              }}
              placeholder="Enter User ID"
              className="input input-bordered w-full px-4 py-2 rounded-md bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
              onClick={handleSearch}
              disabled={!searchAppointmentID.trim() && !searchUserID.trim()}
            >
              <FaSearch size={16} />
              Search
            </button>
            {searchResults && (
              <button
                className="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {searchResults && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">
            Search Results: {searchResults.length} appointment(s) found
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your appointments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error mb-6 bg-red-50 border border-red-200">
          <p className="text-red-700 font-medium">
            Error fetching appointments. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Appointments Table */}
      {!isLoading && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="table w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-left px-4 py-3 font-semibold">Appointment ID</th>
                <th className="text-left px-4 py-3 font-semibold">User ID</th>
                <th className="text-left px-4 py-3 font-semibold">Doctor ID</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Time Slot</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedAppointments.map(renderAppointmentRow)}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && displayedAppointments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <FaPrescriptionBottleAlt size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchResults !== null ? "No Search Results" : "No Appointments Found"}
          </h3>
          <p className="text-gray-500">
            {searchResults !== null
              ? "No appointments match your search criteria."
              : "You don't have any scheduled appointments yet."}
          </p>
          {searchResults !== null && (
            <button
              className="mt-4 btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Statistics Card - Optional Enhancement */}
      {!isLoading && !searchResults && appointmentsData?.appointments && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800">Confirmed</h4>
            <p className="text-2xl font-bold text-green-600">
              {appointmentsData.appointments.filter(a => a.appointmentStatus === "Confirmed").length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800">Pending</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {appointmentsData.appointments.filter(a => a.appointmentStatus === "Pending").length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800">Completed</h4>
            <p className="text-2xl font-bold text-blue-600">
              {appointmentsData.appointments.filter(a => a.appointmentStatus === "Completed").length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800">Cancelled</h4>
            <p className="text-2xl font-bold text-red-600">
              {appointmentsData.appointments.filter(a => a.appointmentStatus === "Cancelled").length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;