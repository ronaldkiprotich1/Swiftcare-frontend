import {
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  UserCheck,
  Users,
} from "lucide-react";

export type DrawerData = {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
};

export const userDrawerData: DrawerData[] = [
  // {
  //   id: "dashboard",
  //   name: "Dashboard",
  //   icon: LayoutDashboard,
  //   link: "", // This will match the index route of the user dashboard
  // },
  {
    id: "appointments",
    name: "Appointments",
    icon: CalendarCheck,
    link: "appointments",
  },
  
  {
    id: "prescriptions",
    name: "Prescriptions",
    icon: ClipboardList,
    link: "prescriptions",
  },
  {
    id: "complaints",
    name: "Complaints",
    icon: MessageSquare,
    link: "complaints",
  },
  {
    id: "doctors",
    name: "Doctors",
    icon: Users,
    link: "doctors",
  },
  {
    id: "profile",
    name: "Profile",
    icon: UserCheck,
    link: "profile",
  },
];
