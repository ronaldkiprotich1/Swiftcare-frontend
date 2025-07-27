import { useDeleteDoctorMutation } from "../../../../features/doctors/doctorsAPI";
import type { TDoctor } from "../../../../features/doctors/doctorsAPI";import { XCircle } from "lucide-react";
import toast from "react-hot-toast";

type DeleteDoctorProps = {
  doctor: TDoctor | null;
  refetch: () => void;
};

const DeleteDoctor = ({ doctor, refetch }: DeleteDoctorProps) => {
  const [deleteDoctor, { isLoading }] = useDeleteDoctorMutation();

  const handleDelete = async () => {
    if (!doctor) return;

    try {
      await deleteDoctor(doctor.userId).unwrap();
      toast.success("Doctor deleted successfully");
      refetch();
      (document.getElementById("delete_doctor_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Failed to delete doctor:", error);
      toast.error("Failed to delete doctor");
    }
  };

  return (
    <dialog id="delete_doctor_modal" className="modal">
      <div className="modal-box border border-red-200 bg-red-50">
        <div className="flex flex-col items-center gap-4 text-center">
          <XCircle className="h-12 w-12 text-red-500" />
          <h3 className="text-lg font-bold text-red-700">
            Confirm Delete Doctor
          </h3>
          <p className="text-red-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              Dr. {doctor?.firstName} {doctor?.lastName}
            </span>
            ?
          </p>
          <div className="flex gap-4 mt-4">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() =>
                (document.getElementById("delete_doctor_modal") as HTMLDialogElement)?.close()
              }
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteDoctor;
