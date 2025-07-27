import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { appointmentsAPI } from "../../../../features/appointments/appointmentsAPI";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

type UpdateAppointmentProps = {
  appointment: any | null;
  refetch: () => void;
};

const statusOptions = ["Pending", "Confirmed", "Cancelled", "Completed"] as const;
type AppointmentStatus = typeof statusOptions[number];

type UpdateAppointmentInputs = {
  appointmentDate: string;
  timeSlot: string;
  appointmentStatus: AppointmentStatus;
  totalAmount: number;
  notes?: string;
};

const schema = yup.object({
  appointmentDate: yup.string().required("Appointment date is required"),
  timeSlot: yup.string().required("Time slot is required"),
  appointmentStatus: yup.string().oneOf([...statusOptions]).required("Status is required"),
  totalAmount: yup
    .number()
    .typeError("Total amount must be a number")
    .positive("Total amount must be positive")
    .required("Total amount is required"),
  notes: yup.string().optional(),
}).required();

const timeSlots = [
  "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00",
  "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00", "16:30:00"
];

const UpdateAppointment = ({ appointment, refetch }: UpdateAppointmentProps) => {
  const [updateAppointment, { isLoading }] = appointmentsAPI.useUpdateAppointmentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateAppointmentInputs>({
    resolver: yupResolver(schema) as any, // Temporary type assertion to fix the resolver error
    defaultValues: {
      appointmentDate: "",
      timeSlot: "",
      appointmentStatus: "Pending",
      totalAmount: 0,
      notes: "",
    }
  });

  useEffect(() => {
    if (appointment) {
      setValue("appointmentDate", appointment.appointmentDate?.slice(0, 10) || "");
      setValue("timeSlot", appointment.timeSlot || "");
      setValue("appointmentStatus", appointment.appointmentStatus || "Pending");
      setValue("totalAmount", parseFloat(appointment.totalAmount) || 0);
      setValue("notes", appointment.notes || "");
    }
  }, [appointment, setValue]);

  const onSubmit: SubmitHandler<UpdateAppointmentInputs> = async (data) => {
    try {
      if (!appointment) {
        toast.error("No appointment selected for update.");
        return;
      }

      const payload = {
        appointmentId: appointment.appointmentId,
        appointmentDate: data.appointmentDate,
        timeSlot: data.timeSlot,
        appointmentStatus: data.appointmentStatus,
        totalAmount: data.totalAmount.toString(),
        notes: data.notes,
      };

      await updateAppointment(payload).unwrap();
      toast.success("Appointment updated successfully!");
      refetch();
      (document.getElementById("update_appointment_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment. Please try again.");
    }
  };

  const formatTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <dialog id="update_appointment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-white" />
            <h3 className="font-bold text-lg text-white">Update Appointment</h3>
          </div>
          <p className="text-teal-100 text-sm mt-1">
            ID: {appointment?.appointmentId}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit as SubmitHandler<UpdateAppointmentInputs>)} className="flex flex-col gap-4">
          {/* Rest of your form fields remain the same */}
          {/* ... */}
        </form>
      </div>
    </dialog>
  );
};

export default UpdateAppointment;