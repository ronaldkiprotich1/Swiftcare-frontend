import { useState, useEffect } from "react";
import ChangeRole from "./ChangeRole";
import { usersAPI, type TUser } from "../../../features/users/userAPI";
import { toast } from "sonner";

const Users = () => {
    // Fixed: useGetAllUsersQuery instead of useGetUsersQuery
    const { data: usersData, isLoading, error } = usersAPI.useGetAllUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 60000,
    });

    const [searchID, setSearchID] = useState<string>("");
    const [searchResult, setSearchResult] = useState<TUser | null>(null);

    // Fixed: useLazyGetUserByIdQuery instead of useLazyGetUserByIdQuery
    const [getUserById] = usersAPI.useLazyGetUserByIdQuery();
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

    useEffect(() => {
        console.log("Fetched usersData:", usersData);
    }, [usersData]);

    const handleSearch = async () => {
        if (!searchID.trim()) return;
        try {
            // Fixed: The API returns TUser directly, not wrapped in { user: TUser }
            const result = await getUserById(parseInt(searchID)).unwrap();
            if (!result) {
                toast.error("No user found.");
                setSearchResult(null);
            } else {
                setSearchResult(result);
            }
        } catch (err) {
            console.error("Search error:", err);
            toast.error("No user found.");
            setSearchResult(null);
        }
    };

    const renderUserRow = (user: TUser) => (
        <tr key={user.userId} className="hover:bg-gray-300 border-b border-gray-400">
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.userId}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.firstName}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.lastName}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.email}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.contactPhone}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.address}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{user.role}</td>
            <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                <span className={`badge ${user.isVerified ? "badge-success" : "badge-warning"}`}>
                    <span className={`lg:text-base ${user.isVerified ? "text-green-700" : "text-yellow-700"}`}>
                        {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                </span>
            </td>
            <td className="px-4 py-2">
                <button
                    className="btn btn-sm btn-primary text-blue-500 p-4"
                    onClick={() => {
                        setSelectedUser(user);
                        (document.getElementById("role_modal") as HTMLDialogElement)?.showModal();
                    }}
                >
                    Change Role
                </button>
            </td>
        </tr>
    );

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
                />
                <button
                    className="btn btn-sm bg-white text-black"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            {isLoading && <p>Loading users...</p>}
            {error && <p className="text-red-500">Error fetching users</p>}

            {!isLoading && (
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
            )}

            {!searchResult && usersData?.length === 0 && (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default Users;