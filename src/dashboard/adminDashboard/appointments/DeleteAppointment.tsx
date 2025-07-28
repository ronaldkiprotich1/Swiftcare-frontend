import { toast } from "sonner";
import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";


type DeleteAppointmentProps = {
  appointment: TAppointment | null;
  refetch: () => void;
};

const DeleteAppointment = ({ appointment, refetch }: DeleteAppointmentProps) => {
  const [deleteAppointment, { isLoading }] = appointmentsAPI.useDeleteAppointmentMutation({
    fixedCacheKey: "deleteAppointment",
  });

  const handleDelete = async () => {
    if (!appointment) {
      toast.error("No appointment selected for deletion.");
      return;
    }

    try {
      await deleteAppointment(appointment.appointmentID).unwrap();
      toast.success("Appointment deleted successfully!");
      refetch();
      (document.getElementById("delete_appointment_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment. Please try again.");
    }
  };

  return (
    <dialog id="delete_appointment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Delete Appointment</h3>
        <p className="mb-6">
          Are you sure you want to delete appointment ID{" "}
          <span className="font-semibold">{appointment?.appointmentID}</span>?
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
            onClick={() => (document.getElementById("delete_appointment_modal") as HTMLDialogElement)?.close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteAppointment;