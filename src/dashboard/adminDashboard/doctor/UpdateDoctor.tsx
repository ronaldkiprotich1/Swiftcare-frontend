
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
  doctorID: number;
  firstName: string;
  lastName: string;
  specialization: string;
  contactPhone?: string | null;
  availableDays?: string | null;
};


const schema: yup.ObjectSchema<UpdateDoctorInputs> = yup
  .object({
    doctorID: yup.number().required(),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    specialization: yup.string().required("Specialization is required"),
    contactPhone: yup.string().nullable(),
    availableDays: yup.string().nullable(),
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
      doctorID: doctor?.doctorID || 0,
      firstName: doctor?.firstName || "",
      lastName: doctor?.lastName || "",
      specialization: doctor?.specialization || "",
      contactPhone: doctor?.contactPhone || null,
      availableDays: doctor?.availableDays || null,
    },
  });

  useEffect(() => {
    if (doctor) {
      reset({
        doctorID: doctor.doctorID,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        specialization: doctor.specialization,
        contactPhone: doctor.contactPhone || null,
        availableDays: doctor.availableDays || null,
      });
    }
  }, [doctor, reset]);

  const onSubmit: SubmitHandler<UpdateDoctorInputs> = async (data) => {
    try {
      await updateDoctor(data).unwrap();
      toast.success("Doctor updated successfully");
      refetch();
      reset();
      (document.getElementById("update_doctor_modal") as HTMLDialogElement)?.close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update doctor");
    }
  };

  return (
    <dialog id="update_doctor_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Doctor</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input type="hidden" {...register("doctorID")} />

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
            placeholder="Contact Phone"
            className="input rounded w-full p-2 bg-white text-gray-800"
          />

          <input
            type="text"
            {...register("availableDays")}
            placeholder="Available Days"
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
                (document.getElementById("update_doctor_modal") as HTMLDialogElement)?.close()
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

export default UpdateDoctor;