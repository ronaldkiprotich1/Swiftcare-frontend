import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { complaintsAPI } from "../../../features/complaint/complaintsAPI";

type CreateComplaintProps = {
  refetch: () => void;
};

type CreateComplaintInputs = {
  relatedAppointmentID?: number | null;
  userID: number;
  subject: string;
  description: string;

};

const schema: yup.ObjectSchema<CreateComplaintInputs> = yup.object({
  relatedAppointmentID: yup
    .number()
    .typeError("Appointment ID must be a number")
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .optional(),
  userID: yup.number().required("User ID is required").positive("Must be positive"),
  subject: yup.string().required("Subject is required"),
  description: yup.string().required("Description is required"),
});

const CreateComplaint = ({ refetch }: CreateComplaintProps) => {
  const [createComplaint, { isLoading }] = complaintsAPI.useCreateComplaintMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateComplaintInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateComplaintInputs> = async (data) => {
    try {
      await createComplaint(data).unwrap();
      toast.success("Complaint created successfully");
      refetch();
      reset();
      (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create complaint");
    }
  };

  return (
    <dialog id="create_complaint_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create Complaint</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="number"
            {...register("relatedAppointmentID")}
            placeholder="Related Appointment ID (optional)"
            className="input rounded w-full p-2 text-lg bg-white text-gray-800"
          />
          {errors.relatedAppointmentID && (
            <span className="text-sm text-red-700">{errors.relatedAppointmentID.message}</span>
          )}
          <input
            type="number"
            {...register("userID")}
            placeholder="User ID"
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />

          <input
            type="text"
            {...register("subject")}
            placeholder="Subject"
            className="input rounded w-full p-2 text-lg bg-white text-gray-800"
          />
          {errors.subject && <span className="text-sm text-red-700">{errors.subject.message}</span>}

          <textarea
            {...register("description")}
            placeholder="Description"
            rows={4}
            className="textarea rounded w-full p-2 text-lg bg-white text-gray-800"
          />
          {errors.description && (
            <span className="text-sm text-red-700">{errors.description.message}</span>
          )}

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-bars loading-xl" /> Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
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
        </form>
      </div>
    </dialog>
  );
};

export default CreateComplaint;