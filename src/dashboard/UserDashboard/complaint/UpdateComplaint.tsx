import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { complaintsAPI, type TComplaint } from "../../../features/complaint/complaintsAPI";



type UpdateComplaintProps = {
  complaint: TComplaint | null;
  refetch: () => void;
};

type UpdateComplaintInputs = {
  complaintID: number;
  subject: string;
  description: string;
  status: string;
};

const schema = yup.object({
  complaintID: yup.number().required(),
  subject: yup.string().required("Subject is required"),
  description: yup.string().required("Description is required"),
  status: yup.string().required("Status is required"),
});

const UpdateComplaint = ({ complaint, refetch }: UpdateComplaintProps) => {
  const [updateComplaint, { isLoading }] = complaintsAPI.useUpdateComplaintMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateComplaintInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (complaint) {
      setValue("complaintID", complaint.complaintID);
      setValue("subject", complaint.subject);
      setValue("description", complaint.description);
      setValue("status", complaint.status);
    } else {
      reset();
    }
  }, [complaint, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateComplaintInputs> = async (data) => {
    if (!complaint) {
      toast.error("No complaint selected");
      return;
    }

    try {
      await updateComplaint({ ...data, complaintID: complaint.complaintID }).unwrap();
      toast.success("Complaint updated successfully");
      refetch();
      reset();
      (document.getElementById("update_complaint_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating complaint:", error);
      toast.error("Failed to update complaint. Please try again.");
    }
  };

  return (
    <dialog id="update_complaint_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Complaint</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("subject")}
            placeholder="Subject"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.subject && <span className="text-sm text-red-700">{errors.subject.message}</span>}

          <textarea
            {...register("description")}
            placeholder="Description"
            rows={4}
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.description && <span className="text-sm text-red-700">{errors.description.message}</span>}

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-bars loading-xl" /> Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (document.getElementById("update_complaint_modal") as HTMLDialogElement)?.close();
                reset();
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateComplaint;