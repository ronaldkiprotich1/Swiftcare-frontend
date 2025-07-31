import { Link } from "react-router-dom";
import { userDrawerData } from "./drawerData";

const UserDrawer = () => {
  return (
    <div className="h-full">
      <h2 className="text-xl font-bold text-white p-4 border-b border-slate-600">
        Dashboard Menu
      </h2>
      <ul>
        {userDrawerData.map((item) => (
          <li key={item.id}>
            <Link
              to={item.link}
              className="flex items-center space-x-4 p-4 text-slate-100 hover:bg-slate-700 transition duration-200"
            >
              <item.icon size={24} />
              <span className="text-lg">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDrawer;
