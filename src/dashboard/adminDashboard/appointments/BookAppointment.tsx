import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { appointmentsAPI } from "../../../features/appointments/appointmentsAPI";

type CreateAppointmentProps = {
  refetch: () => void;
};

type CreateAppointmentInputs = {
  userID: number;
  doctorID: number;
  appointmentDate: string;
  timeSlot: string;
  totalAmount: number;
};

const schema = yup.object({
  userID: yup.number().required("User ID is required").positive("Must be positive"),
  doctorID: yup.number().required("Doctor ID is required").positive("Must be positive"),
  appointmentDate: yup.string().required("Appointment date is required"),
  timeSlot: yup.string().required("Time slot is required"),
  totalAmount: yup.number().positive("Amount must be positive").required(),
});

const CreateAppointment = ({ refetch }: CreateAppointmentProps) => {
  const [createAppointment, { isLoading }] = appointmentsAPI.useCreateAppointmentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAppointmentInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateAppointmentInputs> = async (data) => {
    try {
      await createAppointment(data).unwrap();
      toast.success("Appointment created successfully");
      reset();
      refetch();
      (document.getElementById("create_appointment_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment. Please try again.");
    }
  };

  return (
    <dialog id="create_appointment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create Appointment</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="number"
            {...register("userID")}
            placeholder="User ID"
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.userID && <span className="text-sm text-red-700">{errors.userID.message}</span>}

          <input
            type="number"
            {...register("doctorID")}
            placeholder="Doctor ID"
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.doctorID && <span className="text-sm text-red-700">{errors.doctorID.message}</span>}

          <input
            type="date"
            {...register("appointmentDate")}
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.appointmentDate && (
            <span className="text-sm text-red-700">{errors.appointmentDate.message}</span>
          )}

          <input
            type="time"
            {...register("timeSlot")}
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.timeSlot && (
            <span className="text-sm text-red-700">{errors.timeSlot.message}</span>
          )}

          <input
            type="number"
            step="0.01"
            {...register("totalAmount")}
            placeholder="Total Amount"
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.totalAmount && (
            <span className="text-sm text-red-700">{errors.totalAmount.message}</span>
          )}

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-bars loading-xl" /> Booking...
                </>
              ) : (
                "Book"
              )}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (document.getElementById("create_appointment_modal") as HTMLDialogElement)?.close();
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

export default CreateAppointment;