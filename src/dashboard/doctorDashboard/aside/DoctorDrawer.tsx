import { Link } from "react-router-dom";
import { doctorDrawerData } from "./drawerData";

const DoctorDrawer = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-semibold text-white px-4 py-6 border-b border-gray-700">
        👨‍⚕️ Welcome back, Doctor!
      </h2>
      <ul>
        {doctorDrawerData.map((item) => (
          <li key={item.id}>
            <Link
              to={item.link}
              className="flex items-center space-x-3 px-5 py-4 hover:bg-blue-600 hover:text-white transition-colors duration-200 text-gray-300"
            >
              <item.icon size={22} />
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDrawer;
