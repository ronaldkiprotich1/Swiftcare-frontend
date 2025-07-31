import { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import type { RootState } from "../../../app/store";

import CreatePrescription from "./CreatePrescription";
import UpdatePrescription from "../../adminDashboard/prescription/UpdatePrescription";
import DeletePrescription from "../../adminDashboard/prescription/DeletePrescription";

import {
  prescriptionsAPI,
  type TPrescription,
} from "../../../features/prescriptions/prescriptionAPI";

const DoctorPrescriptions = () => {
  const [searchAppointmentId, setSearchAppointmentId] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchResults, setSearchResults] = useState<TPrescription[] | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<TPrescription | null>(null);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<TPrescription | null>(null);

  const doctorId = useSelector((state: RootState) => state.user.user?.userId);

  const { data, isLoading, refetch } = prescriptionsAPI.useGetPrescriptionsByDoctorIdQuery(
    doctorId ?? 0,
    { skip: !doctorId }
  );

  const [getPrescriptionById] = prescriptionsAPI.useLazyGetPrescriptionByIdQuery();
  const [getPrescriptionsByUserId] = prescriptionsAPI.useLazyGetPrescriptionsByUserIdQuery();

  const handleSearch = async () => {
    setSearchResults(null);
    if (searchAppointmentId) {
      try {
        const result = await getPrescriptionById(Number(searchAppointmentId)).unwrap();
        if (!result || result.doctorId !== doctorId) {
          toast.error("Prescription not found or not assigned to you.");
        } else {
          setSearchResults([result]);
        }
      } catch {
        toast.error("Prescription not found.");
      }
    } else if (searchUserId) {
      try {
        const results = await getPrescriptionsByUserId(Number(searchUserId)).unwrap();
        const filtered = results.filter((p) => p.doctorId === doctorId);
        setSearchResults(filtered);
        if (!filtered.length) toast.error("No prescriptions found for this user.");
      } catch {
        toast.error("Failed to fetch prescriptions.");
      }
    } else {
      toast.info("Please enter either an Appointment ID or User ID to search.");
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
          value={searchAppointmentId}
          onChange={(e) => setSearchAppointmentId(e.target.value)}
          className="input input-bordered"
        />
        <input
          type="text"
          placeholder="User ID"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          className="input input-bordered"
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button
          className="btn btn-success"
          onClick={() =>
            (document.getElementById("create_prescription_modal") as HTMLDialogElement)?.showModal()
          }
        >
          Add Prescription
        </button>
      </div>

      {isLoading && <p>Loading prescriptions...</p>}

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
          {(searchResults || data)?.map((p) => (
            <tr key={p.prescriptionId} className="hover:bg-gray-200 border-b border-gray-300">
              <td className="px-4 py-2">{p.prescriptionId}</td>
              <td className="px-4 py-2">{p.appointmentId}</td>
              <td className="px-4 py-2">{p.userId}</td>
              <td className="px-4 py-2">{p.notes || "-"}</td>
              <td className="flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setSelectedPrescription(p);
                    (document.getElementById("update_prescription_modal") as HTMLDialogElement)?.showModal();
                  }}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="btn btn-sm btn-error"
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
        appointmentId={1} // Optional: Pass dynamically or let CreatePrescription handle it
        doctorId={doctorId ?? 0}
        userId={1}
      />
    </div>
  );
};

export default DoctorPrescriptions;
