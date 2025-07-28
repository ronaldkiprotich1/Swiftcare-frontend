import { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import type { RootState } from "../../../app/store";
import CreatePrescription from "./CreatePrescription";
import { prescriptionsAPI, type TPrescription } from "../../../features/prescriptions/prescriptionAPI";
import UpdatePrescription from "../../adminDashboard/prescription/UpdatePrescription";
import DeletePrescription from "../../adminDashboard/prescription/DeletePrescription";

const DoctorPrescriptions = () => {
  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchUserID, setSearchUserID] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<TPrescription | null>(null);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<TPrescription | null>(null);

  const doctorID = useSelector((state: RootState) => state.user.user?.doctorID);

  const { data, isLoading, refetch } =
    prescriptionsAPI.useGetPrescriptionsByDoctorIdQuery(doctorID ?? 0, {
      skip: !doctorID,
    });

  const [getPrescriptionById] =
    prescriptionsAPI.useLazyGetPrescriptionByIdQuery();
  const [getPrescriptionsByUserId] =
    prescriptionsAPI.useLazyGetPrescriptionsByUserIdQuery();

  const handleSearch = async () => {
    setSearchResults(null);
    if (searchAppointmentID) {
      try {
        const res = await getPrescriptionById(parseInt(searchAppointmentID)).unwrap();
        if (!res.prescription) {
          toast.error("Prescription not found");
        } else if (res.prescription.doctorID !== doctorID) {
          toast.error("Not yours");
        } else {
          setSearchResults([res.prescription]);
        }
      } catch {
        toast.error("Prescription not found");
      }
    } else if (searchUserID) {
      try {
        const res = await getPrescriptionsByUserId(parseInt(searchUserID)).unwrap();
        const filtered = res.prescriptions.filter(p => p.doctorID === doctorID);
        setSearchResults(filtered);
        if (!filtered.length) toast.error("None found for this user");
      } catch {
        toast.error("None found");
      }
    } else {
      toast.info("Enter appointment or user ID");
    }
  };

  return (
    <div className="p-4">
      <UpdatePrescription prescription={selectedPrescription} refetch={refetch} />
      <DeletePrescription prescription={prescriptionToDelete} refetch={refetch} />
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Appointment ID"
          value={searchAppointmentID}
          onChange={(e) => setSearchAppointmentID(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="User ID"
          value={searchUserID}
          onChange={(e) => setSearchUserID(e.target.value)}
          className="input"
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button
          className="btn btn-success"
          onClick={() =>
            (document.getElementById(
              "create_prescription_modal"
            ) as HTMLDialogElement).showModal()
          }
        >
          Add Prescription
        </button>
      </div>

      {isLoading && <p>Loading...</p>}

      <table className="table">
        <thead>
          <tr className="bg-gray-700 text-white text-md lg:text-lg">
            <th>ID</th>
            <th>Appointment</th>
            <th>User</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(searchResults || data?.prescriptions)?.map((p) => (
            <tr key={p.prescriptionID} className="hover:bg-gray-300 border-b border-gray-400">
              <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{p.prescriptionID}</td>
              <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{p.appointmentID}</td>
              <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{p.userID}</td>
              <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{p.notes}</td>
              <td className="flex gap-2">
                <button
                  className="btn btn-sm btn-primary text-blue-600"
                  onClick={() => {
                    setSelectedPrescription(p);
                    (document.getElementById("update_prescription_modal") as HTMLDialogElement)?.showModal();
                  }}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="btn btn-sm btn-danger text-red-500"
                  onClick={() => {
                    setPrescriptionToDelete(p);
                    (document.getElementById("delete_prescription_modal") as HTMLDialogElement)?.showModal();
                  }}
                >
                  <MdDeleteForever size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CreatePrescription
        refetch={refetch}
        appointmentID={1}
        doctorID={doctorID ?? 0}
        userID={1}
      />
    </div>
  );
};

export default DoctorPrescriptions;