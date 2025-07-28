import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { paymentsAPI, type TPayment } from "../../../features/payments/paymentAPI";


type UpdatePaymentProps = {
  payment: TPayment | null;
  refetch: () => void;
};

type UpdatePaymentInputs = {
  paymentID: number;
  appointmentID: number;
  amount: number;
  paymentStatus: string;
  transactionID: string;
  paymentDate: string;
};

const schema = yup.object({
  paymentID: yup.number().required(),
  appointmentID: yup.number().required("Appointment ID is required").positive(),
  amount: yup.number().required("Amount is required").positive(),
  paymentStatus: yup.string().required("Payment status is required"),
  transactionID: yup.string().required("Transaction ID is required"),
  paymentDate: yup.string().required("Payment date is required"),
});

const UpdatePayment = ({ payment, refetch }: UpdatePaymentProps) => {
  const [updatePayment, { isLoading }] = paymentsAPI.useUpdatePaymentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdatePaymentInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (payment) {
      setValue("paymentID", payment.paymentID);
      setValue("appointmentID", payment.appointmentID);
      setValue("amount", payment.amount);
      setValue("paymentStatus", payment.paymentStatus);
      setValue("transactionID", payment.transactionID);
      setValue("paymentDate", payment.paymentDate);
    } else {
      reset();
    }
  }, [payment, setValue, reset]);

  const onSubmit: SubmitHandler<UpdatePaymentInputs> = async (data) => {
    if (!payment) {
      toast.error("No payment selected");
      return;
    }

    try {
      await updatePayment({ ...data, paymentID: payment.paymentID }).unwrap();
      toast.success("Payment updated successfully");
      refetch();
      reset();
      (document.getElementById("update_payment_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment. Please try again.");
    }
  };

  return (
    <dialog id="update_payment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Payment</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="number"
            {...register("appointmentID")}
            placeholder="Appointment ID"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.appointmentID && <span className="text-sm text-red-700">{errors.appointmentID.message}</span>}

          <input
            type="number"
            step="0.01"
            {...register("amount")}
            placeholder="Amount"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.amount && <span className="text-sm text-red-700">{errors.amount.message}</span>}

          <input
            type="text"
            {...register("paymentStatus")}
            placeholder="Payment Status"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.paymentStatus && <span className="text-sm text-red-700">{errors.paymentStatus.message}</span>}

          <input
            type="text"
            {...register("transactionID")}
            placeholder="Transaction ID"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.transactionID && <span className="text-sm text-red-700">{errors.transactionID.message}</span>}

          <input
            type="date"
            {...register("paymentDate")}
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.paymentDate && <span className="text-sm text-red-700">{errors.paymentDate.message}</span>}

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-bars loading-xl" /> Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (document.getElementById("update_payment_modal") as HTMLDialogElement)?.close();
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

export default UpdatePayment;