import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import { doctorsAPI, type TDoctor } from "../../../features/doctor/doctorsAPI";
import type { RootState } from "../../../app/store";
import UpdateDoctor from "./UpdateDoctor";
import CreateAppointment from "../../UserDashboard/appointment/CreateAppointment";
import DeleteDoctor from "./DeleteDoctor";
import CreateDoctor from "./CreateDoctor";

const AdminDoctors = () => {
  const [searchSpecialization, setSearchSpecialization] = useState("");
  const [searchResults, setSearchResults] = useState<TDoctor[] | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<TDoctor | null>(null);
  const [doctorToBook, setDoctorToBook] = useState<TDoctor | null>(null);

  const userID = useSelector((state: RootState) => state.user.user?.userID);

  const { data: doctorsData, isLoading, error, refetch } = doctorsAPI.useGetDoctorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  // Debug: Log the error to see what's happening
  console.log("Doctors API Error:", error);
  console.log("Doctors Data:", doctorsData);

  const handleSearch = () => {
    setSearchResults(null);
    if (searchSpecialization.trim()) {
      // doctorsData is now directly an array, not wrapped in an object
      const filtered = doctorsData?.filter((doc) =>
        doc.specialization.toLowerCase().includes(searchSpecialization.toLowerCase())
      );
      if (!filtered || filtered.length === 0) {
        toast.error("No doctors found for this specialization.");
      } else {
        setSearchResults(filtered);
      }
    } else {
      toast.info("Enter a specialization to search.");
    }
  };

  const handleRetry = () => {
    refetch();
    toast.info("Retrying to fetch doctors...");
  };

  const renderDoctorRow = (doctor: TDoctor) => (
    <tr key={doctor.doctorId} className="hover:bg-gray-200 border-b border-gray-400">
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.doctorId}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.firstName} {doctor.lastName}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.specialization}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.contactPhone || "-"}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
        {doctor.availableDays ? JSON.parse(doctor.availableDays).join(", ") : "-"}
      </td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
        {doctor.consultationFee ? `KSh ${doctor.consultationFee}` : "-"}
      </td>
      <td className="flex flex-wrap gap-1">
        <button
          className="btn btn-xs btn-primary"
          onClick={() => {
            setSelectedDoctor(doctor);
            (document.getElementById("update_doctor_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <FaEdit size={16} />
        </button>
        <button
          className="btn btn-xs btn-error text-red-500"
          onClick={() => {
            setDoctorToDelete(doctor);
            (document.getElementById("delete_doctor_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <MdDeleteForever size={16} />
        </button>
        <button
          className="btn btn-xs bg-gray-700 text-white"
          onClick={() => {
            setDoctorToBook(doctor);
            (document.getElementById("create_appointment_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          Book Appointment
        </button>
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      <CreateDoctor refetch={refetch} />
      <UpdateDoctor doctor={selectedDoctor} refetch={refetch} />
      <DeleteDoctor doctor={doctorToDelete} refetch={refetch} />
      <CreateAppointment
        refetch={refetch}
        prefillDoctorID={doctorToBook?.doctorId} // Changed from doctorID to doctorId
        prefillUserID={userID}
      />

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 mt-4">
        <button
          className="btn bg-gray-700 text-white"
          onClick={() =>
            (document.getElementById("create_doctor_modal") as HTMLDialogElement)?.showModal()
          }
        >
          Create Doctor
        </button>

        <input
          type="text"
          value={searchSpecialization}
          onChange={(e) => setSearchSpecialization(e.target.value)}
          placeholder="Search by Specialization"
          className="input input-bordered bg-white text-black"
        />
        <button className="btn btn-primary text-white" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-2">Loading doctors...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <div className="flex flex-col">
            <span>Error fetching doctors. Please check your connection and try again.</span>
            <div className="mt-2">
              <button className="btn btn-sm btn-outline" onClick={handleRetry}>
                Retry
              </button>
            </div>
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Error Details</summary>
                <pre className="text-xs mt-1 bg-base-200 p-2 rounded">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr className="bg-gray-700 text-white text-md lg:text-lg">
                <th>Doctor ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Contact Phone</th>
                <th>Available Days</th>
                <th>Consultation Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults
                ? searchResults.map(renderDoctorRow)
                : doctorsData?.map(renderDoctorRow)}
            </tbody>
          </table>
        </div>
      )}

      {!searchResults && !isLoading && !error && doctorsData?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No Doctors Found.</p>
          <button
            className="btn btn-primary"
            onClick={() =>
              (document.getElementById("create_doctor_modal") as HTMLDialogElement)?.showModal()
            }
          >
            Create First Doctor
          </button>
        </div>
      )}

      {!searchResults && !isLoading && !error && (doctorsData?.length ?? 0) > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {doctorsData?.length} doctor(s)
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;