import { Outlet } from "react-router";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import AdminDrawer from "./aside/AdminDrawer";

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const name = useSelector(
    (state: RootState) => state.user.user?.firstName || "Admin"
  );

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 bg-indigo-700 shadow-md">
        <button
          className="mr-4 text-white text-2xl lg:hidden"
          onClick={handleDrawerToggle}
        >
          {drawerOpen ? <IoCloseSharp /> : <FaBars />}
        </button>
        <span className="text-white text-lg font-medium">
          👋 Hello <span className="font-bold text-sky-300 text-xl">{name}</span>, manage your hospital system with ease!
        </span>
      </div>

      <div className="flex flex-1">
        {/* Sidebar Component */}
        <AdminDrawer 
          onClose={() => setDrawerOpen(false)} 
          isOpen={drawerOpen} 
        />

        {/* Mobile Overlay */}
        {drawerOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 bg-slate-100 min-h-screen overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;