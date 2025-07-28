import { Link } from "react-router-dom"
import { adminDrawerData } from "./drawerData"
import { IoClose } from "react-icons/io5"

interface AdminDrawerProps {
    onClose?: () => void;
    isOpen?: boolean;
}

const AdminDrawer = ({ onClose, isOpen = true }: AdminDrawerProps) => {
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white">
                    Dashboard Menu
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-700/50 transition-colors duration-200 group"
                        aria-label="Close menu"
                    >
                        <IoClose 
                            size={24} 
                            className="text-slate-300 group-hover:text-white transition-colors duration-200" 
                        />
                    </button>
                )}
            </div>

            {/* Navigation items */}
            <div className="overflow-y-auto h-full pb-20">
                <ul className="py-2">
                    {adminDrawerData.map((item, index) => (
                        <li key={item.id}>
                            <Link
                                to={item.link}
                                onClick={onClose}
                                className="group flex items-center space-x-4 px-6 py-4 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 border-l-4 border-transparent hover:border-blue-400 transition-all duration-300 ease-in-out transform hover:translate-x-1"
                            >
                                <div className="flex-shrink-0 p-2 rounded-lg bg-slate-700/30 group-hover:bg-blue-500/20 transition-all duration-300">
                                    <item.icon 
                                        size={24} 
                                        className="text-slate-400 group-hover:text-blue-300 transition-colors duration-300"
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
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
        </aside>
    )
}

export default AdminDrawer