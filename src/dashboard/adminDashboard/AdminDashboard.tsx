import { Outlet } from "react-router"
import Navbar from "../../components/nav/Navbar"
import AdminDrawer from "./aside/AdminDrawer"
import Footer from "../../components/footer/Footer"
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const AdminDashboard = () => {
        const [drawerOpen, setDrawerOpen] = useState(false);
       const name = useSelector((state: RootState) =>
  state.user.user?.firstName || "Admin"
);


    const handleDrawerToggle = () => {
        setDrawerOpen((prev) => !prev);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
                <div className="flex px-4 py-4 bg-blue-800 items-center">
               
                <button
                    className="mr-4 text-white text-2xl lg:hidden"
                    onClick={handleDrawerToggle}
                >
                    {drawerOpen ? <IoCloseSharp /> : <FaBars />}
                </button>
                <span className="text-white text-lg font-semibold">
                    Welcome <span className="font-bold text-red-400 text-2xl">{name}</span> to your Admin dashboard
                </span>
            </div>
            <div className="flex flex-1">
                <aside
                     className={`
                        fixed top-0 z-40 w-64 bg-blue-600
                        ${drawerOpen ? "" : "hidden"} 
                        lg:static lg:block lg:w-64
                        `}
                    style = {{minHeight: '100vh'}}>

                    <div className="h-full">
                        {/* Close button for mobile */}
                        <button
                            className="absolute top-4 right-4 text-white text-2xl lg:hidden"
                            onClick={handleDrawerToggle}
                        >
                            <IoCloseSharp />
                        </button>
                <AdminDrawer />
                    </div>
                </aside>
                <main className="flex-1 p-4 bg-blue-300 min-h-screen">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default AdminDashboard