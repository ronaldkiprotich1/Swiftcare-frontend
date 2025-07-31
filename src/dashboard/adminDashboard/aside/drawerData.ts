import { FiUsers,  FiCalendar } from "react-icons/fi";
import {
  FaUserMd,
  FaUserCog,
  FaChartLine,
} from "react-icons/fa";
import { MdOutlineDashboard, MdFeedback } from "react-icons/md";

export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    link: string;
}

export const adminDrawerData: DrawerData[] = [
    // {
    //     id: "dashboard",
    //     name: "Dashboard",
    //     icon: MdOutlineDashboard,
    //     link: "dashboard"
    // },
    {
        id: "users",
        name: "Users",
        icon: FiUsers,
        link: "users"
    },
    {
        id: "doctors",
        name: "Doctors",
        icon: FaUserMd,
        link: "doctors"
    },
    // {
    //     id: "appointments",
    //     name: "Appointments",
    //     icon: FiCalendar,
    //     link: "appointments"
    // },
    
    
    {
        id: "complaints",
        name: " Feedback",
        icon: MdFeedback,
        link: "complaints"
    },
    {
        id: "analytics",
        name: "Analytics",
        icon: FaChartLine,
        link: "analytics"
    },
    {
        id: "profile",
        name: "Profile ",
        icon: FaUserCog,
        link: "profile"
    },
    
];