import { useState, useEffect } from "react";
import ChangeRole from "./ChangeRole";
import { useGetAllUsersQuery, useLazyGetUserByIdQuery, type TUser } from "../../../features/users/userAPI";
import { toast } from "sonner";

const Users = () => {
    const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 60000,
    });

    const [searchID, setSearchID] = useState<string>("");
    const [searchResult, setSearchResult] = useState<TUser | null>(null);
    const [getUserById, { isLoading: isSearchLoading }] = useLazyGetUserByIdQuery();
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

    useEffect(() => {
        console.log("Fetched usersData:", usersData);
        console.log("Loading state:", isLoading);
        console.log("Error state:", error);
    }, [usersData, isLoading, error]);

    useEffect(() => {
        console.log("👤 Selected user changed:", selectedUser);
    }, [selectedUser]);

    const handleSearch = async () => {
        if (!searchID.trim()) {
            toast.error("Please enter a User ID");
            return;
        }

        const userId = parseInt(searchID);
        if (isNaN(userId)) {
            toast.error("Please enter a valid User ID");
            return;
        }

        try {
            const result = await getUserById(userId).unwrap();
            if (!result) {
                toast.error("No user found.");
                setSearchResult(null);
            } else {
                setSearchResult(result);
                toast.success("User found!");
            }
        } catch (err: any) {
            console.error("Search error:", err);
            toast.error("No user found with that ID.");
            setSearchResult(null);
        }
    };

    const clearSearch = () => {
        setSearchID("");
        setSearchResult(null);
    };

    const getRoleBadgeStyles = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-50 text-red-700 border border-red-200';
            case 'doctor':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            default:
                return 'bg-green-50 text-green-700 border border-green-200';
        }
    };

    const renderUserRow = (user: TUser) => (
        <tr key={user.userId} className="group hover:bg-gray-50 transition-colors border-b border-gray-100">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.userId}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{user.firstName}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{user.lastName}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
            <td className="px-6 py-4 text-sm text-gray-700">{user.contactPhone}</td>
            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{user.address}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyles(user.role)}`}>
                    {user.role.toUpperCase()}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${user.isVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <span className={`text-xs font-medium ${user.isVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                        {user.isVerified ? "Verified" : "Pending"}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4">
                <button
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Change Role button clicked for user:', user);
                        
                        setSelectedUser(user);
                        
                        setTimeout(() => {
                            const modal = document.getElementById("role_modal") as HTMLDialogElement;
                            if (modal) {
                                modal.showModal();
                            }
                        }, 100);
                    }}
                >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Role
                </button>
            </td>
        </tr>
    );

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        console.error("Users API Error:", error);
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Error Loading Users</h3>
                        <p className="text-gray-600 mb-4">
                            {error && typeof error === 'object' && 'status' in error 
                                ? `Server returned status ${error.status}` 
                                : 'Unable to connect to the server'}
                        </p>
                    </div>
                    <button 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => refetch()}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ChangeRole user={selectedUser} />

            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-1">
                            {searchResult ? '1 user found' : `${usersData?.length || 0} total users`}
                        </p>
                    </div>
                    
                    {/* Search Section */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchID}
                                onChange={(e) => setSearchID(e.target.value)}
                                placeholder="Search by User ID"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSearch}
                            disabled={isSearchLoading}
                        >
                            {isSearchLoading ? "Searching..." : "Search"}
                        </button>
                        {searchResult && (
                            <button
                                className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                onClick={clearSearch}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {searchResult
                                ? renderUserRow(searchResult)
                                : usersData?.map(renderUserRow)
                            }
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {!searchResult && (!usersData || usersData.length === 0) && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500">There are no users to display at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;