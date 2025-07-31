import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";
import { toast } from "sonner";

interface DeleteAppointmentProps {
  appointment: TAppointment | null;
  refetch: () => void;
}

const DeleteAppointment = ({ appointment, refetch }: DeleteAppointmentProps) => {
  const [deleteAppointment, { isLoading }] = appointmentsAPI.useDeleteAppointmentMutation();

  const handleDelete = async () => {
    if (!appointment) {
      toast.error("No appointment selected");
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

  if (!appointment) return null;

  return (
    <dialog id="delete_appointment_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 className="font-bold text-lg mb-4 text-red-600">Delete Appointment</h3>
        
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this appointment? This action cannot be undone.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Appointment ID:</strong> {appointment.appointmentID}</div>
              <div><strong>Doctor ID:</strong> {appointment.doctorID}</div>
              <div><strong>Date:</strong> {appointment.appointmentDate}</div>
              <div><strong>Time:</strong> {appointment.timeSlot}</div>
              <div><strong>Amount:</strong> ${appointment.totalAmount}</div>
              <div><strong>Status:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  appointment.appointmentStatus === "Confirmed" 
                    ? "bg-green-100 text-green-800" 
                    : appointment.appointmentStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : appointment.appointmentStatus === "Completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {appointment.appointmentStatus}
                </span>
              </div>
            </div>
            {appointment.notes && (
              <div className="mt-2">
                <strong>Notes:</strong> {appointment.notes}
              </div>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => (document.getElementById("delete_appointment_modal") as HTMLDialogElement)?.close()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete Appointment"
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteAppointment;