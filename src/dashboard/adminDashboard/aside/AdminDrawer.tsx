import { Link } from "react-router-dom"
import { adminDrawerData } from "./drawerData"
import { IoClose } from "react-icons/io5"

interface AdminDrawerProps {
    onClose?: () => void;
    isOpen?: boolean;
}

const AdminDrawer = ({ onClose, isOpen = true }: AdminDrawerProps) => {
    return (
        <>
            {/* Mobile/Tablet Drawer - Fixed positioning */}
            <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Header with close button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-600/50 bg-gray-700/70 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white">
                        Dashboard Menu
                    </h2>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-600/50 transition-colors duration-200 group"
                            aria-label="Close menu"
                        >
                            <IoClose
                                size={24}
                                className="text-gray-300 group-hover:text-white transition-colors duration-200"
                            />
                        </button>
                    )}
                </div>
               
                {/* Navigation items */}
                <div className="overflow-y-auto h-full pb-20">
                    <ul className="py-2">
                        {adminDrawerData.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.link}
                                    onClick={onClose}
                                    className="group flex items-center space-x-4 px-6 py-4 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 border-l-4 border-transparent hover:border-blue-400 transition-all duration-300 ease-in-out transform hover:translate-x-1"
                                >
                                    <div className="flex-shrink-0 p-2 rounded-lg bg-gray-600/40 group-hover:bg-blue-500/30 transition-all duration-300">
                                        <item.icon
                                            size={24}
                                            className="text-gray-400 group-hover:text-blue-300 transition-colors duration-300"
                                        />
                                    </div>
                                    <span className="text-lg font-medium group-hover:font-semibold transition-all duration-300">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
               
                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none"></div>
            </aside>

            {/* Desktop Sidebar - Static positioning */}
            <aside className="hidden lg:block w-80 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 shadow-2xl h-screen sticky top-0">
                {/* Header without close button for desktop */}
                <div className="flex items-center justify-between p-4 border-b border-gray-600/50 bg-gray-700/70 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white">
                        Dashboard Menu
                    </h2>
                </div>
               
                {/* Navigation items */}
                <div className="overflow-y-auto h-full pb-20">
                    <ul className="py-2">
                        {adminDrawerData.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.link}
                                    className="group flex items-center space-x-4 px-6 py-4 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 border-l-4 border-transparent hover:border-blue-400 transition-all duration-300 ease-in-out transform hover:translate-x-1"
                                >
                                    <div className="flex-shrink-0 p-2 rounded-lg bg-gray-600/40 group-hover:bg-blue-500/30 transition-all duration-300">
                                        <item.icon
                                            size={24}
                                            className="text-gray-400 group-hover:text-blue-300 transition-colors duration-300"
                                        />
                                    </div>
                                    <span className="text-lg font-medium group-hover:font-semibold transition-all duration-300">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
               
                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none"></div>
            </aside>
        </>
    )
}

export default AdminDrawer