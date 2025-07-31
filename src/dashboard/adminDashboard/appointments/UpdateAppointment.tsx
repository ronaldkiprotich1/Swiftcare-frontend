// import { useEffect } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "sonner";
// import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";


// type UpdateAppointmentProps = {
//   appointment: TAppointment | null;
//   refetch: () => void;
// };

// type UpdateAppointmentInputs = {
//   appointmentID: number;
//   userID: number;
//   doctorID: number;
//   appointmentDate: string;
//   timeSlot: string;
//   totalAmount: number;
// };

// const schema = yup.object({
//   appointmentID: yup.number().required(),
//   userID: yup.number().required("User ID is required").positive(),
//   doctorID: yup.number().required("Doctor ID is required").positive(),
//   appointmentDate: yup.string().required("Appointment date is required"),
//   timeSlot: yup.string().required("Time slot is required"),
//   totalAmount: yup.number().positive().required(),
// });

// const UpdateAppointment = ({ appointment, refetch }: UpdateAppointmentProps) => {
//   const [updateAppointment, { isLoading }] = appointmentsAPI.useUpdateAppointmentMutation();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm<UpdateAppointmentInputs>({
//     resolver: yupResolver(schema),
//   });

//   useEffect(() => {
//     if (appointment) {
//       setValue("appointmentID", appointment.appointmentID);
//       setValue("userID", appointment.userID);
//       setValue("doctorID", appointment.doctorID);
//       setValue("appointmentDate", appointment.appointmentDate);
//       setValue("timeSlot", appointment.timeSlot);
//       if (appointment.totalAmount) {
//         setValue("totalAmount", appointment.totalAmount);
//       }
//     } else {
//       reset();
//     }
//   }, [appointment, setValue, reset]);

//   const onSubmit: SubmitHandler<UpdateAppointmentInputs> = async (data) => {
//     if (!appointment) {
//       toast.error("No appointment selected");
//       return;
//     }

//     try {
//       await updateAppointment({ ...data, appointmentID: appointment.appointmentID }).unwrap();
//       toast.success("Appointment updated successfully");
//       refetch();
//       reset();
//       (document.getElementById("update_appointment_modal") as HTMLDialogElement)?.close();
//     } catch (error) {
//       console.error("Error updating appointment:", error);
//       toast.error("Failed to update appointment. Please try again.");
//     }
//   };

//   return (
//     <dialog id="update_appointment_modal" className="modal sm:modal-middle">
//       <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
//         <h3 className="font-bold text-lg mb-4">Update Appointment</h3>
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//           <input
//             type="number"
//             {...register("userID")}
//             placeholder="User ID"
//             className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
//           />
//           {errors.userID && <span className="text-sm text-red-700">{errors.userID.message}</span>}

//           <input
//             type="number"
//             {...register("doctorID")}
//             placeholder="Doctor ID"
//             className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
//           />
//           {errors.doctorID && <span className="text-sm text-red-700">{errors.doctorID.message}</span>}

//           <input
//             type="date"
//             {...register("appointmentDate")}
//             className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
//           />
//           {errors.appointmentDate && (
//             <span className="text-sm text-red-700">{errors.appointmentDate.message}</span>
//           )}

//           <input
//             type="time"
//             {...register("timeSlot")}
//             className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
//           />
//           {errors.timeSlot && (
//             <span className="text-sm text-red-700">{errors.timeSlot.message}</span>
//           )}

//           <input
//             type="number"
//             step="0.01"
//             {...register("totalAmount")}
//             placeholder="Total Amount"
//             className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
//           />
//           {errors.totalAmount && (
//             <span className="text-sm text-red-700">{errors.totalAmount.message}</span>
//           )}

//           <div className="modal-action">
//             <button type="submit" className="btn btn-primary" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <span className="loading loading-bars loading-xl" /> Updating...
//                 </>
//               ) : (
//                 "Update"
//               )}
//             </button>
//             <button
//               className="btn"
//               type="button"
//               onClick={() => {
//                 (document.getElementById("update_appointment_modal") as HTMLDialogElement)?.close();
//                 reset();
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </form>
//       </div>
//     </dialog>
//   );
// };

// export default UpdateAppointment;