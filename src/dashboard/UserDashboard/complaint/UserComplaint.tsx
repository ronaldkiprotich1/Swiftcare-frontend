import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { complaintsAPI, type TComplaint } from "../../../features/complaint/complaintsAPI";
import DeleteComplaint from "../../adminDashboard/complaints/DeleteComplaint";
import UpdateComplaint from "./UpdateComplaint";
import type { RootState } from "../../../app/store";
import CreateComplaint from "./CreateComplaint";

const UserComplaints = () => {
  // Get userId from Redux store
  const userId = useSelector((state: RootState) => state.user.user?.userId);

  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchComplaintID, setSearchComplaintID] = useState("");
  const [searchResult, setSearchResult] = useState<TComplaint[] | null>(null);

  const [complaintToDelete, setComplaintToDelete] = useState<TComplaint | null>(null);
  const [complaintToUpdate, setComplaintToUpdate] = useState<TComplaint | null>(null);

  // Use the updated query that filters by user ID
  const { data: complaintsData, isLoading, error, refetch } =
    complaintsAPI.useGetComplaintsByUserIdQuery(userId ?? 0, {
      skip: !userId,
      refetchOnMountOrArgChange: true,
      pollingInterval: 30000, // Poll every 30 seconds
    });

  const [getByAppointmentId] = complaintsAPI.useLazyGetComplaintsByAppointmentIdQuery();
  const [getByComplaintId] = complaintsAPI.useLazyGetComplaintByIdQuery();

  // Debug: Log user ID and complaints data
  console.log("=== USER COMPLAINTS DEBUG ===");
  console.log("Current User ID:", userId);
  console.log("Complaints Data:", complaintsData);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);
  console.log("=============================");

  const handleSearch = async () => {
    setSearchResult(null);

    if (!userId) {
      toast.error("Please log in to search complaints.");
      return;
    }

    if (searchComplaintID.trim()) {
      try {
        const result = await getByComplaintId(parseInt(searchComplaintID)).unwrap();
        if (!result || result.userId !== userId) {
          toast.error("Complaint not found or does not belong to you.");
        } else {
          setSearchResult([result]);
          toast.success("Complaint found!");
        }
      } catch (err) {
        console.error("Error searching complaint by ID:", err);
        toast.error("Complaint not found.");
      }
    } else if (searchAppointmentID.trim()) {
      try {
        const result = await getByAppointmentId(parseInt(searchAppointmentID)).unwrap();
        const ownComplaints = result.complaints.filter((c) => c.userId === userId);
        if (ownComplaints.length === 0) {
          toast.error("No complaints found for this appointment.");
        } else {
          setSearchResult(ownComplaints);
          toast.success(`Found ${ownComplaints.length} complaint(s) for this appointment.`);
        }
      } catch (err) {
        console.error("Error searching complaints by appointment ID:", err);
        toast.error("No complaints found for this appointment.");
      }
    } else {
      toast.error("Enter a Complaint ID or Appointment ID to search.");
    }
  };

  const clearSearch = () => {
    setSearchResult(null);
    setSearchAppointmentID("");
    setSearchComplaintID("");
    toast.info("Search cleared.");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'open':
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'text-red-600 font-bold';
      case 'high':
        return 'text-orange-600 font-semibold';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
      default:
        return 'text-gray-600';
    }
  };

  const renderComplaintRow = (complaint: TComplaint) => (
    <tr key={complaint.complaintId} className="hover:bg-gray-100 border-b border-gray-300">
      <td className="px-4 py-3 border-r border-gray-300 font-medium">
        #{complaint.complaintId}
      </td>
      <td className="px-4 py-3 border-r border-gray-300">
        {complaint.relatedAppointmentId ? `#${complaint.relatedAppointmentId}` : "-"}
      </td>
      <td className="px-4 py-3 border-r border-gray-300 max-w-xs">
        <div className="truncate" title={complaint.subject}>
          {complaint.subject}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-gray-300 max-w-xs">
        <div className="truncate" title={complaint.description}>
          {complaint.description}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-gray-300">
        <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(complaint.status)}`}>
          {complaint.status}
        </span>
      </td>
      <td className={`px-4 py-3 border-r border-gray-300 ${getPriorityColor(complaint.priority || 'Low')}`}>
        {complaint.priority || 'Low'}
      </td>
      <td className="px-4 py-3 border-r border-gray-300 text-sm text-gray-600">
        {formatDate(complaint.createdAt)}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            className="btn btn-xs btn-info text-blue-600 hover:bg-blue-50"
            onClick={() => {
              setComplaintToUpdate(complaint);
              (document.getElementById("update_complaint_modal") as HTMLDialogElement)?.showModal();
            }}
            title="Edit complaint"
          >
            <FaEdit size={14} />
          </button>
          <button
            className="btn btn-xs btn-error text-red-600 hover:bg-red-50"
            onClick={() => {
              setComplaintToDelete(complaint);
              (document.getElementById("delete_complaint_modal") as HTMLDialogElement)?.showModal();
            }}
            title="Delete complaint"
          >
            <MdDeleteForever size={14} />
          </button>
        </div>
      </td>
    </tr>
  );

  // Show loading state for unauthenticated users
  if (!userId) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">Please log in to view your complaints.</p>
          <p className="text-sm text-gray-500">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Modals */}
      <CreateComplaint refetch={refetch} />
      <UpdateComplaint complaint={complaintToUpdate} refetch={refetch} />
      <DeleteComplaint complaint={complaintToDelete} refetch={refetch} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Complaints</h1>
        <p className="text-gray-600">Manage and track your complaints</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            className="btn bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() =>
              (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.showModal()
            }
          >
            + Create New Complaint
          </button>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={searchComplaintID}
              onChange={(e) => setSearchComplaintID(e.target.value)}
              placeholder="Search by Complaint ID"
              className="input input-bordered input-sm text-black bg-white border-gray-300"
            />
            <span className="text-gray-400">or</span>
            <input
              type="text"
              value={searchAppointmentID}
              onChange={(e) => setSearchAppointmentID(e.target.value)}
              placeholder="Search by Appointment ID"
              className="input input-bordered input-sm text-black bg-white border-gray-300"
            />
            <button 
              className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              Search
            </button>
            {searchResult && (
              <button 
                className="btn btn-sm bg-gray-500 text-white hover:bg-gray-600" 
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
            <p className="mt-4 text-gray-600">Loading your complaints...</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="alert alert-error mb-6">
          <div>
            <p className="font-semibold">Error fetching complaints</p>
            <p className="text-sm">Please check your connection and try again.</p>
          </div>
          <button className="btn btn-sm btn-outline" onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {/* Complaints Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Appointment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResult
                  ? searchResult.map(renderComplaintRow)
                  : complaintsData?.complaints?.map(renderComplaintRow)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty States */}
      {!searchResult && (!complaintsData?.complaints || complaintsData.complaints.length === 0) && !isLoading && !error && (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border">
          <div className="max-w-sm mx-auto">
            <div className="text-6xl text-gray-300 mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No complaints yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't created any complaints yet. Click the button above to create your first complaint.
            </p>
            <button
              className="btn bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() =>
                (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.showModal()
              }
            >
              Create Your First Complaint
            </button>
          </div>
        </div>
      )}
      
      {searchResult && searchResult.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
          <div className="text-4xl text-gray-300 mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
          <p className="text-gray-600">No complaints found matching your search criteria.</p>
        </div>
      )}

      {/* Statistics Card */}
      {complaintsData?.complaints && complaintsData.complaints.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {complaintsData.complaints.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {complaintsData.complaints.filter(c => c.status === 'Open').length}
              </div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {complaintsData.complaints.filter(c => c.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {complaintsData.complaints.filter(c => c.status === 'Resolved').length}
              </div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComplaints;