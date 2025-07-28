
import { toast } from "sonner";
import { prescriptionsAPI, type TPrescription } from "../../../features/prescriptions/prescriptionAPI";

type DeletePrescriptionProps = {
  prescription: TPrescription | null;
  refetch: () => void;
};

const DeletePrescription = ({ prescription, refetch }: DeletePrescriptionProps) => {
  const [deletePrescription, { isLoading }] = prescriptionsAPI.useDeletePrescriptionMutation();

  const handleDelete = async () => {
    if (!prescription) return;

    try {
      await deletePrescription(prescription.prescriptionID).unwrap();
      toast.success("Prescription deleted successfully");
      refetch();
      (document.getElementById("delete_prescription_modal") as HTMLDialogElement)?.close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete prescription.");
    }
  };

  return (
    <dialog id="delete_prescription_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-700 text-white w-full max-w-xs sm:max-w-md mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Delete Prescription</h3>
        <p>Are you sure you want to delete this prescription?</p>
        <div className="modal-action flex justify-between">
          <button className="btn btn-error" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            className="btn"
            onClick={() => (document.getElementById("delete_prescription_modal") as HTMLDialogElement)?.close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeletePrescription;