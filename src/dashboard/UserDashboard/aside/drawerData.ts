import { TbBrandBooking } from "react-icons/tb";
import { MdPayments } from "react-icons/md";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";

export type DrawerData = {
    id:string;
    name:string;
    icon:React.ComponentType<{size?: number}>;
    link:string
} 
export const userDrawerData: DrawerData[] = [
    
     {
        id: 'appointments',
        name: 'Appointments',
        icon: TbBrandBooking ,
        link: 'appointments'
    },
     {
        id: 'payments',
        name: 'Payments',
        icon: MdPayments ,
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
        icon:  FaEnvelopeOpenText,
        link: 'complaints'
    },
      {
            id: 'doctors',
            name: 'Doctors',
            icon: FiUsers,
            link: 'doctors'
        },
    {
        id: 'profile',
        name: 'Profile',
        icon: FaUserCheck ,
        link: 'profile'
    },
]