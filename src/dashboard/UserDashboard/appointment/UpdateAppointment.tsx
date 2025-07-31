import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { appointmentsAPI, type TAppointment } from "../../../features/appointments/appointmentsAPI";
import { toast } from "sonner";
import type { RootState } from "../../../app/store";

interface UpdateAppointmentProps {
  appointment: TAppointment | null;
  refetch: () => void;
}

const UpdateAppointment = ({ appointment, refetch }: UpdateAppointmentProps) => {
  const [formData, setFormData] = useState({
    doctorID: 0,
    appointmentDate: "",
    timeSlot: "",
    totalAmount: 0,
    appointmentStatus: "Pending" as "Pending" | "Confirmed" | "Completed" | "Cancelled",
    notes: "",
    cancellationReason: "",
  });

  const userId = useSelector((state: RootState) => state.user.user?.userId);
  const [updateAppointment, { isLoading }] = appointmentsAPI.useUpdateAppointmentMutation();

  useEffect(() => {
    if (appointment) {
      setFormData({
        doctorID: appointment.doctorID,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
        totalAmount: appointment.totalAmount || 0,
        appointmentStatus: appointment.appointmentStatus,
        notes: appointment.notes || "",
        cancellationReason: appointment.cancellationReason || "",
      });
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointment) {
      toast.error("No appointment selected");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    if (!formData.doctorID || !formData.appointmentDate || !formData.timeSlot) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateAppointment({
        appointmentID: appointment.appointmentID,
        userID: userId,
        doctorID: formData.doctorID,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        totalAmount: formData.totalAmount,
        appointmentStatus: formData.appointmentStatus,
        notes: formData.notes || null,
        cancellationReason: formData.appointmentStatus === "Cancelled" ? formData.cancellationReason : null,
      }).unwrap();

      toast.success("Appointment updated successfully!");
      refetch();
      (document.getElementById("update_appointment_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "doctorID" || name === "totalAmount" ? Number(value) : value
    }));
  };

  if (!appointment) return null;

  return (
    <dialog id="update_appointment_modal" className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 className="font-bold text-lg mb-4">Update Appointment #{appointment.appointmentID}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Doctor ID *</span>
              </label>
              <input
                type="number"
                name="doctorID"
                value={formData.doctorID || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter doctor ID"
                required
                min="1"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Appointment Date *</span>
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Time Slot *</span>
              </label>
              <input
                type="time"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Total Amount</span>
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Status *</span>
              </label>
              <select
                name="appointmentStatus"
                value={formData.appointmentStatus}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Notes</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          {formData.appointmentStatus === "Cancelled" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Cancellation Reason</span>
              </label>
              <textarea
                name="cancellationReason"
                value={formData.cancellationReason}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                placeholder="Please provide a reason for cancellation..."
                rows={2}
              />
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => (document.getElementById("update_appointment_modal") as HTMLDialogElement)?.close()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                "Update Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateAppointment;