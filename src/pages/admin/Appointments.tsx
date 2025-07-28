// // src/pages/admin/Appointments.tsx
// import { appointmentsAPI } from "../../features/appointments/appointmentsAPI";
// import { DataTable } from "../../components/DataTable";
// import { columns } from "./AppointmentColumns";
// import { Badge } from "../../components/ui/badge";
// import AppointmentStatusFilter from "./AppointmentStatusFilter";

// export default function Appointments() {
//   const [status, setStatus] = useState<string>("all");
//   const { data: appointments, isLoading } = appointmentsAPI.useGetAppointmentsQuery(status);

//   return (
//     <div className="container mx-auto py-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Appointment Management</h1>
//         <AppointmentStatusFilter value={status} onChange={setStatus} />
//       </div>

//       {isLoading && <p>Loading appointments...</p>}
      
//       {appointments && (
//         <DataTable 
//           columns={columns}
//           data={appointments}
//           filterKey="patientName"
//         />
//       )}
//     </div>
//   );
// }