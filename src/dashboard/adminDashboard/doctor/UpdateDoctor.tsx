import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { doctorsAPI } from "../../../features/doctor/doctorsAPI";
import type { TDoctor } from "../../../features/doctor/doctorsAPI";

type UpdateDoctorProps = {
  doctor: TDoctor | null;
  refetch: () => void;
};

type UpdateDoctorInputs = {
  doctorId: number;
  firstName: string;
  lastName: string;
  specialization: string;
  email?: string;
  contactPhone?: string;
  consultationFee?: number;
  availableDays?: string;
};

const schema: yup.ObjectSchema<UpdateDoctorInputs> = yup
  .object({
    doctorId: yup.number().required(),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    specialization: yup.string().required("Specialization is required"),
    email: yup.string().email("Invalid email format").optional(),
    contactPhone: yup.string().optional(),
    consultationFee: yup.number().positive("Fee must be positive").optional(),
    availableDays: yup.string().optional(),
  })
  .required();

const UpdateDoctor = ({ doctor, refetch }: UpdateDoctorProps) => {
  const [updateDoctor, { isLoading }] = doctorsAPI.useUpdateDoctorMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateDoctorInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      doctorId: 0,
      firstName: "",
      lastName: "",
      specialization: "",
      email: "",
      contactPhone: "",
      consultationFee: 0,
      availableDays: "",
    },
  });

  useEffect(() => {
    if (doctor) {
      // Parse availableDays if it's a JSON string
      let parsedAvailableDays = doctor.availableDays;
      if (typeof doctor.availableDays === 'string') {
        try {
          const parsed = JSON.parse(doctor.availableDays);
          if (Array.isArray(parsed)) {
            parsedAvailableDays = parsed.join(", ");
          }
        } catch {
          // Keep original string if parsing fails
        }
      }

      reset({
        doctorId: doctor.doctorId,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        specialization: doctor.specialization,
        email: doctor.email || "",
        contactPhone: doctor.contactPhone || "",
        consultationFee: doctor.consultationFee || 0,
        availableDays: parsedAvailableDays || "",
      });
    }
  }, [doctor, reset]);

  const onSubmit: SubmitHandler<UpdateDoctorInputs> = async (data) => {
    try {
      // Clean up the data before sending
      const cleanData = {
        doctorId: data.doctorId,
        firstName: data.firstName,
        lastName: data.lastName,
        specialization: data.specialization,
        email: data.email || undefined,
        contactPhone: data.contactPhone || undefined,
        consultationFee: data.consultationFee || undefined,
        availableDays: data.availableDays || undefined,
      };

      await updateDoctor(cleanData).unwrap();
      toast.success("Doctor updated successfully");
      refetch();
      reset();
      (document.getElementById("update_doctor_modal") as HTMLDialogElement)?.close();
    } catch (err: any) {
      console.error("Update doctor error:", err);
      const errorMessage = err?.data?.message || err?.message || "Failed to update doctor";
      toast.error(errorMessage);
    }
  };

  return (
    <dialog id="update_doctor_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Doctor</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input type="hidden" {...register("doctorId")} />

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
            placeholder="Contact Phone"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />

          <input
            type="number"
            {...register("consultationFee", { valueAsNumber: true })}
            placeholder="Consultation Fee"
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
                  Updating...
                </>
              ) : (
                "Update Doctor"
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                reset();
                (document.getElementById("update_doctor_modal") as HTMLDialogElement)?.close();
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

export default UpdateDoctor;