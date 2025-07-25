import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { useGetComplaintsQuery } from "../../../../features/complaints/complaintsAPI";
import { MessageSquare, Calendar, Plus, XCircle, AlertCircle, Clock, CheckCircle } from "lucide-react";
import CreateComplaint from "./CreateComplaint";

const PatientComplaints = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id;

    // Use the correct query hook from your API
    const { data: complaintsData, isLoading, error, refetch } = useGetComplaintsQuery();

    // Filter complaints by userId on the client side
    const userComplaints = complaintsData?.filter(complaint => complaint.userId === userId) || [];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'resolved':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <Clock className="h-3 w-3" />;
            case 'resolved':
                return <CheckCircle className="h-3 w-3" />;
            default:
                return <AlertCircle className="h-3 w-3" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-700 text-lg font-semibold">Error fetching complaints</p>
                <p className="text-red-600 mt-2">Please try again later</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="h-7 w-7 text-teal-600" />
                            My Complaints
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Submit and track your feedback - {userComplaints.length} total complaints
                        </p>
                    </div>
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
                        onClick={() => (document.getElementById('create_complaint_modal') as HTMLDialogElement)?.showModal()}
                    >
                        <Plus className="h-5 w-5" />
                        Submit New Complaint
                    </button>
                </div>
            </div>

            {/* Modal */}
            <CreateComplaint refetch={refetch} />

            {/* Complaints Grid */}
            {userComplaints.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {userComplaints.map((complaint) => (
                        <div
                            key={complaint.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                        >
                            {/* Complaint Header */}
                            <div className="bg-gradient-to-r from-teal-50 to-pink-50 p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Complaint #{complaint.id}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4 text-teal-600" />
                                            <span className="text-sm text-gray-600">
                                                {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                                        {getStatusIcon(complaint.status)}
                                        {complaint.status}
                                    </span>
                                </div>
                            </div>

                            {/* Complaint Details */}
                            <div className="p-6">
                                {/* Subject */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-teal-600" />
                                        Subject
                                    </h4>
                                    <p className="font-medium text-gray-900 bg-gray-50 rounded-lg p-3">
                                        {complaint.subject}
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Message</h4>
                                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
                                        {complaint.message}
                                    </p>
                                </div>

                                {/* Status Message */}
                                <div className={`p-3 rounded-lg text-center ${
                                    complaint.status.toLowerCase() === 'resolved' ? 'bg-green-50 border border-green-200' :
                                    complaint.status.toLowerCase() === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
                                    'bg-gray-50 border border-gray-200'
                                }`}>
                                    <p className={`text-sm font-medium ${
                                        complaint.status.toLowerCase() === 'resolved' ? 'text-green-800' :
                                        complaint.status.toLowerCase() === 'pending' ? 'text-yellow-800' :
                                        'text-gray-800'
                                    }`}>
                                        {complaint.status.toLowerCase() === 'pending' && 'Your complaint has been received and is being reviewed'}
                                        {complaint.status.toLowerCase() === 'resolved' && 'Your complaint has been resolved'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No complaints submitted</h3>
                    <p className="text-gray-600 mb-6">Have feedback or concerns? Submit your first complaint</p>
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
                        onClick={() => (document.getElementById('create_complaint_modal') as HTMLDialogElement)?.showModal()}
                    >
                        <Plus className="h-5 w-5" />
                        Submit Your First Complaint
                    </button>
                </div>
            )}

            {/* Summary Stats */}
            {userComplaints.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-teal-50 rounded-lg">
                            <div className="text-2xl font-bold text-teal-600">
                                {userComplaints.length}
                            </div>
                            <div className="text-sm text-gray-600">Total Complaints</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                                {userComplaints.filter(complaint => complaint.status.toLowerCase() === 'pending').length}
                            </div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {userComplaints.filter(complaint => complaint.status.toLowerCase() === 'resolved').length}
                            </div>
                            <div className="text-sm text-gray-600">Resolved</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientComplaints;