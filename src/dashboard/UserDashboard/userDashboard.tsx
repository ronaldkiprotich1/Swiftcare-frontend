import { Outlet } from "react-router";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import UserDrawer from "./aside/UserDrawer";

const UserDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const name = useSelector(
    (state: RootState) => state.user.user?.firstName || "User"
  );

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 py-4 bg-indigo-700 shadow-md">
        <button
          className="text-white text-2xl lg:hidden"
          onClick={handleDrawerToggle}
          aria-label="Toggle Menu"
        >
          {drawerOpen ? <IoCloseSharp className="text-white" /> : <FaBars className="text-white" />}
        </button>

        <span className="text-white text-lg font-semibold">
          🙋 Hello{" "}
          <span className="font-bold text-yellow-300 text-xl">{name}</span>, welcome to your dashboard
        </span>

        <div className="lg:hidden w-6" /> {/* Spacer */}
      </div>

      {/* Body layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 z-40 w-64 bg-indigo-800 text-white 
            ${drawerOpen ? "block" : "hidden"}
            lg:static lg:block
          `}
          style={{ minHeight: "100vh" }}
        >
          {/* Close button for mobile */}
          <button
            className="absolute top-4 right-4 text-white text-2xl lg:hidden"
            onClick={handleDrawerToggle}
            aria-label="Close Menu"
          >
            <IoCloseSharp />
          </button>
          <UserDrawer />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-slate-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
