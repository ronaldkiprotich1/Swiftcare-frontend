import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  complaintsAPI,
  type TComplaint,
  type ComplaintStatus,
} from "../../../../features/complaints/complaintsAPI";
import { toast } from "sonner";
import { useEffect } from "react";

type ChangeStatusProps = {
  complaint: TComplaint | null;
  refetch: () => void;
};

type ChangeStatusInputs = {
  status: ComplaintStatus;
};

const schema = yup.object({
  status: yup.string().oneOf(["Open", "In Progress", "Resolved", "Closed"]).required(),
});

const ChangeStatus = ({ complaint, refetch }: ChangeStatusProps) => {
  const [updateComplaint, { isLoading }] = complaintsAPI.useUpdateComplaintMutation({
    fixedCacheKey: "updateComplaint",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ChangeStatusInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (complaint) {
      setValue("status", complaint.status);
    } else {
      reset();
    }
  }, [complaint, setValue, reset]);

  const onSubmit: SubmitHandler<ChangeStatusInputs> = async (data) => {
    if (!complaint) {
      toast.error("No complaint selected.");
      return;
    }

    try {
      await updateComplaint({ id: complaint.complaintId, status: data.status }).unwrap();
      toast.success("Status updated!");
      refetch();
      reset();
      (document.getElementById("change_status_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Update failed. Try again.");
    }
  };

  return (
    <dialog id="change_status_modal" className="modal sm:modal-middle">
      <div className="modal-box w-full max-w-lg border rounded-lg">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="text-lg font-bold text-white">
            Change Status for Complaint #{complaint?.complaintId}
          </h3>
          <p className="text-sm text-teal-100 mt-1">Subject: {complaint?.subject}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <select
              {...register("status")}
              className="select select-bordered w-full text-gray-800"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            {errors.status && (
              <span className="text-red-600 text-sm">{errors.status.message}</span>
            )}
          </div>

          <div className="modal-action flex gap-2">
            <button
              type="submit"
              className="btn bg-teal-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Status"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset();
                (document.getElementById("change_status_modal") as HTMLDialogElement)?.close();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ChangeStatus;
