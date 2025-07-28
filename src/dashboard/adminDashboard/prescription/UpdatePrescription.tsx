import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { prescriptionsAPI, type TPrescription } from "../../../features/prescriptions/prescriptionAPI";


type UpdatePrescriptionProps = {
  prescription: TPrescription | null;
  refetch: () => void;
};

type Inputs = {
  notes: string;
};

const schema = yup.object({
  notes: yup.string().required("Notes are required"),
});

const UpdatePrescription = ({ prescription, refetch }: UpdatePrescriptionProps) => {
  const [updatePrescription, { isLoading }] = prescriptionsAPI.useUpdatePrescriptionMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (prescription) {
      setValue("notes", prescription.notes || "");
    }
  }, [prescription, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!prescription) return;
    try {
      await updatePrescription({ prescriptionID: prescription.prescriptionID, ...data }).unwrap();
      toast.success("Prescription updated successfully");
      refetch();
      reset();
      (document.getElementById("update_prescription_modal") as HTMLDialogElement)?.close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update prescription.");
    }
  };

  return (
    <dialog id="update_prescription_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-700 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Prescription</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <textarea
            {...register("notes")}
            placeholder="Prescription Notes"
            className="textarea textarea-bordered w-full p-2 bg-white text-black"
          />
          {errors.notes && <span className="text-red-400">{errors.notes.message}</span>}

          <div className="modal-action flex justify-between">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                (document.getElementById("update_prescription_modal") as HTMLDialogElement)?.close();
                reset();
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

export default UpdatePrescription;