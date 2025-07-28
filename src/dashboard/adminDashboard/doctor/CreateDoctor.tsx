
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { doctorsAPI } from "../../../features/doctor/doctorsAPI";

type CreateDoctorProps = {
  refetch: () => void;
};

type CreateDoctorInputs = {
  userID: number;
  firstName: string;
  lastName: string;
  specialization: string;
  contactPhone?: string | null;
  availableDays?: string | null;
};


const schema: yup.ObjectSchema<CreateDoctorInputs> = yup
  .object({
    userID: yup.number().required("User ID is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    specialization: yup.string().required("Specialization is required"),
    contactPhone: yup.string().nullable(),
    availableDays: yup.string().nullable(),
  })
  .required();

const CreateDoctor = ({ refetch }: CreateDoctorProps) => {
  const [createDoctor, { isLoading }] = doctorsAPI.useCreateDoctorMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDoctorInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      contactPhone: null,
      availableDays: null,
    },
  });

  const onSubmit: SubmitHandler<CreateDoctorInputs> = async (data) => {
    try {
      await createDoctor(data).unwrap();
      toast.success("Doctor created successfully");
      refetch();
      reset();
      (document.getElementById("create_doctor_modal") as HTMLDialogElement)?.close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create doctor");
    }
  };

  return (
    <dialog id="create_doctor_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create Doctor</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="number"
            {...register("userID")}
            placeholder="User ID"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
           {errors.userID && (
            <span className="text-sm text-red-700">{errors.userID.message}</span>
          )}
          <input
            type="text"
            {...register("firstName")}
            placeholder="First Name"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.firstName && (
            <span className="text-sm text-red-700">{errors.firstName.message}</span>
          )}

          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.lastName && (
            <span className="text-sm text-red-700">{errors.lastName.message}</span>
          )}

          <input
            type="text"
            {...register("specialization")}
            placeholder="Specialization"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.specialization && (
            <span className="text-sm text-red-700">{errors.specialization.message}</span>
          )}

          <input
            type="text"
            {...register("contactPhone")}
            placeholder="Contact Phone (optional)"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />

          <input
            type="text"
            {...register("availableDays")}
            placeholder="Available Days (optional)"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-bars loading-xl" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() =>
                (document.getElementById("create_doctor_modal") as HTMLDialogElement)?.close()
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

export default CreateDoctor;