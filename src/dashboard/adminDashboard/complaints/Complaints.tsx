
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import { complaintsAPI, type TComplaint } from "../../../features/complaint/complaintsAPI";
import DeleteComplaint from "./DeleteComplaint";

const Complaints = () => {
  const [searchUserID, setSearchUserID] = useState("");
  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchResult, setSearchResult] = useState<TComplaint[] | null>(null);
  const [complaintToDelete, setComplaintToDelete] = useState<TComplaint | null>(null);

  const { data: complaintsData, isLoading, error, refetch } = complaintsAPI.useGetComplaintsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const [getByUserId] = complaintsAPI.useLazyGetComplaintsByUserIdQuery();
  const [getByAppointmentId] = complaintsAPI.useLazyGetComplaintsByAppointmentIdQuery();
  const [updateComplaintStatus] = complaintsAPI.useUpdateComplaintMutation();

  const handleSearch = async () => {
    if (searchUserID.trim()) {
      try {
        const result = await getByUserId(parseInt(searchUserID)).unwrap();
        if (!result.complaints || result.complaints.length === 0) {
          toast.error("No complaints found for this user.");
          setSearchResult(null);
        } else {
          setSearchResult(result.complaints);
        }
      } catch (err) {
        toast.error("No complaints found for this user.");
        setSearchResult(null);
      }
    } else if (searchAppointmentID.trim()) {
      try {
        const result = await getByAppointmentId(parseInt(searchAppointmentID)).unwrap();
        if (!result.complaints || result.complaints.length === 0) {
          toast.error("No complaints found for this appointment.");
          setSearchResult(null);
        } else {
          setSearchResult(result.complaints);
        }
      } catch (err) {
        toast.error("No complaints found for this appointment.");
        setSearchResult(null);
      }
    } else {
      toast.error("Enter a User ID or Appointment ID to search.");
    }
  };

  const handleStatusChange = async (complaintID: number, newStatus: string) => {
    try {
      await updateComplaintStatus({ complaintID, status: newStatus }).unwrap();
      toast.success(`Complaint marked as ${newStatus}`);
      refetch();
    } catch (err) {
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
          className="btn btn-sm btn-danger text-red-500"
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
      <DeleteComplaint complaint={complaintToDelete} refetch={refetch} />

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4 mt-4">
        <input
          type="text"
          value={searchUserID}
          onChange={(e) => setSearchUserID(e.target.value)}
          placeholder="Search by User ID"
          className="input input-bordered input-sm text-black bg-white"
        />
        <input
          type="text"
          value={searchAppointmentID}
          onChange={(e) => setSearchAppointmentID(e.target.value)}
          placeholder="Search by Appointment ID"
          className="input input-bordered input-sm text-black bg-white"
        />
        <button
          className="btn btn-sm bg-white text-black"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {isLoading && <p>Loading complaints...</p>}
      {error && <p className="text-red-500">Error fetching complaints.</p>}

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr className="bg-gray-600 text-white text-md lg:text-lg">
              <th>Complaint ID</th>
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

export default Complaints;