import { toast } from "sonner";
import { complaintsAPI, type TComplaint } from "../../../features/complaint/complaintsAPI";


type DeleteComplaintProps = {
  complaint: TComplaint | null;
  refetch: () => void;
};

const DeleteComplaint = ({ complaint, refetch }: DeleteComplaintProps) => {
  const [deleteComplaint, { isLoading }] = complaintsAPI.useDeleteComplaintMutation({
    fixedCacheKey: "deleteComplaint",
  });

  const handleDelete = async () => {
    if (!complaint) {
      toast.error("No complaint selected for deletion.");
      return;
    }

    try {
      await deleteComplaint(complaint.complaintID).unwrap();
      toast.success("Complaint deleted successfully!");
      refetch();
      (document.getElementById("delete_complaint_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast.error("Failed to delete complaint. Please try again.");
    }
  };

  return (
    <dialog id="delete_complaint_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Delete Complaint</h3>
        <p className="mb-6">
          Are you sure you want to delete complaint ID <span className="font-semibold">{complaint?.complaintID}</span>?
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
            onClick={() => (document.getElementById("delete_complaint_modal") as HTMLDialogElement)?.close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteComplaint;