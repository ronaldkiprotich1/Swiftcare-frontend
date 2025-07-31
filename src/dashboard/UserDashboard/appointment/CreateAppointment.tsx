import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { appointmentsAPI } from "../../../features/appointments/appointmentsAPI";
import { toast } from "sonner";
import type { RootState } from "../../../app/store";

interface CreateAppointmentProps {
  refetch: () => void;
}

// Mock doctors data since the API endpoint doesn't exist yet
const mockDoctors = [
  { doctorId: 1, name: "John", lastName: "Smith", specialization: "Cardiologist", consultationFee: 5000 },
  { doctorId: 2, name: "Sarah", lastName: "Johnson", specialization: "Pediatrician", consultationFee: 3500 },
  { doctorId: 3, name: "Michael", lastName: "Brown", specialization: "Dermatologist", consultationFee: 4000 },
  { doctorId: 4, name: "Emily", lastName: "Davis", specialization: "Neurologist", consultationFee: 6000 },
  { doctorId: 5, name: "David", lastName: "Wilson", specialization: "Orthopedic", consultationFee: 4500 },
];

const CreateAppointment = ({ refetch }: CreateAppointmentProps) => {
  const [formData, setFormData] = useState({
    doctorID: 0,
    appointmentDate: "",
    timeSlot: "",
    totalAmount: 0,
    notes: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.user.user?.userId);
  const [createAppointment, { isLoading }] = appointmentsAPI.useCreateAppointmentMutation();

  // Clear form when modal opens
  useEffect(() => {
    const modal = document.getElementById("create_appointment_modal") as HTMLDialogElement;
    
    const handleModalOpen = () => {
      setIsModalOpen(true);
      // Clear form data when modal opens
      setFormData({
        doctorID: 0,
        appointmentDate: "",
        timeSlot: "",
        totalAmount: 0,
        notes: "",
      });
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
      // Clear form data when modal closes
      setFormData({
        doctorID: 0,
        appointmentDate: "",
        timeSlot: "",
        totalAmount: 0,
        notes: "",
      });
    };

    if (modal) {
      modal.addEventListener('show', handleModalOpen);
      modal.addEventListener('close', handleModalClose);

      return () => {
        modal.removeEventListener('show', handleModalOpen);
        modal.removeEventListener('close', handleModalClose);
      };
    }
  }, []);

  const resetForm = () => {
    setFormData({
      doctorID: 0,
      appointmentDate: "",
      timeSlot: "",
      totalAmount: 0,
      notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    if (!formData.doctorID || !formData.appointmentDate || !formData.timeSlot) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const appointmentData = {
        userID: userId,
        doctorID: formData.doctorID,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        totalAmount: formData.totalAmount,
        appointmentStatus: "Pending" as const,
        notes: formData.notes || null,
      };

      console.log("Creating appointment with data:", appointmentData);

      await createAppointment(appointmentData).unwrap();

      toast.success("Appointment created successfully!");
      resetForm();
      refetch();
      (document.getElementById("create_appointment_modal") as HTMLDialogElement)?.close();
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      
      // Better error handling
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create appointment. Please try again.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "doctorID") {
      const doctorId = Number(value);
      const selectedDoctor = mockDoctors.find(doctor => doctor.doctorId === doctorId);
      
      setFormData(prev => ({
        ...prev,
        doctorID: doctorId,
        totalAmount: selectedDoctor ? selectedDoctor.consultationFee : 0
      }));
    } else if (name === "totalAmount") {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCancel = () => {
    resetForm();
    (document.getElementById("create_appointment_modal") as HTMLDialogElement)?.close();
  };

  // Get tomorrow's date as minimum date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <dialog id="create_appointment_modal" className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <form method="dialog">
          <button 
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleCancel}
          >
            ✕
          </button>
        </form>
        
        <h3 className="font-bold text-lg mb-4 text-gray-800">Book New Appointment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctor Selection */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Select Doctor *</span>
              </label>
              <select
                name="doctorID"
                value={formData.doctorID || ""}
                onChange={handleChange}
                className="select select-bordered w-full bg-white"
                required
              >
                <option value="">Choose a doctor</option>
                {mockDoctors.map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    Dr. {doctor.name} {doctor.lastName} - {doctor.specialization} (${doctor.consultationFee})
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Appointment Date *</span>
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="input input-bordered w-full bg-white"
                required
                min={getTomorrowDate()}
              />
            </div>

            {/* Time Slot */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Time Slot *</span>
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="select select-bordered w-full bg-white"
                required
              >
                <option value="">Select time</option>
                <option value="09:00:00">09:00 AM</option>
                <option value="09:30:00">09:30 AM</option>
                <option value="10:00:00">10:00 AM</option>
                <option value="10:30:00">10:30 AM</option>
                <option value="11:00:00">11:00 AM</option>
                <option value="11:30:00">11:30 AM</option>
                <option value="14:00:00">02:00 PM</option>
                <option value="14:30:00">02:30 PM</option>
                <option value="15:00:00">03:00 PM</option>
                <option value="15:30:00">03:30 PM</option>
                <option value="16:00:00">04:00 PM</option>
                <option value="16:30:00">04:30 PM</option>
              </select>
            </div>

            {/* Total Amount */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Consultation Fee</span>
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount || ""}
                onChange={handleChange}
                className="input input-bordered w-full bg-white"
                placeholder="Auto-filled when doctor selected"
                min="0"
                step="0.01"
                readOnly={formData.doctorID > 0}
              />
            </div>

            {/* Status Display */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Status</span>
              </label>
              <input
                type="text"
                value="Pending"
                className="input input-bordered w-full bg-gray-100"
                readOnly
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Notes (Optional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-white"
              placeholder="Add any additional notes or symptoms..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="modal-action pt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleCancel}>close</button>
      </form>
    </dialog>
  );
};

export default CreateAppointment;