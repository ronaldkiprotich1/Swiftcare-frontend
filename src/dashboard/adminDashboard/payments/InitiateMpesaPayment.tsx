// // import { useState, useEffect } from "react";
// // import { useForm, type SubmitHandler } from "react-hook-form";
// // import { toast } from "sonner";
// // import { yupResolver } from "@hookform/resolvers/yup";
// // import * as yup from "yup";
// // import { type TAppointment } from "../../../features/appointments/appointmentsAPI";
// // import axios from "axios";

// // type InitiateMpesaPaymentProps = {
// //   appointment: TAppointment | null;
// //   refetch: () => void;
// // };

// // type MpesaPaymentInputs = {
// //   phoneNumber: string;
// //   appointmentID: number;
// //   amount: number;
// // };

// // const schema = yup.object({
// //   phoneNumber: yup
// //     .string()
// //     .required("Phone number is required")
// //     .matches(/^2547\d{8}$/, "Use format: 2547XXXXXXXX"),
// //     appointmentID: yup.number().required("Appointment ID is required").positive(),
// //     amount: yup.number().required("Amount is required").positive(),
// // });

// // const InitiateMpesaPayment = ({ appointment, refetch }: InitiateMpesaPaymentProps) => {
// //   const {
// //     register,
// //     handleSubmit,
// //     reset,
// //     setValue,
// //     formState: { errors },
// //   } = useForm<MpesaPaymentInputs>({
// //     resolver: yupResolver(schema),
// //   });

// //   useEffect(() => {
// //     if (appointment) {
// //       setValue("appointmentID", appointment.appointmentID);
// //       setValue("amount", appointment.totalAmount || 0);
// //     } else {
// //       reset();
// //     }
// //   }, [appointment, setValue, reset]);

// //   const [isLoading, setIsLoading] = useState(false);

// //   const onSubmit: SubmitHandler<MpesaPaymentInputs> = async (data) => {
// //     try {
// //       setIsLoading(true);
// //       const response = await axios.post("http://localhost:8081/mpesa/stk-push", {
// //         paymentID: data.appointmentID,
// //         amount: data.amount,
// //         phoneNumber: data.phoneNumber,
// //       });

// //       console.log("STK Push response:", response.data);
// //       toast.success("STK Push initiated. Check your phone to complete payment!");

// //       (document.getElementById("initiate_mpesa_payment_modal") as HTMLDialogElement)?.close();
// //       refetch();
// //     } catch (error) {
// //       console.error("Error initiating STK Push:", error);
// //       toast.error("Failed to initiate payment. Please try again.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <dialog id="initiate_mpesa_payment_modal" className="modal sm:modal-middle">
// //       <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
// //         <h3 className="font-bold text-lg mb-4">Pay with M-PESA</h3>
// //         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
// //           <input
// //             type="number"
// //             readOnly
// //             {...register("appointmentID")}
// //             placeholder="Appointment ID"
// //             className="input rounded w-full p-2 bg-white text-gray-800"
// //           />

// //           <input
// //             type="number"
// //             readOnly
// //             {...register("amount")}
// //             placeholder="Amount"
// //             className="input rounded w-full p-2 bg-white text-gray-800"
// //           />

// //           <input
// //             type="text"
// //             {...register("phoneNumber")}
// //             placeholder="Phone Number (e.g. 2547XXXXXXXX)"
// //             className="input rounded w-full p-2 bg-white text-gray-800"
// //           />
// //           {errors.phoneNumber && (
// //             <span className="text-sm text-red-700">{errors.phoneNumber.message}</span>
// //           )}

// //           <div className="modal-action">
// //             <button type="submit" className="btn btn-primary" disabled={isLoading}>
// //               {isLoading ? "Processing..." : "Pay Now"}
// //             </button>
// //             <button
// //               className="btn"
// //               type="button"
// //               onClick={() => {
// //                 (document.getElementById("initiate_mpesa_payment_modal") as HTMLDialogElement)?.close();
// //                 reset();
// //               }}
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </dialog>
// //   );
// // };

// // export default InitiateMpesaPayment;


// import { useState, useEffect } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "sonner";
// import type { TAppointment } from "../../../features/appointments/appointmentsAPI";
// import axios from "axios";

// type Props = {
//   appointment: TAppointment | null;
//   paymentID: number | null;
//   amount: number | null; 
//   refetch: () => void;
// };

// type Inputs = {
//   phoneNumber: string;
//   paymentID: number;
//   amount: number;
// };

// const schema = yup.object({
//   phoneNumber: yup
//     .string()
//     .required("Phone number is required")
//     .matches(/^2547\d{8}$/, "Use 2547XXXXXXXX"),
//   paymentID: yup.number().required(),
//   amount: yup.number().required().positive(),
// });

// const InitiateMpesaPayment = ({ appointment, paymentID, amount, refetch }: Props) => {
//   const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<Inputs>({
//     resolver: yupResolver(schema),
//   });

//   useEffect(() => {
//     if (paymentID) setValue("paymentID", paymentID);
//     if (amount) setValue("amount", amount);
//     else if (appointment) setValue("amount", appointment.totalAmount || 0);
//   }, [paymentID, amount, appointment, setValue]);

//   const [isLoading, setIsLoading] = useState(false);

//   const onSubmit: SubmitHandler<Inputs> = async (data) => {
//     try {
//       setIsLoading(true);

//       await axios.post("http://localhost:8081/mpesa/stk-push", {
//         paymentID: data.paymentID,
//         amount: data.amount,
//         phoneNumber: data.phoneNumber,
//       });

//       toast.success("STK push sent. Check your phone!");
//       (document.getElementById("initiate_mpesa_payment_modal") as HTMLDialogElement)?.close();
//       reset();
//       refetch();
//     } catch (error) {
//       console.error("STK Push Error:", error);
//       toast.error("Failed to send STK push.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <dialog id="initiate_mpesa_payment_modal" className="modal sm:modal-middle">
//       <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
//         <h3 className="font-bold text-lg mb-4">Pay with M-PESA</h3>
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//           <input
//             {...register("paymentID")}
//             type="number"
//             readOnly
//             className="input rounded w-full p-2 bg-white text-gray-800"
//           />

//           <input
//             {...register("amount")}
//             type="number"
//             readOnly
//             className="input rounded w-full p-2 bg-white text-gray-800"
//           />

//           <input
//             {...register("phoneNumber")}
//             type="text"
//             placeholder="2547XXXXXXXX"
//             className="input rounded w-full p-2 bg-white text-gray-800"
//           />
//           {errors.phoneNumber && (
//             <span className="text-sm text-red-700">{errors.phoneNumber.message}</span>
//           )}

//           <div className="modal-action">
//             <button type="submit" className="btn btn-primary" disabled={isLoading}>
//               {isLoading ? "Processing..." : "Pay Now"}
//             </button>
//             <button
//               className="btn"
//               type="button"
//               onClick={() => {
//                 (document.getElementById("initiate_mpesa_payment_modal") as HTMLDialogElement)?.close();
//                 reset();
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </dialog>
//   );
// };

// export default InitiateMpesaPayment;
