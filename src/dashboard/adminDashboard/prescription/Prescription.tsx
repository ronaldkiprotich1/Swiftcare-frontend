import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import UpdatePrescription from "./UpdatePrescription";
import DeletePrescription from "./DeletePrescription";
import { prescriptionsAPI, type TPrescription } from "../../../features/prescriptions/prescriptionAPI";

const Prescriptions = () => {
  const [searchUserID, setSearchUserID] = useState("");
  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchResult, setSearchResult] = useState<TPrescription[] | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<TPrescription | null>(null);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<TPrescription | null>(null);

  const { data: prescriptionsData, isLoading, error, refetch } = prescriptionsAPI.useGetPrescriptionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const [getByUserId] = prescriptionsAPI.useLazyGetPrescriptionsByUserIdQuery();
  const [getByAppointmentId] = prescriptionsAPI.useLazyGetPrescriptionsByAppointmentIdQuery();

  const handleSearch = async () => {
    if (searchUserID.trim()) {
      try {
        const result = await getByUserId(parseInt(searchUserID)).unwrap();
        if (!result.prescriptions || result.prescriptions.length === 0) {
          toast.error("No prescriptions found for this user.");
          setSearchResult(null);
        } else {
          setSearchResult(result.prescriptions);
        }
      } catch (err) {
        console.error(err);
        toast.error("No prescriptions found for this user.");
        setSearchResult(null);
      }
    } else if (searchAppointmentID.trim()) {
      try {
        const result = await getByAppointmentId(parseInt(searchAppointmentID)).unwrap();
        if (!result.prescriptions || result.prescriptions.length === 0) {
          toast.error("No prescriptions found for this appointment.");
          setSearchResult(null);
        } else {
          setSearchResult(result.prescriptions);
        }
      } catch (err) {
        console.error(err);
        toast.error("No prescriptions found for this appointment.");
        setSearchResult(null);
      }
    } else {
      toast.info("Enter a User ID or Appointment ID to search.");
    }
  };

  const renderPrescriptionRow = (prescription: TPrescription) => (
    <tr key={prescription.prescriptionID} className="hover:bg-gray-200 border-b border-gray-400">
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.prescriptionID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.userID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.doctorID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.appointmentID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{prescription.notes || "-"}</td>
      <td className="flex gap-2">
        <button
          className="btn btn-sm btn-primary text-blue-600"
          onClick={() => {
            setSelectedPrescription(prescription);
            (document.getElementById("update_prescription_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <FaEdit size={18} />
        </button>
        <button
          className="btn btn-sm btn-danger text-red-500"
          onClick={() => {
            setPrescriptionToDelete(prescription);
            (document.getElementById("delete_prescription_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <MdDeleteForever size={20} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      <UpdatePrescription prescription={selectedPrescription} refetch={refetch} />
      <DeletePrescription prescription={prescriptionToDelete} refetch={refetch} />

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 mt-4">
        <input
          type="text"
          value={searchUserID}
          onChange={(e) => setSearchUserID(e.target.value)}
          placeholder="Search by User ID"
          className="input input-bordered bg-white text-black"
        />
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
              <th>Actions</th>
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

export default Prescriptions;