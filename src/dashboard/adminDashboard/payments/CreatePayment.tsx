
// import { useEffect } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "sonner";
// import { paymentsAPI } from "../../../features/payment/paymentsAPI";
// import type { TAppointment } from "../../../features/appointments/appointmentsAPI";

// type CreatePaymentProps = {
//   refetch: () => void;
//   appointment: TAppointment | null;
//   //handler to set the payment for Mpesa
//   onPaymentCreated: (paymentID: number, amount: number) => void;
// };

// type CreatePaymentInputs = {
//   appointmentID: number;
//   amount: number;
//   paymentStatus: string;
//   transactionID: string;
//   paymentDate: string;
// };

// const schema = yup.object({
//   appointmentID: yup.number().required(),
//   amount: yup.number().required().positive(),
//   paymentStatus: yup.string().required(),
//   transactionID: yup.string().required(),
//   paymentDate: yup.string().required(),
// });

// const CreatePayment = ({ refetch, appointment, onPaymentCreated }: CreatePaymentProps) => {
//   const [createPayment, { isLoading }] = paymentsAPI.useCreatePaymentMutation();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm<CreatePaymentInputs>({
//     resolver: yupResolver(schema),
//   });

//   useEffect(() => {
//     if (appointment) {
//       setValue("appointmentID", appointment.appointmentID);
//       setValue("amount", appointment.totalAmount || 0);
//       setValue("paymentStatus", "Paid");
//     } else {
//       reset();
//     }
//   }, [appointment, setValue, reset]);

//   const onSubmit: SubmitHandler<CreatePaymentInputs> = async (data) => {
//     try {
//       const response = await createPayment(data).unwrap();
//       console.log("Payment created:", response);

//       const paymentID = response.paymentID;
//       if (!paymentID) {
//         toast.error("No payment ID returned!");
//         return;
//       }

//       toast.success("Payment created successfully");
//       refetch();
//       reset();
//       (document.getElementById("create_payment_modal") as HTMLDialogElement)?.close();

//       // Call the handler to open Mpesa modal with paymentID & amount
//       onPaymentCreated(paymentID, data.amount);

//     } catch (error) {
//       console.error("Error creating payment:", error);
//       toast.error("Failed to create payment.");
//     }
//   };

//   return (
//     <dialog id="create_payment_modal" className="modal sm:modal-middle">
//       <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
//         <h3 className="font-bold text-lg mb-4">Create Payment</h3>
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//           <input
//             type="number"
//             {...register("appointmentID")}
//             placeholder="Appointment ID"
//             readOnly
//             className="input rounded w-full p-2 bg-white text-gray-800"
//           />
//           {errors.appointmentID && <span className="text-sm text-red-700">{errors.appointmentID.message}</span>}

//           <input
//             type="number"
//             step="0.01"
//             {...register("amount")}
//             placeholder="Amount"
//             readOnly
//             className="input rounded w-full p-2 bg-white text-gray-800"
//           />
//           {errors.amount && <span className="text-sm text-red-700">{errors.amount.message}</span>}

//           <input
//             type="text"
//             {...register("paymentStatus")}
//             placeholder="Payment Status"
//             readOnly
//             className="input rounded w-full p-2 bg-white text-gray-800"
//           />
//           {errors.paymentStatus && <span className="text-sm text-red-700">{errors.paymentStatus.message}</span>}

//           <input
//             type="text"
//             {...register("transactionID")}
//             placeholder="Transaction ID"
//             className="input rounded w-full p-2 bg-white text-gray-800"
//           />
//           {errors.transactionID && <span className="text-sm text-red-700">{errors.transactionID.message}</span>}

//           <input
//             type="date"
//             {...register("paymentDate")}
//             className="input rounded w-full p-2 bg-white text-gray-800"
//           />
//           {errors.paymentDate && <span className="text-sm text-red-700">{errors.paymentDate.message}</span>}

//           <div className="modal-action">
//             <button type="submit" className="btn btn-primary" disabled={isLoading}>
//               {isLoading ? "Creating..." : "Create"}
//             </button>
//             <button
//               className="btn"
//               type="button"
//               onClick={() => {
//                 (document.getElementById("create_payment_modal") as HTMLDialogElement)?.close();
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

// export default CreatePayment;



import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { paymentsAPI } from "../../../features/payments/paymentAPI";
import type { TAppointment } from "../../../features/appointments/appointmentsAPI";

type CreatePaymentProps = {
  refetch: () => void;
  appointment: TAppointment | null;
  //handler for Mpesa modal
  onPaymentCreated: (paymentID: number, amount: number, phoneNumber: string) => void;
};

type CreatePaymentInputs = {
  appointmentID: number;
  amount: number;
  paymentStatus: string;
  transactionID: string;
  paymentDate: string;
  phoneNumber: string; 
};

const schema = yup.object({
  appointmentID: yup.number().required(),
  amount: yup.number().required().positive(),
  paymentStatus: yup.string().required(),
  transactionID: yup.string().required(),
  paymentDate: yup.string().required(),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^2547\d{8}$/, "Use format 2547XXXXXXXX"),
});

const CreatePayment = ({ refetch, appointment, onPaymentCreated }: CreatePaymentProps) => {
  const [createPayment, { isLoading }] = paymentsAPI.useCreatePaymentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePaymentInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (appointment) {
      setValue("appointmentID", appointment.appointmentID);
      setValue("amount", appointment.totalAmount || 0);
      setValue("paymentStatus", "Pending");
    } else {
      reset();
    }
  }, [appointment, setValue, reset]);

  const onSubmit: SubmitHandler<CreatePaymentInputs> = async (data) => {
    try {
      const response = await createPayment(data).unwrap();
      console.log("Payment created:", response);

      const paymentID = response.paymentID;
      if (!paymentID) {
        toast.error("No payment ID returned!");
        return;
      }

      toast.success("Payment created successfully");
      refetch();
      reset();
      (document.getElementById("create_payment_modal") as HTMLDialogElement)?.close();

      
      onPaymentCreated(paymentID, data.amount, data.phoneNumber);
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Failed to create payment.");
    }
  };

  return (
    <dialog id="create_payment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create Payment</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="number"
            {...register("appointmentID")}
            placeholder="Appointment ID"
            readOnly
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.appointmentID && (
            <span className="text-sm text-red-700">{errors.appointmentID.message}</span>
          )}

          <input
            type="number"
            step="0.01"
            {...register("amount")}
            placeholder="Amount"
            readOnly
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.amount && (
            <span className="text-sm text-red-700">{errors.amount.message}</span>
          )}

          <input
            type="text"
            {...register("paymentStatus")}
            placeholder="Payment Status"
            readOnly
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.paymentStatus && (
            <span className="text-sm text-red-700">{errors.paymentStatus.message}</span>
          )}

          <input
            type="text"
            {...register("transactionID")}
            placeholder="Transaction ID"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.transactionID && (
            <span className="text-sm text-red-700">{errors.transactionID.message}</span>
          )}

          <input
            type="date"
            {...register("paymentDate")}
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.paymentDate && (
            <span className="text-sm text-red-700">{errors.paymentDate.message}</span>
          )}

          
          <input
            type="text"
            {...register("phoneNumber")}
            placeholder="Phone Number (2547XXXXXXXX)"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.phoneNumber && (
            <span className="text-sm text-red-700">{errors.phoneNumber.message}</span>
          )}

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (document.getElementById("create_payment_modal") as HTMLDialogElement)?.close();
                reset();
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreatePayment;