import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import { doctorsAPI, type TDoctor } from "../../../features/doctor/doctorsAPI";
import type { RootState } from "../../../app/store";
import UpdateDoctor from "./UpdateDoctor";
import CreateAppointment from "../../UserDashboard/appointment/BookAppointment";
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

  const handleSearch = () => {
    setSearchResults(null);
    if (searchSpecialization.trim()) {
      const filtered = doctorsData?.doctors?.filter((doc) =>
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

  const renderDoctorRow = (doctor: TDoctor) => (
    <tr key={doctor.doctorID} className="hover:bg-gray-200 border-b border-gray-400">
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.doctorID}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.firstName} {doctor.lastName}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.specialization}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.contactPhone || "-"}</td>
      <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{doctor.availableDays || "-"}</td>
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
        prefillDoctorID={doctorToBook?.doctorID}
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

      {isLoading && <p>Loading doctors...</p>}
      {error && <p className="text-red-600">Error fetching doctors.</p>}

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr className="bg-gray-700 text-white text-md lg:text-lg">
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Contact Phone</th>
              <th>Available Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchResults
              ? searchResults.map(renderDoctorRow)
              : doctorsData?.doctors?.map(renderDoctorRow)}
          </tbody>
        </table>
      </div>

      {!searchResults && !isLoading && doctorsData?.doctors?.length === 0 && (
        <p className="mt-4">No Doctors Found.</p>
      )}
    </div>
  );
};

export default AdminDoctors;