import { FiUsers, FiPieChart, FiSettings, FiCalendar } from "react-icons/fi";
import {
  FaUserMd,
  FaClinicMedical,
  FaRegComments,
  FaUserCog,
  FaChartLine,
  FaFileMedicalAlt
} from "react-icons/fa";
import { MdOutlineDashboard, MdFeedback } from "react-icons/md";

export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    link: string;
}

export const adminDrawerData: DrawerData[] = [
    {
        id: "dashboard",
        name: "Dashboard",
        icon: MdOutlineDashboard,
        link: "dashboard"
    },
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
    {
        id: "appointments",
        name: "Appointments",
        icon: FiCalendar,
        link: "appointments"
    },
    {
        id: "medical-records",
        name: "Medical Records",
        icon: FaFileMedicalAlt,
        link: "medical-records"
    },
    {
        id: "departments",
        name: "Departments",
        icon: FaClinicMedical,
        link: "departments"
    },
    {
        id: "complaints",
        name: "Patient Feedback",
        icon: MdFeedback,
        link: "feedback"
    },
    {
        id: "analytics",
        name: "Analytics",
        icon: FaChartLine,
        link: "analytics"
    },
    {
        id: "profile",
        name: "Profile Settings",
        icon: FaUserCog,
        link: "profile"
    },
    {
        id: "system-settings",
        name: "System Settings",
        icon: FiSettings,
        link: "settings"
    }
];