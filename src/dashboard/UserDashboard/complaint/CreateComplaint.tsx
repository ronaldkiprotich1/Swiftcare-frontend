import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { complaintsAPI, type CreateComplaintInput } from "../../../features/complaint/complaintsAPI";
import type { RootState } from "../../../app/store";

type CreateComplaintProps = {
  refetch: () => void;
};

type CreateComplaintFormInputs = {
  relatedAppointmentId?: number | null;
  subject: string;
  description: string;
  priority: string;
};

const schema: yup.ObjectSchema<CreateComplaintFormInputs> = yup.object({
  relatedAppointmentId: yup
    .number()
    .typeError("Appointment ID must be a number")
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .optional(),
  subject: yup.string().required("Subject is required"),
  description: yup.string().required("Description is required"),
  priority: yup.string().required("Priority is required"),
});

const CreateComplaint = ({ refetch }: CreateComplaintProps) => {
  // Get userId from Redux store
  const userId = useSelector((state: RootState) => state.user.user?.userId);
  
  const [createComplaint, { isLoading }] = complaintsAPI.useCreateComplaintMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateComplaintFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      priority: "Medium",
    },
  });

  const onSubmit: SubmitHandler<CreateComplaintFormInputs> = async (data) => {
    if (!userId) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    try {
      const complaintData: CreateComplaintInput = {
        userId: userId,
        relatedAppointmentId: data.relatedAppointmentId || null,
        subject: data.subject,
        description: data.description,
        status: "Open", // Default status for new complaints
        priority: data.priority,
        adminResponse: null,
        assignedTo: null,
      };

      console.log("Creating complaint with data:", complaintData);
      
      await createComplaint(complaintData).unwrap();
      toast.success("Complaint created successfully");
      refetch();
      reset();
      (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.close();
    } catch (err) {
      console.error("Error creating complaint:", err);
      toast.error("Failed to create complaint. Please try again.");
    }
  };

  // Show error if user is not authenticated
  if (!userId) {
    return (
      <dialog id="create_complaint_modal" className="modal sm:modal-middle">
        <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
          <h3 className="font-bold text-lg mb-4">Create Complaint</h3>
          <div className="text-center p-4">
            <p className="text-red-300">Please log in to create a complaint.</p>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.close()
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    );
  }

  return (
    <dialog id="create_complaint_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create Complaint</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="number"
            {...register("relatedAppointmentId")}
            placeholder="Related Appointment ID (optional)"
            className="input rounded w-full p-2 text-lg bg-white text-gray-800"
          />
          {errors.relatedAppointmentId && (
            <span className="text-sm text-red-400">{errors.relatedAppointmentId.message}</span>
          )}

          <input
            type="text"
            {...register("subject")}
            placeholder="Subject"
            className="input rounded w-full p-2 text-lg bg-white text-gray-800"
          />
          {errors.subject && <span className="text-sm text-red-400">{errors.subject.message}</span>}

          <textarea
            {...register("description")}
            placeholder="Description"
            rows={4}
            className="textarea rounded w-full p-2 text-lg bg-white text-gray-800"
          />
          {errors.description && (
            <span className="text-sm text-red-400">{errors.description.message}</span>
          )}

          <select
            {...register("priority")}
            className="select rounded w-full p-2 text-lg bg-white text-gray-800"
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          {errors.priority && <span className="text-sm text-red-400">{errors.priority.message}</span>}

          <div className="bg-gray-700 p-3 rounded text-sm">
            <p><strong>Auto-filled Information:</strong></p>
            <p>User ID: {userId}</p>
            <p>Status: Open (default)</p>
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-bars loading-xl" /> Creating...
                </>
              ) : (
                "Create Complaint"
              )}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                reset();
                (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.close();
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

export default CreateComplaint;