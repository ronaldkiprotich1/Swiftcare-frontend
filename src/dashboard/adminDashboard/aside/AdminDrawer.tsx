import { Link } from "react-router-dom"; // Updated import
import { adminDrawerData } from "./drawerData";

const AdminDrawer = () => {
    return (
        <div className="bg-gray-800 h-full flex flex-col">
            {/* Header with improved styling */}
            <h2 className="text-2xl font-bold text-white p-6 border-b border-gray-600 bg-gray-700/50">
                Dashboard Menu
            </h2>
            
            {/* Menu items with better spacing and hover effects */}
            <ul className="flex-1 overflow-y-auto py-2">
                {adminDrawerData.map((item) => {
                    const IconComponent = item.icon; // Create component variable
                    return (
                        <li key={item.id} className="px-3 py-1">
                            <Link
                                to={item.link}
                                className="flex items-center gap-4 p-4 rounded-lg text-gray-200 hover:bg-indigo-500/20 hover:text-white transition-all duration-300 group"
                            >
                                <div className="text-indigo-300 group-hover:text-indigo-100 transition-colors">
                                    <IconComponent size={24} />
                                </div>
                                <span className="text-lg font-medium">{item.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Optional footer */}
            <div className="p-4 border-t border-gray-700 text-gray-400 text-sm">
                Admin Panel v1.0
            </div>
        </div>
    );
};

export default AdminDrawer;