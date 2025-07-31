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
  email?: string;
  contactPhone?: string;
  consultationFee?: number;
  availableDays?: string;
};

const schema: yup.ObjectSchema<CreateDoctorInputs> = yup
  .object({
    userID: yup.number().required("User ID is required").positive("User ID must be positive"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    specialization: yup.string().required("Specialization is required"),
    email: yup.string().email("Invalid email format").optional(),
    contactPhone: yup.string().optional(),
    consultationFee: yup.number().positive("Fee must be positive").optional(),
    availableDays: yup.string().optional(),
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
      userID: 0,
      firstName: "",
      lastName: "",
      specialization: "",
      email: "",
      contactPhone: "",
      consultationFee: 0,
      availableDays: "",
    },
  });

  const onSubmit: SubmitHandler<CreateDoctorInputs> = async (data) => {
    try {
      // Clean up the data before sending
      const cleanData = {
        ...data,
        email: data.email || undefined,
        contactPhone: data.contactPhone || undefined,
        consultationFee: data.consultationFee || undefined,
        availableDays: data.availableDays || undefined,
      };

      await createDoctor(cleanData).unwrap();
      toast.success("Doctor created successfully");
      refetch();
      reset();
      (document.getElementById("create_doctor_modal") as HTMLDialogElement)?.close();
    } catch (err: any) {
      console.error("Create doctor error:", err);
      const errorMessage = err?.data?.message || err?.message || "Failed to create doctor";
      toast.error(errorMessage);
    }
  };

  return (
    <dialog id="create_doctor_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create Doctor</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="number"
            {...register("userID", { valueAsNumber: true })}
            placeholder="User ID"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.userID && (
            <span className="text-sm text-red-400">{errors.userID.message}</span>
          )}

          <input
            type="text"
            {...register("firstName")}
            placeholder="First Name"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.firstName && (
            <span className="text-sm text-red-400">{errors.firstName.message}</span>
          )}

          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.lastName && (
            <span className="text-sm text-red-400">{errors.lastName.message}</span>
          )}

          <input
            type="text"
            {...register("specialization")}
            placeholder="Specialization"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.specialization && (
            <span className="text-sm text-red-400">{errors.specialization.message}</span>
          )}

          <input
            type="email"
            {...register("email")}
            placeholder="Email (optional)"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.email && (
            <span className="text-sm text-red-400">{errors.email.message}</span>
          )}

          <input
            type="tel"
            {...register("contactPhone")}
            placeholder="Contact Phone (optional)"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />

          <input
            type="number"
            {...register("consultationFee", { valueAsNumber: true })}
            placeholder="Consultation Fee (optional)"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />
          {errors.consultationFee && (
            <span className="text-sm text-red-400">{errors.consultationFee.message}</span>
          )}

          <input
            type="text"
            {...register("availableDays")}
            placeholder="Available Days (e.g., Monday,Tuesday,Wednesday)"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2" />
                  Creating...
                </>
              ) : (
                "Create Doctor"
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                reset();
                (document.getElementById("create_doctor_modal") as HTMLDialogElement)?.close();
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

export default CreateDoctor;