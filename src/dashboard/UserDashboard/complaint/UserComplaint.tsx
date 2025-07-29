
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { complaintsAPI, type TComplaint } from "../../../features/complaint/complaintsAPI";
import DeleteComplaint from "../../adminDashboard/complaints/DeleteComplaint";
import UpdateComplaint from "./UpdateComplaint";
import type { RootState } from "../../../app/store";
import CreateComplaint from "./CreatePayment";

const UserComplaints = () => {
  const userID = useSelector((state: RootState) => state.user.user?.userID);

  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchComplaintID, setSearchComplaintID] = useState("");
  const [searchResult, setSearchResult] = useState<TComplaint[] | null>(null);

  const [complaintToDelete, setComplaintToDelete] = useState<TComplaint | null>(null);
  const [complaintToUpdate, setComplaintToUpdate] = useState<TComplaint | null>(null);

  const { data: complaintsData, isLoading, error, refetch } =
    complaintsAPI.useGetComplaintsByUserIdQuery(userID ?? 0, {
      skip: !userID,
      refetchOnMountOrArgChange: true,
      pollingInterval: 10000,
    });

  const [getByAppointmentId] = complaintsAPI.useLazyGetComplaintsByAppointmentIdQuery();
  const [getByComplaintId] = complaintsAPI.useLazyGetComplaintByIdQuery();
  const [updateComplaintStatus] = complaintsAPI.useUpdateComplaintMutation();

  const handleSearch = async () => {
    setSearchResult(null);

    if (searchComplaintID.trim()) {
      try {
        const result = await getByComplaintId(parseInt(searchComplaintID)).unwrap();
        if (!result.complaint) {
          toast.error("Complaint not found.");
        } else if (result.complaint.userID !== userID) {
          toast.error("You can only view your own complaints.");
        } else {
          setSearchResult([result.complaint]);
        }
      } catch {
        toast.error("Complaint not found.");
      }
    } else if (searchAppointmentID.trim()) {
      try {
        const result = await getByAppointmentId(parseInt(searchAppointmentID)).unwrap();
        const ownComplaints = result.complaints.filter(
          (c) => c.userID === userID
        );
        if (ownComplaints.length === 0) {
          toast.error("No complaints found for this appointment.");
        } else {
          setSearchResult(ownComplaints);
        }
      } catch {
        toast.error("No complaints found for this appointment.");
      }
    } else {
      toast.error("Enter a Complaint ID or Appointment ID to search.");
    }
  };

  const handleStatusChange = async (complaintID: number, newStatus: string) => {
    try {
      await updateComplaintStatus({ complaintID, status: newStatus }).unwrap();
      toast.success(`Complaint marked as ${newStatus}`);
      refetch();
    } catch {
      toast.error(`Failed to mark as ${newStatus}`);
    }
  };

  const renderComplaintRow = (complaint: TComplaint) => (
    <tr key={complaint.complaintID} className="hover:bg-gray-300 border-b border-gray-400">
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{complaint.complaintID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{complaint.userID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{complaint.relatedAppointmentID || "-"}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{complaint.subject}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{complaint.status}</td>
      <td className="flex flex-wrap gap-1">
        <button
          className="btn btn-xs btn-primary"
          onClick={() => handleStatusChange(complaint.complaintID, "Open")}
        >
          Open
        </button>
        <button
          className="btn btn-xs btn-warning"
          onClick={() => handleStatusChange(complaint.complaintID, "In Progress")}
        >
          In Progress
        </button>
        <button
          className="btn btn-xs btn-success"
          onClick={() => handleStatusChange(complaint.complaintID, "Resolved")}
        >
          Resolved
        </button>
        <button
          className="btn btn-xs btn-error"
          onClick={() => handleStatusChange(complaint.complaintID, "Closed")}
        >
          Closed
        </button>
        <button
          className="btn btn-xs btn-info text-blue-600"
          onClick={() => {
            setComplaintToUpdate(complaint);
            (document.getElementById("update_complaint_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <FaEdit size={16} />
        </button>
        <button
          className="btn btn-xs btn-danger text-red-500"
          onClick={() => {
            setComplaintToDelete(complaint);
            (document.getElementById("delete_complaint_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <MdDeleteForever size={16} />
        </button>
      </td>
    </tr>
  );

  return (
    <div>
      <CreateComplaint refetch={refetch} />
      <UpdateComplaint complaint={complaintToUpdate} refetch={refetch} />
      <DeleteComplaint complaint={complaintToDelete} refetch={refetch} />

      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="btn bg-gray-700 text-white"
          onClick={() =>
            (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.showModal()
          }
        >
          Create Complaint
        </button>

        <input
          type="text"
          value={searchComplaintID}
          onChange={(e) => setSearchComplaintID(e.target.value)}
          placeholder="Search by Complaint ID"
          className="input input-bordered input-sm text-black bg-white"
        />
        <input
          type="text"
          value={searchAppointmentID}
          onChange={(e) => setSearchAppointmentID(e.target.value)}
          placeholder="Search by Appointment ID"
          className="input input-bordered input-sm text-black bg-white"
        />
        <button className="btn btn-sm bg-white text-black" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isLoading && <p>Loading complaints...</p>}
      {error && <p className="text-red-500">Error fetching complaints.</p>}

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr className="bg-gray-600 text-white text-md lg:text-lg">
              <th>ID</th>
              <th>User ID</th>
              <th>Appointment ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchResult
              ? searchResult.map(renderComplaintRow)
              : complaintsData?.complaints?.map(renderComplaintRow)}
          </tbody>
        </table>
      </div>

      {!searchResult && complaintsData?.complaints?.length === 0 && (
        <p>No complaints found.</p>
      )}
    </div>
  );
};

export default UserComplaints;

