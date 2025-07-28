import { TbBrandBooking } from "react-icons/tb";
import { MdPayments } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa6";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string
}
export const adminDrawerData: DrawerData[] = [

    {
        id: 'appointments',
        name: 'Appointments',
        icon: TbBrandBooking,
        link: 'appointments'
    },
    {
        id: 'payments',
        name: 'Payments',
        icon: MdPayments,
        link: 'payments'
    },

    {
        id: 'prescriptions',
        name: 'Prescriptions',
        icon: FaPrescriptionBottleAlt,
        link: 'prescriptions'
    },
    {
        id: 'complaints',
        name: 'Complaints',
        icon: FaEnvelopeOpenText,
        link: 'complaints'
    },
    {
        id: 'doctors',
        name: 'Doctors',
        icon: FiUsers,
        link: 'doctors'
    },

    {
        id: 'users',
        name: 'Users',
        icon: FiUsers,
        link: 'users'
    },
    {
        id: 'profile',
        name: 'Profile',
        icon: FaUserCheck,
        link: 'profile'
    },
    {
        id: 'analytics',
        name: 'Analytics',
        icon: TbBrandGoogleAnalytics,
        link: 'analytics'
    },
]