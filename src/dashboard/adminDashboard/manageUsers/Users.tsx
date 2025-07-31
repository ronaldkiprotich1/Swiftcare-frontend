import { useState, useEffect } from "react";
import ChangeRole from "./ChangeRole";
import { useGetAllUsersQuery, useLazyGetUserByIdQuery, type TUser } from "../../../features/users/userAPI";
import { toast } from "sonner";

const Users = () => {
    // Fixed: Use the exported hook directly, not from usersAPI object
    const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 60000,
    });

    const [searchID, setSearchID] = useState<string>("");
    const [searchResult, setSearchResult] = useState<TUser | null>(null);

    // Fixed: Use the exported hook directly
    const [getUserById, { isLoading: isSearchLoading }] = useLazyGetUserByIdQuery();
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

    useEffect(() => {
        console.log("Fetched usersData:", usersData);
        console.log("Loading state:", isLoading);
        console.log("Error state:", error);
    }, [usersData, isLoading, error]);

    // Debug selectedUser changes
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

    const renderUserRow = (user: TUser) => (
        <tr key={user.userId} className="hover:bg-gray-300 border-b border-gray-400">
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.userId}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.firstName}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.lastName}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.email}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.contactPhone}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.address}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                    user.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                }`}>
                    {user.role.toUpperCase()}
                </span>
            </td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                <span className={`badge ${user.isVerified ? "badge-success" : "badge-warning"}`}>
                    <span className={`lg:text-base ${user.isVerified ? "text-green-700" : "text-yellow-700"}`}>
                        {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                </span>
            </td>
            <td className="px-4 py-2">
                <button
                    className="btn btn-sm btn-primary hover:btn-primary-focus"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Change Role button clicked for user:', user);
                        console.log('🔍 User details:', {
                            userId: user.userId,
                            name: `${user.firstName} ${user.lastName}`,
                            currentRole: user.role,
                            email: user.email
                        });
                        
                        setSelectedUser(user);
                        
                        // Wait a bit for state to update, then open modal
                        setTimeout(() => {
                            const modal = document.getElementById("role_modal") as HTMLDialogElement;
                            console.log('📱 Modal element found:', !!modal);
                            console.log('📱 Selected user set to:', selectedUser?.userId || 'still null');
                            
                            if (modal) {
                                modal.showModal();
                                console.log('📱 Modal.showModal() called');
                            } else {
                                console.error('❌ Modal element not found!');
                            }
                        }, 100);
                    }}
                >
                    Change Role
                </button>
            </td>
        </tr>
    );

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="loading loading-spinner loading-lg"></div>
                <span className="ml-2">Loading users...</span>
            </div>
        );
    }

    // Show error state with retry option
    if (error) {
        console.error("Users API Error:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                <p className="text-red-500 text-lg">Error fetching users</p>
                <p className="text-gray-600">
                    {error && typeof error === 'object' && 'status' in error 
                        ? `Status: ${error.status}` 
                        : 'Network error'}
                </p>
                <button 
                    className="btn btn-primary"
                    onClick={() => refetch()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <ChangeRole user={selectedUser} />

            {/* Search bar */}
            <div className="flex justify-center mb-4 mt-2 gap-2">
                <input
                    type="text"
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                    placeholder="Search by User ID"
                    className="input input-bordered input-sm text-black bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    className="btn btn-sm bg-white text-black"
                    onClick={handleSearch}
                    disabled={isSearchLoading}
                >
                    {isSearchLoading ? "Searching..." : "Search"}
                </button>
                {searchResult && (
                    <button
                        className="btn btn-sm bg-gray-200 text-black"
                        onClick={clearSearch}
                    >
                        Show All
                    </button>
                )}
            </div>

            {/* Users table */}
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr className="bg-gray-600 text-white text-md lg:text-lg">
                            <th className="px-4 py-2">User ID</th>
                            <th className="px-4 py-2">First Name</th>
                            <th className="px-4 py-2">Last Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone Number</th>
                            <th className="px-4 py-2">Address</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Verified</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResult
                            ? renderUserRow(searchResult)
                            : usersData?.map(renderUserRow)
                        }
                    </tbody>
                </table>
            </div>

            {/* No data message */}
            {!searchResult && (!usersData || usersData.length === 0) && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No users found.</p>
                </div>
            )}
        </div>
    );
};

export default Users;