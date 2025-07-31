import { TbBrandBooking } from "react-icons/tb";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

export type DrawerData = {
    id:string;
    name:string;
    icon:React.ComponentType<{size?: number}>;
    link:string
} 
export const doctorDrawerData: DrawerData[] = [
    
     {
        id: 'appointments',
        name: 'Appointments',
        icon: TbBrandBooking ,
        link: 'appointments'
    },
   
     {
        id: 'prescriptions',
        name: 'Prescriptions',
        icon: FaPrescriptionBottleAlt,
        link: 'prescriptions'
    },
    {
        id: 'profile',
        name: 'Profile',
        icon: FaUserCheck ,
        link: 'profile'
    },
    {
        id: 'analytics',
        name: 'Analytics',
        icon: TbBrandGoogleAnalytics ,
        link: 'analytics'
    },
]