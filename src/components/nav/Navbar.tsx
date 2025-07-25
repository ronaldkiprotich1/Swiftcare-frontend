import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

const Navbar = () => {
  return (
    <div className="navbar bg-white px-4 shadow-md sticky top-0 z-50 relative h-16">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="text-xl font-bold text-blue-600 flex items-center gap-1"
        >
          <Stethoscope className="w-5 h-5" />
          SwiftCare
        </Link>
      </div>

      {/* Centered Nav Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-6 text-base font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li>
            <Link to="/appointment" className="hover:text-blue-600">Appointment</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600">About</Link>
          </li>
          <li>
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          </li>
        </ul>
      </div>

      {/* Auth Buttons */}
      <div className="flex-none flex gap-2">
        <Link
          to="/login"
          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-1.5 rounded-full transition duration-200 text-sm"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-1.5 rounded-full transition duration-200 text-sm"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
