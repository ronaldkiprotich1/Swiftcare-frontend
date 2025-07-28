import { toast } from "sonner";
import { paymentsAPI, type TPayment } from "../../../features/payments/paymentAPI";


type DeletePaymentProps = {
  payment: TPayment | null;
  refetch: () => void;
};

const DeletePayment = ({ payment, refetch }: DeletePaymentProps) => {
  const [deletePayment, { isLoading }] = paymentsAPI.useDeletePaymentMutation({
    fixedCacheKey: "deletePayment",
  });

  const handleDelete = async () => {
    try {
      if (!payment) {
        toast.error("No payment selected for deletion.");
        return;
      }
      await deletePayment(payment.paymentID).unwrap();
      toast.success("Payment deleted successfully!");
      refetch();
      (document.getElementById("delete_payment_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Failed to delete payment. Please try again.");
    }
  };

  return (
    <dialog id="delete_payment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Delete Payment</h3>
        <p className="mb-6">
          Are you sure you want to delete payment ID <span className="font-semibold">{payment?.paymentID}</span>?
        </p>
        <div className="modal-action flex gap-4">
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-bars loading-xl" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => (document.getElementById("delete_payment_modal") as HTMLDialogElement)?.close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeletePayment;