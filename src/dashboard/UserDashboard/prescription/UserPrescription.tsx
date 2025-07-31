import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { prescriptionsAPI, type TPrescription } from "../../../features/prescriptions/prescriptionAPI";
import type { RootState } from "../../../app/store";

const UserPrescriptions = () => {
  // Fixed: Changed userID to userId to match Redux store structure
  const userId = useSelector((state: RootState) => state.user.user?.userId);
  
  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchResult, setSearchResult] = useState<TPrescription[] | null>(null);

  // Get prescriptions for the current user using the corrected query
  const { data: prescriptionsData, isLoading, error, refetch } = prescriptionsAPI.useGetPrescriptionsByUserIdQuery(
    userId ?? 0,
    {
      skip: !userId,
      refetchOnMountOrArgChange: true,
      pollingInterval: 30000, // Poll every 30 seconds
    }
  );

  const [getByAppointmentId] = prescriptionsAPI.useLazyGetPrescriptionsByAppointmentIdQuery();

  // Debug logging
  console.log("=== USER PRESCRIPTIONS DEBUG ===");
  console.log("Current User ID:", userId);
  console.log("Prescriptions Data:", prescriptionsData);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);
  console.log("===============================");

  const handleSearch = async () => {
    setSearchResult(null);

    if (!userId) {
      toast.error("Please log in to search prescriptions.");
      return;
    }

    if (searchAppointmentID.trim()) {
      try {
        const result = await getByAppointmentId(parseInt(searchAppointmentID)).unwrap();
        // Fixed: Direct array access since API returns TPrescription[] directly
        const ownPrescriptions = result.filter(
          (prescription: TPrescription) => prescription.patientId === userId || prescription.userId === userId
        );
        
        if (ownPrescriptions.length === 0) {
          toast.error("No prescriptions found for this appointment.");
        } else {
          setSearchResult(ownPrescriptions);
          toast.success(`Found ${ownPrescriptions.length} prescription(s) for this appointment.`);
        }
      } catch (error) {
        console.error("Error searching prescriptions:", error);
        toast.error("No prescriptions found for this appointment.");
      }
    } else {
      toast.info("Enter an Appointment ID to search.");
    }
  };

  const clearSearch = () => {
    setSearchResult(null);
    setSearchAppointmentID("");
    toast.info("Search cleared.");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseMedications = (medicationsString: string) => {
    try {
      const medications = JSON.parse(medicationsString);
      if (Array.isArray(medications)) {
        return medications.map((med: any, index: number) => (
          <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
            <div className="font-semibold text-blue-600">{med.name}</div>
            <div className="text-sm text-gray-600">
              Dosage: {med.dosage} | Frequency: {med.frequency}
            </div>
          </div>
        ));
      }
    } catch (error) {
      // If parsing fails, return the raw string
      return <div className="text-gray-600">{medicationsString}</div>;
    }
    return <div className="text-gray-600">{medicationsString}</div>;
  };

  const renderPrescriptionRow = (prescription: TPrescription) => (
    <tr key={prescription.prescriptionId} className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-4 py-3 border-r border-gray-200 font-medium">
        #{prescription.prescriptionId}
      </td>
      <td className="px-4 py-3 border-r border-gray-200">
        #{prescription.appointmentId}
      </td>
      <td className="px-4 py-3 border-r border-gray-200">
        Dr. #{prescription.doctorId}
      </td>
      <td className="px-4 py-3 border-r border-gray-200 max-w-md">
        <div className="max-h-32 overflow-y-auto">
          {parseMedications(prescription.medications)}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-gray-200 max-w-xs">
        <div className="text-sm text-gray-600">
          {prescription.dosage || "-"}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-gray-200 max-w-xs">
        <div className="text-sm text-gray-600">
          {prescription.instructions || "-"}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-gray-200 max-w-xs">
        <div className="text-sm text-gray-600">
          {prescription.notes || "-"}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDate(prescription.createdAt)}
      </td>
    </tr>
  );

  // Show message for unauthenticated users
  if (!userId) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">Please log in to view your prescriptions.</p>
          <p className="text-sm text-gray-500">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Prescriptions</h1>
        <p className="text-gray-600">View and track your medical prescriptions</p>
      </div>

      {/* Search Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            value={searchAppointmentID}
            onChange={(e) => setSearchAppointmentID(e.target.value)}
            placeholder="Search by Appointment ID"
            className="input input-bordered bg-white text-black border-gray-300"
          />
          <button 
            className="btn bg-indigo-600 text-white hover:bg-indigo-700" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            Search
          </button>
          {searchResult && (
            <button 
              className="btn bg-gray-500 text-white hover:bg-gray-600" 
              onClick={clearSearch}
            >
              Clear Search
            </button>
          )}
          <button 
            className="btn bg-green-600 text-white hover:bg-green-700" 
            onClick={() => refetch()}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
            <p className="mt-4 text-gray-600">Loading your prescriptions...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error mb-6">
          <div>
            <p className="font-semibold">Error fetching prescriptions</p>
            <p className="text-sm">Please check your connection and try again.</p>
          </div>
          <button className="btn btn-sm btn-outline" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {/* Prescriptions Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prescription ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Appointment ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Medications</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dosage</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Instructions</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {searchResult
                  ? searchResult.map(renderPrescriptionRow)
                  : prescriptionsData?.map(renderPrescriptionRow)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty States */}
      {!searchResult && (!prescriptionsData || prescriptionsData.length === 0) && !isLoading && !error && (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border">
          <div className="max-w-sm mx-auto">
            <div className="text-6xl text-gray-300 mb-4">💊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No prescriptions found</h3>
            <p className="text-gray-600">
              You don't have any prescriptions yet. Prescriptions will appear here after your appointments.
            </p>
          </div>
        </div>
      )}
      
      {searchResult && searchResult.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
          <div className="text-4xl text-gray-300 mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
          <p className="text-gray-600">No prescriptions found for the specified appointment ID.</p>
        </div>
      )}

      {/* Statistics Card */}
      {prescriptionsData && prescriptionsData.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {prescriptionsData.length}
              </div>
              <div className="text-sm text-gray-600">Total Prescriptions</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {new Set(prescriptionsData.map(p => p.doctorId)).size}
              </div>
              <div className="text-sm text-gray-600">Different Doctors</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(prescriptionsData.map(p => p.appointmentId)).size}
              </div>
              <div className="text-sm text-gray-600">Related Appointments</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPrescriptions;