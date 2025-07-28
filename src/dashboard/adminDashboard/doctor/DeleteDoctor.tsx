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
      await deleteDoctor(doctor.doctorID).unwrap();
      toast.success("Doctor deleted successfully");
      refetch();
      (document.getElementById("delete_doctor_modal") as HTMLDialogElement)?.close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete doctor");
    }
  };

  return (
    <dialog id="delete_doctor_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-700 text-white">
        <h3 className="font-bold text-lg mb-4">Delete Doctor</h3>
        <p>Are you sure you want to delete this doctor?</p>
        <div className="modal-action">
          <button className="btn btn-error" disabled={isLoading} onClick={handleDelete}>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            className="btn"
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