import { toast } from "sonner";
import { doctorsAPI, type TDoctor } from "../../../features/doctor/doctorsAPI";

type DeleteDoctorProps = {
  doctor: TDoctor | null;
  refetch: () => void;
};

const DeleteDoctor = ({ doctor, refetch }: DeleteDoctorProps) => {
  const [deleteDoctor, { isLoading }] = doctorsAPI.useDeleteDoctorMutation();

  const handleDelete = async () => {
    if (!doctor) return;

    try {
      // Fixed: Use doctorId instead of doctorID
      await deleteDoctor(doctor.doctorId).unwrap();
      toast.success("Doctor deleted successfully");
      refetch();
      (document.getElementById("delete_doctor_modal") as HTMLDialogElement)?.close();
    } catch (err: any) {
      console.error("Delete doctor error:", err);
      const errorMessage = err?.data?.message || err?.message || "Failed to delete doctor";
      toast.error(errorMessage);
    }
  };

  return (
    <dialog id="delete_doctor_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-700 text-white">
        <h3 className="font-bold text-lg mb-4">Delete Doctor</h3>
        {doctor && (
          <div className="mb-4">
            <p className="mb-2">Are you sure you want to delete this doctor?</p>
            <div className="bg-gray-600 p-3 rounded">
              <p><strong>Name:</strong> {doctor.firstName} {doctor.lastName}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>ID:</strong> {doctor.doctorId}</p>
            </div>
            <p className="text-red-400 text-sm mt-2">This action cannot be undone.</p>
          </div>
        )}
        
        <div className="modal-action">
          <button 
            className="btn btn-error" 
            disabled={isLoading || !doctor} 
            onClick={handleDelete}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Doctor"
            )}
          </button>
          <button
            className="btn btn-outline"
            onClick={() =>
              (document.getElementById("delete_doctor_modal") as HTMLDialogElement)?.close()
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteDoctor;