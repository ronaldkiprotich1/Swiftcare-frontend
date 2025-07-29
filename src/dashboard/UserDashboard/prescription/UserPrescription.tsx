import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { prescriptionsAPI, type TPrescription } from "../../../features/prescriptions/prescriptionAPI";
import type { RootState } from "../../../app/store";

const UserPrescriptions = () => {
  const userID = useSelector((state: RootState) => state.user.user?.userID);

  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchResult, setSearchResult] = useState<TPrescription[] | null>(null);

  const { data: prescriptionsData, isLoading, error } = prescriptionsAPI.useGetPrescriptionsByUserIdQuery(
    userID ?? 0,
    {
      skip: !userID,
      refetchOnMountOrArgChange: true,
      pollingInterval: 10000,
    }
  );

  const [getByAppointmentId] = prescriptionsAPI.useLazyGetPrescriptionsByAppointmentIdQuery();

  const handleSearch = async () => {
    setSearchResult(null);

    if (searchAppointmentID.trim()) {
      try {
        const result = await getByAppointmentId(parseInt(searchAppointmentID)).unwrap();
        const ownPrescriptions = result.prescriptions.filter(
          (p) => p.userID === userID
        );

        if (ownPrescriptions.length === 0) {
          toast.error("No prescriptions found for this appointment.");
        } else {
          setSearchResult(ownPrescriptions);
        }
      } catch {
        toast.error("No prescriptions found for this appointment.");
      }
    } else {
      toast.info("Enter an Appointment ID to search.");
    }
  };

  const renderPrescriptionRow = (prescription: TPrescription) => (
    <tr key={prescription.prescriptionID} className="hover:bg-gray-200 border-b border-gray-400">
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.prescriptionID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.userID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.doctorID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.appointmentID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.notes || "-"}</td>
    </tr>
  );

  return (
    <div className="w-full">
    
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 mt-4">
        <input
          type="text"
          value={searchAppointmentID}
          onChange={(e) => setSearchAppointmentID(e.target.value)}
          placeholder="Search by Appointment ID"
          className="input input-bordered bg-white text-black"
        />
        <button className="btn btn-primary text-white" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isLoading && <p>Loading prescriptions...</p>}
      {error && <p className="text-red-600">Error fetching prescriptions.</p>}

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr className="bg-gray-700 text-white text-md lg:text-lg">
              <th>Prescription ID</th>
              <th>User ID</th>
              <th>Doctor ID</th>
              <th>Appointment ID</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {searchResult
              ? searchResult.map(renderPrescriptionRow)
              : prescriptionsData?.prescriptions?.map(renderPrescriptionRow)}
          </tbody>
        </table>
      </div>

      {!searchResult && !isLoading && prescriptionsData?.prescriptions?.length === 0 && (
        <p className="mt-4">No Prescriptions Found.</p>
      )}
    </div>
  );
};

export default UserPrescriptions;