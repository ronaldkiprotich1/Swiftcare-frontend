import { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaPlus, FaCalendarCheck, FaSearch, FaTimes } from "react-icons/fa";
import { MdDeleteForever, MdPayment, MdFilterList } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import UpdateAppointment from "./UpdateAppointment";
import DeleteAppointment from "./DeleteAppointment";
import CreateAppointment from "./CreateAppointment";
import CreatePayment from "../../adminDashboard/payments/CreatePayment";
import { 
  appointmentsAPI, 
  type TAppointment, 
  type TDetailedAppointment 
} from "../../../features/appointments/appointmentsAPI";
import { toast } from "sonner";
import type { RootState } from "../../../app/store";

const UserAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<TAppointment | null>(null);
  const [paymentAppointment, setPaymentAppointment] = useState<TAppointment | null>(null);

  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchResult, setSearchResult] = useState<TDetailedAppointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);

  // Get user ID from Redux store
  const userId = useSelector((state: RootState) => state.user.user?.userId);

  // API hooks - fallback to basic appointment search if detailed fails
  const [getDetailedAppointmentById] = appointmentsAPI.useLazyGetDetailedAppointmentByIdQuery();
  const [getBasicAppointmentById] = appointmentsAPI.useLazyGetAppointmentByIdQuery();

  // Try to use detailed appointments, fallback to basic appointments
  const {
    data: detailedAppointmentsData,
    isLoading: detailedLoading,
    error: detailedError,
    refetch: refetchDetailed,
  } = appointmentsAPI.useGetDetailedAppointmentsByUserIdQuery(userId ?? 0, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Fallback to basic appointments if detailed endpoint fails
  const {
    data: basicAppointmentsData,
    isLoading: basicLoading,
    error: basicError,
    refetch: refetchBasic,
  } = appointmentsAPI.useGetAppointmentsByUserIdQuery(userId ?? 0, {
    skip: !userId || (!detailedError && !detailedAppointmentsData),
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Determine which data to use
  const appointmentsData = detailedAppointmentsData || basicAppointmentsData;
  const appointmentsLoading = detailedLoading || basicLoading;
  const appointmentsError = detailedError && basicError;
  const refetch = detailedAppointmentsData ? refetchDetailed : refetchBasic;

  // Event handlers
  const handleEdit = useCallback((appointment: TAppointment) => {
    setSelectedAppointment(appointment);
    (document.getElementById("update_appointment_modal") as HTMLDialogElement)?.showModal();
  }, []);

  const handleMakePayment = useCallback((appointment: TAppointment) => {
    setPaymentAppointment(appointment);
    (document.getElementById("create_payment_modal") as HTMLDialogElement)?.showModal();
  }, []);

  const handleCreateNew = useCallback(() => {
    (document.getElementById("create_appointment_modal") as HTMLDialogElement)?.showModal();
  }, []);

  const handlePaymentCreated = useCallback(() => {
    refetch();
    setSearchResult(null);
    setSearchAppointmentID("");
    toast.success("Payment created successfully!");
  }, [refetch]);

  const handleSearch = useCallback(async () => {
    if (!searchAppointmentID.trim()) {
      toast.info("Enter an Appointment ID to search.");
      return;
    }

    setIsSearching(true);
    try {
      let result;
      let appointment;
      
      // Try detailed first, fallback to basic
      try {
        result = await getDetailedAppointmentById(parseInt(searchAppointmentID)).unwrap();
        appointment = result.appointment;
      } catch (detailedErr) {
        console.log("Detailed search failed, trying basic search...");
        const basicResult = await getBasicAppointmentById(parseInt(searchAppointmentID)).unwrap();
        appointment = basicResult.appointment;
      }

      if (!appointment) {
        toast.error("Appointment not found.");
        setSearchResult(null);
      } else if (appointment.userID !== userId) {
        toast.error("You can only view your own appointments.");
        setSearchResult(null);
      } else {
        // Convert basic appointment to detailed format if needed
        const detailedAppointment: TDetailedAppointment = {
          ...appointment,
          patient: undefined,
          doctor: undefined,
        };
        setSearchResult(detailedAppointment);
        toast.success("Appointment found!");
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Appointment not found or an error occurred.");
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  }, [searchAppointmentID, getDetailedAppointmentById, getBasicAppointmentById, userId]);

  const handleClearFilters = useCallback(() => {
    setSearchResult(null);
    setSearchAppointmentID("");
    setStatusFilter("all");
    toast.info("Filters cleared");
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
    toast.info("Appointments refreshed");
  }, [refetch]);

  // Utility functions
  const renderStatusBadge = useCallback((status: string) => {
    const statusStyles = {
      Confirmed: "badge-success bg-green-500 text-white",
      Pending: "badge-warning bg-yellow-500 text-white",
      Completed: "badge-info bg-blue-500 text-white",
      Cancelled: "badge-error bg-red-500 text-white"
    };

    return (
      <span className={`badge ${statusStyles[status as keyof typeof statusStyles]} px-3 py-1`}>
        <span className="text-sm font-medium">{status}</span>
      </span>
    );
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const formatTime = useCallback((timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const getDoctorName = useCallback((appointment: TDetailedAppointment | TAppointment) => {
    if ('doctor' in appointment && appointment.doctor) {
      return `Dr. ${appointment.doctor.name} ${appointment.doctor.lastName}`;
    }
    return `Doctor ID: ${appointment.doctorID}`;
  }, []);

  const getDoctorSpecialization = useCallback((appointment: TDetailedAppointment | TAppointment) => {
    if ('doctor' in appointment && appointment.doctor) {
      return appointment.doctor.specialization;
    }
    return "N/A";
  }, []);

  // Render functions
  const renderAppointmentRow = useCallback((appointment: TDetailedAppointment | TAppointment) => (
    <tr key={appointment.appointmentID} className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-4 py-3 border-r border-gray-200 font-medium text-gray-900">
        #{appointment.appointmentID}
      </td>
      <td className="px-4 py-3 border-r border-gray-200">
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium">{getDoctorName(appointment)}</span>
          <span className="text-sm text-gray-500">{getDoctorSpecialization(appointment)}</span>
        </div>
      </td>
      <td className="px-4 py-3 border-r border-gray-200 text-gray-700">
        {formatDate(appointment.appointmentDate)}
      </td>
      <td className="px-4 py-3 border-r border-gray-200 text-gray-700">
        {formatTime(appointment.timeSlot)}
      </td>
      <td className="px-4 py-3 border-r border-gray-200 font-semibold text-gray-900">
        ${appointment.totalAmount?.toFixed(2) || '0.00'}
      </td>
      <td className="px-4 py-3 border-r border-gray-200">
        {renderStatusBadge(appointment.appointmentStatus)}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 flex-wrap">
          <button
            className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none tooltip"
            onClick={() => handleEdit(appointment)}
            title="Edit Appointment"
            data-tip="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none tooltip"
            onClick={() => {
              setAppointmentToDelete(appointment);
              (document.getElementById("delete_appointment_modal") as HTMLDialogElement)?.showModal();
            }}
            title="Delete Appointment"
            data-tip="Delete"
          >
            <MdDeleteForever size={16} />
          </button>
          {appointment.appointmentStatus !== "Completed" && appointment.totalAmount && appointment.totalAmount > 0 && (
            <button
              className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none tooltip"
              onClick={() => handleMakePayment(appointment)}
              title="Make Payment"
              data-tip="Pay"
            >
              <MdPayment size={14} />
              Pay
            </button>
          )}
        </div>
      </td>
    </tr>
  ), [handleEdit, handleMakePayment, formatDate, formatTime, getDoctorName, getDoctorSpecialization, renderStatusBadge]);

  // Computed values - handle both detailed and basic appointments
  const appointments = useMemo(() => {
    if (detailedAppointmentsData?.data) {
      return detailedAppointmentsData.data;
    }
    if (basicAppointmentsData?.appointments) {
      // Convert basic appointments to detailed format
      return basicAppointmentsData.appointments.map(apt => ({
        ...apt,
        patient: undefined,
        doctor: undefined,
      }));
    }
    return [];
  }, [detailedAppointmentsData, basicAppointmentsData]);

  const filteredAppointments = useMemo(() => {
    if (searchResult) {
      return [searchResult];
    }
    
    return appointments.filter(appointment => 
      statusFilter === "all" || appointment.appointmentStatus === statusFilter
    );
  }, [searchResult, appointments, statusFilter]);

  const appointmentStats = useMemo(() => {
    if (!appointments.length) {
      return { total: 0, confirmed: 0, pending: 0, completed: 0, cancelled: 0 };
    }

    return {
      total: appointments.length,
      confirmed: appointments.filter(a => a.appointmentStatus === "Confirmed").length,
      pending: appointments.filter(a => a.appointmentStatus === "Pending").length,
      completed: appointments.filter(a => a.appointmentStatus === "Completed").length,
      cancelled: appointments.filter(a => a.appointmentStatus === "Cancelled").length,
    };
  }, [appointments]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Modal Components */}
      <CreateAppointment refetch={refetch} />
      <CreatePayment
        refetch={refetch}
        appointment={paymentAppointment}
        onPaymentCreated={handlePaymentCreated}
      />
      <UpdateAppointment appointment={selectedAppointment} refetch={refetch} />
      <DeleteAppointment appointment={appointmentToDelete} refetch={refetch} />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
            <p className="text-gray-600">Manage your medical appointments and schedule new ones</p>
          </div>
          
          <div className="flex gap-3">
            <button
              className="btn bg-gray-500 hover:bg-gray-600 text-white border-none"
              onClick={handleRefresh}
              disabled={appointmentsLoading}
              title="Refresh appointments"
            >
              <HiOutlineRefresh size={16} className={appointmentsLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none"
              onClick={handleCreateNew}
            >
              <FaPlus size={16} />
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2" />
                Search by Appointment ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchAppointmentID}
                  onChange={(e) => setSearchAppointmentID(e.target.value)}
                  placeholder="Enter appointment ID..."
                  className="input input-bordered flex-1 bg-white focus:border-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={isSearching}
                />
                <button 
                  className="btn bg-blue-600 hover:bg-blue-700 text-white border-none"
                  onClick={handleSearch}
                  disabled={isSearching || !searchAppointmentID.trim()}
                >
                  {isSearching ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <FaSearch size={16} />
                  )}
                  Search
                </button>
              </div>
            </div>
            
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdFilterList className="inline mr-2" />
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered bg-white w-full lg:w-auto focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {(searchResult || statusFilter !== "all") && (
              <button 
                className="btn bg-gray-500 hover:bg-gray-600 text-white border-none"
                onClick={handleClearFilters}
              >
                <FaTimes size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {appointmentsLoading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="loading loading-spinner loading-lg text-indigo-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your appointments...</p>
        </div>
      )}

      {/* Error State */}
      {appointmentsError && (
        <div className="alert alert-error mb-6 bg-red-50 border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium">Error loading appointments</p>
              <p className="text-red-700">Please try refreshing the page or contact support if the problem persists.</p>
              <button 
                className="mt-2 btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none"
                onClick={handleRefresh}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {!appointmentsLoading && !appointmentsError && (
        <>
          {/* Stats Cards */}
          {!searchResult && appointments.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total</p>
                    <p className="text-2xl font-bold">{appointmentStats.total}</p>
                  </div>
                  <FaCalendarCheck size={24} className="opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Confirmed</p>
                    <p className="text-2xl font-bold">{appointmentStats.confirmed}</p>
                  </div>
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Pending</p>
                    <p className="text-2xl font-bold">{appointmentStats.pending}</p>
                  </div>
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Completed</p>
                    <p className="text-2xl font-bold">{appointmentStats.completed}</p>
                  </div>
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Cancelled</p>
                    <p className="text-2xl font-bold">{appointmentStats.cancelled}</p>
                  </div>
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-600 text-white">
                  <tr>
                    <th className="text-left px-4 py-4 font-semibold">Appointment ID</th>
                    <th className="text-left px-4 py-4 font-semibold">Doctor</th>
                    <th className="text-left px-4 py-4 font-semibold">Date</th>
                    <th className="text-left px-4 py-4 font-semibold">Time</th>
                    <th className="text-left px-4 py-4 font-semibold">Amount</th>
                    <th className="text-left px-4 py-4 font-semibold">Status</th>
                    <th className="text-left px-4 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map(renderAppointmentRow)}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!appointmentsLoading && 
       !appointmentsError &&
       !searchResult && 
       (!appointments || appointments.length === 0) && (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <FaCalendarCheck size={64} className="mx-auto" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Appointments Found</h3>
          <p className="text-gray-500 mb-6">You haven't scheduled any appointments yet.</p>
          <button
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none"
            onClick={handleCreateNew}
          >
            <FaPlus size={16} />
            Book Your First Appointment
          </button>
        </div>
      )}

      {/* Filtered Empty State */}
      {!appointmentsLoading && 
       !appointmentsError &&
       !searchResult && 
       appointments && 
       appointments.length > 0 && 
       filteredAppointments.length === 0 && 
       statusFilter !== "all" && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <FaCalendarCheck size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No {statusFilter} Appointments</h3>
          <p className="text-gray-500">No appointments found with status: {statusFilter}</p>
        </div>
      )}

      {/* Search No Results */}
      {!appointmentsLoading && 
       !appointmentsError &&
       searchResult === null && 
       searchAppointmentID && 
       !isSearching && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <FaSearch size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Appointment Not Found</h3>
          <p className="text-gray-500">No appointment found with ID: <strong>#{searchAppointmentID}</strong></p>
          <p className="text-sm text-gray-400 mt-2">Make sure the ID is correct and the appointment belongs to you.</p>
        </div>
      )}
    </div>
  );
};

export default UserAppointments;