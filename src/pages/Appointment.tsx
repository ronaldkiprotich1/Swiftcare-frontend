// src/pages/Appointment.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Doctor {
  doctorId: number;
  firstName: string;
  lastName: string;
  specialization: string;
}

const Appointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/api/doctors")
      .then((res) => res.json())
      .then(setDoctors)
      .catch((err) => console.error("Failed to fetch doctors:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !appointmentDate || !timeSlot) return alert("All fields are required");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          doctorId,
          appointmentDate,
          timeSlot,
          notes,
        }),
      });

      if (res.ok) {
        alert("Appointment booked successfully!");
        navigate("/"); // or navigate to success/payment page
      } else {
        const err = await res.json();
        alert("Failed to book: " + err.error);
      }
    } catch (err) {
      alert("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-12 px-4 bg-blue-50">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Book an Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Select */}
          <div>
            <label className="label font-medium">Choose a Doctor</label>
            <select
              className="select select-bordered w-full"
              value={doctorId ?? ""}
              onChange={(e) => setDoctorId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                -- Select a doctor --
              </option>
              {doctors.map((doc) => (
                <option key={doc.doctorId} value={doc.doctorId}>
                  Dr. {doc.firstName} {doc.lastName} – {doc.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="label font-medium">Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="label font-medium">Time</label>
            <input
              type="time"
              className="input input-bordered w-full"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="label font-medium">Additional Notes</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Appointment;
