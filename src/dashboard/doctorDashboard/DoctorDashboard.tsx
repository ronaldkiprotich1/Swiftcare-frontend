import { Outlet } from "react-router";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import DoctorDrawer from "./aside/DoctorDrawer";

const DoctorDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Get the correct property names from user state
  const user = useSelector((state: RootState) => state.user.user);
  const name = user?.firstName || "Doctor";
  const doctorId = user?.userId; // Using userId as the doctor identifier

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  // Close drawer when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const drawer = document.getElementById("doctor-drawer");
      const toggleButton = document.getElementById("drawer-toggle");
      
      if (
        drawerOpen &&
        drawer &&
        !drawer.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [drawerOpen]);

  // Close drawer on route change (mobile)
  useEffect(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 py-4 bg-indigo-700 shadow-md relative z-50">
        <button
          id="drawer-toggle"
          className="text-white text-2xl lg:hidden hover:bg-indigo-600 p-2 rounded-md transition-colors"
          onClick={handleDrawerToggle}
          aria-label="Toggle Menu"
        >
          {drawerOpen ? <IoCloseSharp /> : <FaBars />}
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-white text-lg font-semibold">
            👨‍⚕️ Hello Dr.{" "}
            <span className="font-bold text-sky-300 text-xl">{name}</span>
          </span>
          {doctorId && (
            <span className="hidden sm:inline-block bg-indigo-600 text-white px-2 py-1 rounded-full text-xs">
              ID: {doctorId}
            </span>
          )}
        </div>
        
        <div className="text-white text-sm hidden md:block">
          Welcome to your dashboard
        </div>
        
        <div className="lg:hidden w-6" /> {/* Balance layout on mobile */}
      </div>

      {/* Overlay for mobile */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Body layout */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          id="doctor-drawer"
          className={`
            fixed lg:static top-0 left-0 z-40 w-64 bg-indigo-600 text-white h-full
            transform transition-transform duration-300 ease-in-out
            ${drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          style={{ minHeight: "100vh" }}
        >
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-indigo-500">
            <span className="font-semibold">Menu</span>
            <button
              className="text-white text-xl hover:bg-indigo-500 p-1 rounded"
              onClick={handleDrawerToggle}
              aria-label="Close Menu"
            >
              <IoCloseSharp />
            </button>
          </div>
          
          <DoctorDrawer />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;