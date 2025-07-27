// src/pages/admin/Doctors.tsx
import { doctorsAPI } from "../../features/doctors/doctorsAPI";
import { DataTable } from "../../components/DataTable";
import { columns } from "./DoctorColumns";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import CreateDoctor from "./CreateDoctor";

export default function Doctors() {
  const { data: doctors, isLoading, error } = doctorsAPI.useGetDoctorsQuery();

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <CreateDoctor>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </CreateDoctor>
      </div>

      {isLoading && <p>Loading doctors...</p>}
      {error && <p className="text-red-500">Error loading doctors</p>}
      
      {doctors && (
        <DataTable 
          columns={columns} 
          data={doctors} 
          filterKey="specialization"
        />
      )}
    </div>
  );
}