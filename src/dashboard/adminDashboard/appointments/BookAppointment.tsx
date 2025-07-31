import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { useEffect } from "react";
import { appointmentsAPI } from "../../../features/appointments/appointmentsAPI";

type CreateAppointmentProps = {
  refetch: () => void;
  prefillDoctorID?: number;
  prefillUserID?: number;
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

const CreateAppointment = ({ refetch, prefillDoctorID, prefillUserID }: CreateAppointmentProps) => {
  const [createAppointment, { isLoading }] = appointmentsAPI.useCreateAppointmentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAppointmentInputs>({
    resolver: yupResolver(schema),
  });

  // Effect to prefill form when modal opens with selected doctor/user
  useEffect(() => {
    if (prefillDoctorID) {
      setValue("doctorID", prefillDoctorID);
    }
    if (prefillUserID) {
      setValue("userID", prefillUserID);
    }
  }, [prefillDoctorID, prefillUserID, setValue]);

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

  const handleClose = () => {
    (document.getElementById("create_appointment_modal") as HTMLDialogElement)?.close();
    reset();
    // Clear prefilled values when closing
    setTimeout(() => {
      setValue("doctorID", 0);
      setValue("userID", 0);
    }, 100);
  };

  return (
    <dialog id="create_appointment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create Appointment</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <input
              type="number"
              {...register("userID")}
              placeholder="User ID"
              className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
            />
            {errors.userID && <span className="text-sm text-red-700">{errors.userID.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Doctor ID</label>
            <input
              type="number"
              {...register("doctorID")}
              placeholder="Doctor ID"
              className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
            />
            {errors.doctorID && <span className="text-sm text-red-700">{errors.doctorID.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Appointment Date</label>
            <input
              type="date"
              {...register("appointmentDate")}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
            />
            {errors.appointmentDate && (
              <span className="text-sm text-red-700">{errors.appointmentDate.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Slot</label>
            <select
              {...register("timeSlot")}
              className="select rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
            >
              <option value="">Select time slot</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
            {errors.timeSlot && (
              <span className="text-sm text-red-700">{errors.timeSlot.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Total Amount (KSh)</label>
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
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-bars loading-xl" /> Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </button>
            <button
              className="btn"
              type="button"
              onClick={handleClose}
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