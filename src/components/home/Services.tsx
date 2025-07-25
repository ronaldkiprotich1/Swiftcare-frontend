// src/components/home/Services.tsx
import { Calendar, FileText, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: <Calendar className="w-8 h-8 text-blue-600" />,
    title: "Online Appointments",
    description: "Book appointments with top doctors instantly from the comfort of your home.",
  },
  {
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    title: "Digital Prescriptions",
    description: "Receive and track prescriptions securely through your profile.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    title: "Secure & Private",
    description: "We prioritize patient data security and privacy across the platform.",
  },
];

const Services = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <div
          key={i}
          className="card bg-white p-6 shadow-md border border-gray-100 rounded-lg"
        >
          <div className="mb-4">{s.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
          <p className="text-gray-600">{s.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Services;
