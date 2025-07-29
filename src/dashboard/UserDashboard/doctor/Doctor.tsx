import { useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { doctorsAPI, type TDoctor } from "../../../features/doctor/doctorsAPI";
import type { RootState } from "../../../app/store";
import CreateAppointment from "../appointment/BookAppointment";

const UserDoctors = () => {
  const [searchSpecialization, setSearchSpecialization] = useState("");
  const [searchResults, setSearchResults] = useState<TDoctor[] | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);

  const userID = useSelector((state: RootState) => state.user.user?.userID);

  const { data: doctorsData, isLoading, error } = doctorsAPI.useGetDoctorsQuery(undefined, {
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
      <td>
        <button
          className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg"
          onClick={() => {
            setSelectedDoctor(doctor);
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
      <CreateAppointment
        refetch={doctorsAPI.useGetDoctorsQuery(undefined).refetch}
        prefillDoctorID={selectedDoctor?.doctorID}
        prefillUserID={userID}
      />

      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 mt-4">
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

export default UserDoctors;