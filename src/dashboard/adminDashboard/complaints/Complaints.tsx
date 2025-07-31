import { useState } from "react";
import { toast } from "sonner";

// Mock types and API for demonstration
interface TComplaint {
  complaintId: number;
  userId: number;
  relatedAppointmentId?: number;
  subject: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

// Mock data
const mockComplaints: TComplaint[] = [
  {
    complaintId: 1,
    userId: 101,
    relatedAppointmentId: 501,
    subject: "Long waiting time for appointment",
    description: "I had to wait over 2 hours for my scheduled appointment.",
    status: "Open",
    createdAt: "2024-07-30T10:30:00Z",
    priority: "High"
  },
  {
    complaintId: 2,
    userId: 102,
    subject: "Billing discrepancy in payment",
    status: "In Progress",
    createdAt: "2024-07-29T14:15:00Z",
    priority: "Medium"
  },
  {
    complaintId: 3,
    userId: 103,
    relatedAppointmentId: 503,
    subject: "Doctor arrived late to consultation",
    status: "Resolved",
    createdAt: "2024-07-28T09:00:00Z",
    priority: "Low"
  },
  {
    complaintId: 4,
    userId: 104,
    subject: "Prescription medication not available",
    status: "Closed",
    createdAt: "2024-07-27T16:45:00Z",
    priority: "Critical"
  }
];

const Complaints = () => {
  const [searchUserID, setSearchUserID] = useState("");
  const [searchAppointmentID, setSearchAppointmentID] = useState("");
  const [searchResult, setSearchResult] = useState<TComplaint[] | null>(null);
  const [complaintToDelete, setComplaintToDelete] = useState<TComplaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<TComplaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const complaintsData = { complaints: mockComplaints };

  const handleSearch = async () => {
    if (!searchUserID.trim() && !searchAppointmentID.trim()) {
      toast.error("Enter a User ID or Appointment ID to search.");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filtered = mockComplaints.filter(complaint => 
        (searchUserID.trim() && complaint.userId === parseInt(searchUserID)) ||
        (searchAppointmentID.trim() && complaint.relatedAppointmentId === parseInt(searchAppointmentID))
      );

      if (filtered.length === 0) {
        toast.error("No complaints found for the search criteria.");
        setSearchResult([]);
      } else {
        setSearchResult(filtered);
        toast.success(`Found ${filtered.length} complaint(s)`);
      }
      setIsLoading(false);
    }, 800);
  };

  const handleStatusChange = async (complaintId: number, newStatus: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Complaint #${complaintId} marked as ${newStatus}`);
      setIsLoading(false);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchUserID("");
    setSearchAppointmentID("");
    setSearchResult(null);
    setStatusFilter('all');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Closed': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return '📝';
      case 'In Progress': return '⏳';
      case 'Resolved': return '✅';
      case 'Closed': return '🔒';
      default: return '❓';
    }
  };

  const displayedComplaints = searchResult || complaintsData?.complaints || [];
  const filteredComplaints = statusFilter === 'all' 
    ? displayedComplaints 
    : displayedComplaints.filter(c => c.status === statusFilter);

  const statusCounts = {
    all: displayedComplaints.length,
    Open: displayedComplaints.filter(c => c.status === 'Open').length,
    'In Progress': displayedComplaints.filter(c => c.status === 'In Progress').length,
    Resolved: displayedComplaints.filter(c => c.status === 'Resolved').length,
    Closed: displayedComplaints.filter(c => c.status === 'Closed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">📋 Complaints Management</h1>
                <p className="text-blue-100">Track and resolve customer complaints efficiently</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{displayedComplaints.length}</div>
                <div className="text-blue-100 text-sm">Total Complaints</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter by Status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status !== 'all' && getStatusIcon(status)}
                {status === 'all' ? 'All' : status}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  statusFilter === status ? 'bg-white/20' : 'bg-gray-300 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Search Complaints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="number"
                value={searchUserID}
                onChange={(e) => {
                  setSearchUserID(e.target.value);
                  if (e.target.value) setSearchAppointmentID("");
                }}
                placeholder="Search by User ID"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V7a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h4V7z" />
                </svg>
              </div>
              <input
                type="number"
                value={searchAppointmentID}
                onChange={(e) => {
                  setSearchAppointmentID(e.target.value);
                  if (e.target.value) setSearchUserID("");
                }}
                placeholder="Search by Appointment ID"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={(!searchUserID.trim() && !searchAppointmentID.trim()) || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                'Search'
              )}
            </button>
            
            <button
              onClick={handleClearSearch}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {filteredComplaints.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {searchResult ? 'Search Results' : 'All Complaints'}
                </h3>
                <p className="text-gray-600">
                  Showing {filteredComplaints.length} of {displayedComplaints.length} complaint(s)
                </p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg">
                📊 Export Data
              </button>
            </div>
          </div>
        )}

        {/* Complaints Grid */}
        <div className="grid gap-6">
          {filteredComplaints.map((complaint) => (
            <div 
              key={complaint.complaintId} 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      #{complaint.complaintId}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{complaint.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👤 User ID: {complaint.userId}</span>
                        {complaint.relatedAppointmentId && (
                          <span>📅 Appointment: {complaint.relatedAppointmentId}</span>
                        )}
                        <span>📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority} Priority
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)} {complaint.status}
                    </span>
                  </div>
                </div>

                {complaint.description && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700 text-sm">{complaint.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(complaint.complaintId, status)}
                      disabled={complaint.status === status || isLoading}
                      className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                        complaint.status === status
                          ? `${getStatusColor(status)} cursor-not-allowed opacity-75`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {getStatusIcon(status)} {status}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    👁️ View Details
                  </button>
                  
                  <button
                    onClick={() => setComplaintToDelete(complaint)}
                    className="px-4 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredComplaints.length === 0 && !isLoading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600 mb-6">
              {searchResult !== null 
                ? "No complaints match your search criteria." 
                : "There are no complaints in the system."}
            </p>
            {searchResult !== null && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Complaint Details</h2>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Complaint ID</label>
                    <p className="text-lg font-semibold">#{selectedComplaint.complaintId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">User ID</label>
                    <p className="text-lg font-semibold">{selectedComplaint.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusIcon(selectedComplaint.status)} {selectedComplaint.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Subject</label>
                  <p className="text-gray-900 mt-1">{selectedComplaint.subject}</p>
                </div>
                {selectedComplaint.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-900 mt-1">{selectedComplaint.description}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Created Date</label>
                  <p className="text-gray-900 mt-1">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;