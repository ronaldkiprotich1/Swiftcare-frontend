import { toast } from "sonner";
import { complaintsAPI, type TComplaint } from "../../../features/complaint/complaintsAPI";

type DeleteComplaintProps = {
  complaint: TComplaint | null;
  refetch: () => void;
};

const DeleteComplaint = ({ complaint, refetch }: DeleteComplaintProps) => {
  // Fixed: Remove the fixedCacheKey option as it's not needed for mutations
  const [deleteComplaint, { isLoading }] = complaintsAPI.useDeleteComplaintMutation();

  const handleDelete = async () => {
    if (!complaint) {
      toast.error("No complaint selected for deletion.");
      return;
    }

    try {
      // Use complaintId instead of complaintID to match the API response
      await deleteComplaint(complaint.complaintId).unwrap();
      toast.success("Complaint deleted successfully!");
      refetch();
      (document.getElementById("delete_complaint_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast.error("Failed to delete complaint. Please try again.");
    }
  };

  const handleCancel = () => {
    (document.getElementById("delete_complaint_modal") as HTMLDialogElement)?.close();
  };

  return (
    <dialog id="delete_complaint_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-gray-900 w-full max-w-xs sm:max-w-lg mx-auto rounded-lg shadow-lg">
        <h3 className="font-bold text-lg mb-4 text-red-600">Delete Complaint</h3>
        
        {complaint ? (
          <div className="mb-6">
            <p className="mb-2">Are you sure you want to delete this complaint?</p>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p><span className="font-semibold">ID:</span> {complaint.complaintId}</p>
              <p><span className="font-semibold">Subject:</span> {complaint.subject}</p>
              <p><span className="font-semibold">Status:</span> {complaint.status}</p>
            </div>
            <p className="text-sm text-red-600 mt-2">
              <strong>Warning:</strong> This action cannot be undone.
            </p>
          </div>
        ) : (
          <p className="mb-6">No complaint selected for deletion.</p>
        )}

        <div className="modal-action flex gap-3 justify-end">
          <button
            className="btn btn-outline"
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isLoading || !complaint}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete Complaint"
            )}
          </button>
        </div>
      </div>
      
      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
};

export default DeleteComplaint;