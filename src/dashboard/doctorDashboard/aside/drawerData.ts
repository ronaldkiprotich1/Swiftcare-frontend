import { FaCalendarAlt, FaPrescription, FaUserCheck, FaUsers } from "react-icons/fa";

export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const doctorDrawerData: DrawerData[] = [
    {
        id: "appointments",
        name: "Appointments",
        icon: FaCalendarAlt,
        link: "appointments"
    },
    {
        id: "patients",
        name: "Patients",
        icon: FaUsers,
        link: "patients"
    },
    {
        id: "prescriptions",
        name: "Prescriptions",
        icon: FaPrescription,
        link: "prescriptions"
    },
    {
        id: "profile",
        name: "Profile",
        icon: FaUserCheck,
        link: "profile"
    }
]