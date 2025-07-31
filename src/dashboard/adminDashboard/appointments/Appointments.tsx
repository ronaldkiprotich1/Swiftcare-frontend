// import { useState } from "react";
// // import { appointmentsAPI, type TAppointment } from "../../../features/appointmentAPI";
// import UpdateAppointments from "./UpdateAppointment";
// import DeleteAppointments from "./DeleteAppointment";
// import { FaEdit } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import { appointmentsAPI } from "../../../features/appointments/appointmentsAPI";

// const Appointments = () => {
//     const {
//         data: appointmentsData,
//         isLoading: appointmentsLoading,
//         error: appointmentsError,
//     } = appointmentsAPI.useGetAppointmentsQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 60000 });

//     console.log(appointmentsData);
//     const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null);
//     const [appointmentToDelete, setAppointmentToDelete] = useState<TAppointment | null>(null);

//     const handleEdit = (appointment: TAppointment) => {
//         setSelectedAppointment(appointment);
//         (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
//     };

//     return (
//         <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
//           Appointments List
//         </h2>
//       </div>
//       <UpdateAppointments appointment={selectedAppointment} />
//       <DeleteAppointments appointment={selectedAppointment} />
//       {appointmentsLoading && <p className="text-gray-600">Loading appointments...</p>}
//       {appointmentsError && <p className="text-red-600">Error loading appointments</p>}
//       {Array.isArray(appointmentsData) && appointmentsData.length > 0 ? (
//         <div className="overflow-x-auto rounded-lg border border-gray-200">
//           <table className="min-w-full text-sm text-gray-800">
//             <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
//               <tr>
//                 <th className="px-4 py-4 text-left">First Name</th>
//                 <th className="px-4 py-4 text-left">Last Name</th>
//                 <th className="px-4 py-4 text-left">Email</th>
//                 <th className="px-4 py-4 text-left">Phone</th>
//                 <th className="px-4 py-4 text-left">Specialization</th>
//                 <th className="px-4 py-4 text-left">Available Days</th>
//                 <th className="px-4 py-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {appointmentsData.map((appointment: TAppointment) => (
//                 <tr key={appointment.appointmentId} className="hover:bg-gray-50 transition">
//                   <td className="px-4 py-3">{appointment.doctorId}</td>
//                   <td className="px-4 py-3">{appointment.userId}</td>
//                   <td className="px-4 py-3">{appointment.appointmentDate}</td>
//                   <td className="px-4 py-3">{appointment.time ?? 'N/A'}</td>
//                   <td className="px-4 py-3">
//                     {appointment.isCompleted ? 'Completed' : 'Pending'}
//                   </td>
//                   <td className="px-4 py-3">{appointment.totalAmount ?? 'N/A'}</td>
//                   <td className="px-4 py-3 flex gap-2">
//                     <button
//                       className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//                       onClick={() => handleEdit(appointment)}
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       className="cursor-pointer bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
//                       onClick={() => {
//                         setAppointmentToDelete(appointmentToDelete)
//                         ;(
//                           document.getElementById(
//                             'delete_modal',
//                           ) as HTMLDialogElement
//                         )?.showModal()
//                       }}
//                     >
//                       <MdDeleteForever />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         !appointmentsLoading && (
//           <p className="text-gray-600 mt-6 text-center text-base">
//             No appointments found.
//           </p>
//         )
//       )}
//     </div>
//   )
// };

// export default Appointments;