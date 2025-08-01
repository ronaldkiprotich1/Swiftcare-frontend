import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { prescriptionsAPI } from "../../../features/prescriptions/prescriptionAPI";

type CreatePrescriptionProps = {
  refetch: () => void;
  appointmentId?: number;
  doctorId?: number;
  userId?: number;
  notes?: string;
};

type CreatePrescriptionInputs = {
  appointmentId: number;
  doctorId: number;
  userId: number;
  notes: string;
};

const schema: yup.ObjectSchema<CreatePrescriptionInputs> = yup
  .object({
    appointmentId: yup.number().required(),
    doctorId: yup.number().required(),
    userId: yup.number().required(),
    notes: yup.string().required("Notes are required"),
  })
  .required();

const CreatePrescription = ({ refetch }: CreatePrescriptionProps) => {
  const [createPrescription, { isLoading }] =
    prescriptionsAPI.useCreatePrescriptionMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePrescriptionInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreatePrescriptionInputs> = async (data) => {
    try {
      await createPrescription(data).unwrap();
      toast.success("Prescription created");
      refetch();
      reset();
      (document.getElementById("create_prescription_modal") as HTMLDialogElement)
        ?.close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create prescription");
    }
  };

  return (
    <dialog id="create_prescription_modal" className="modal">
      <div className="modal-box bg-gray-700 text-white rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create Prescription</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="number"
            {...register("appointmentId")}
            placeholder="Appointment ID"
            className="input bg-white text-gray-800"
          />
          {errors.appointmentId && (
            <span className="text-sm text-red-500">{errors.appointmentId.message}</span>
          )}

          <input
            type="number"
            {...register("doctorId")}
            placeholder="Doctor ID"
            className="input bg-white text-gray-800"
          />
          {errors.doctorId && (
            <span className="text-sm text-red-500">{errors.doctorId.message}</span>
          )}

          <input
            type="number"
            {...register("userId")}
            placeholder="User ID"
            className="input bg-white text-gray-800"
          />
          {errors.userId && (
            <span className="text-sm text-red-500">{errors.userId.message}</span>
          )}

          <textarea
            {...register("notes")}
            placeholder="Notes"
            className="textarea bg-white text-gray-800"
          />
          {errors.notes && (
            <span className="text-sm text-red-500">{errors.notes.message}</span>
          )}

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                (document.getElementById("create_prescription_modal") as HTMLDialogElement)
                  ?.close()
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreatePrescription;
