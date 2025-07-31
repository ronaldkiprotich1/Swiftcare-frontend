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
      } catch {
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
      } catch {
        toast.error("No complaints found for this appointment.");
        setSearchResult(null);
      }
    } else {
      toast.error("Enter a User ID or Appointment ID to search.");
    }
  };

  const handleStatusChange = async (complaintId: number, newStatus: string) => {
    try {
      await updateComplaintStatus({ complaintId, status: newStatus }).unwrap();
      toast.success(`Complaint marked as ${newStatus}`);
      refetch();

      if (searchResult && searchUserID.trim()) {
        const result = await getByUserId(parseInt(searchUserID)).unwrap();
        setSearchResult(result.complaints || []);
      } else if (searchResult && searchAppointmentID.trim()) {
        const result = await getByAppointmentId(parseInt(searchAppointmentID)).unwrap();
        setSearchResult(result.complaints || []);
      }
    } catch {
      toast.error(`Failed to mark as ${newStatus}`);
    }
  };

  const handleClearSearch = () => {
    setSearchUserID("");
    setSearchAppointmentID("");
    setSearchResult(null);
  };

  const renderComplaintRow = (complaint: TComplaint) => (
    <tr key={complaint.complaintId} className="hover:bg-gray-100 border-b border-gray-300">
      <td className="px-4 py-2">{complaint.complaintId}</td>
      <td className="px-4 py-2">{complaint.userId}</td>
      <td className="px-4 py-2">{complaint.relatedAppointmentId || "-"}</td>
      <td className="px-4 py-2 max-w-xs truncate" title={complaint.subject}>{complaint.subject}</td>
      <td className="px-4 py-2">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          complaint.status === 'Open' ? 'bg-blue-100 text-blue-800' :
          complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
          complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
          complaint.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
          'bg-gray-200 text-gray-700'
        }`}>
          {complaint.status}
        </span>
      </td>
      <td className="px-4 py-2">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <button
            className={`btn btn-xs ${complaint.status === "Open" ? "btn-outline btn-primary" : "btn-primary"}`}
            onClick={() => handleStatusChange(complaint.complaintId, "Open")}
            disabled={complaint.status === "Open"}
          >
            Open
          </button>
          <button
            className={`btn btn-xs ${complaint.status === "In Progress" ? "btn-outline btn-warning" : "btn-warning"}`}
            onClick={() => handleStatusChange(complaint.complaintId, "In Progress")}
            disabled={complaint.status === "In Progress"}
          >
            In Progress
          </button>
          <button
            className={`btn btn-xs ${complaint.status === "Resolved" ? "btn-outline btn-success" : "btn-success"}`}
            onClick={() => handleStatusChange(complaint.complaintId, "Resolved")}
            disabled={complaint.status === "Resolved"}
          >
            Resolved
          </button>
          <button
            className={`btn btn-xs ${complaint.status === "Closed" ? "btn-outline btn-error" : "btn-error"}`}
            onClick={() => handleStatusChange(complaint.complaintId, "Closed")}
            disabled={complaint.status === "Closed"}
          >
            Closed
          </button>
          <button
            className="btn btn-xs btn-outline btn-error"
            title="Delete Complaint"
            onClick={() => {
              setComplaintToDelete(complaint);
              (document.getElementById("delete_complaint_modal") as HTMLDialogElement)?.showModal();
            }}
          >
            <MdDeleteForever size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <DeleteComplaint complaint={complaintToDelete} refetch={refetch} />

      {/* Search Section */}
      <div className="card bg-base-100 shadow mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Search Complaints</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              value={searchUserID}
              onChange={(e) => {
                setSearchUserID(e.target.value);
                if (e.target.value) setSearchAppointmentID("");
              }}
              placeholder="Search by User ID"
              className="input input-bordered flex-1"
              min="1"
            />
            <input
              type="number"
              value={searchAppointmentID}
              onChange={(e) => {
                setSearchAppointmentID(e.target.value);
                if (e.target.value) setSearchUserID("");
              }}
              placeholder="Search by Appointment ID"
              className="input input-bordered flex-1"
              min="1"
            />
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleSearch}
                disabled={!searchUserID.trim() && !searchAppointmentID.trim()}
              >
                Search
              </button>
              <button className="btn btn-outline" onClick={handleClearSearch}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading/Error */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">Loading complaints...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <span>Error fetching complaints. Please try again.</span>
        </div>
      )}

      {/* Results Count */}
      {(searchResult || complaintsData?.complaints) && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {searchResult
              ? `Found ${searchResult.length} complaint(s) from search`
              : `Showing ${complaintsData?.complaints?.length || 0} total complaint(s)`}
          </p>
        </div>
      )}

      {/* Complaints Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-600 text-white text-left">
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

      {/* No Results */}
      {!isLoading && (
        <>
          {searchResult && searchResult.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No complaints found for your search criteria.</p>
            </div>
          )}
          {!searchResult && complaintsData?.complaints?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No complaints found in the system.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Complaints;
