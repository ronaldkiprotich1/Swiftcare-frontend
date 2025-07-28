import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaUserCheck } from "react-icons/fa";
import { toast } from "sonner";

// Define the schema for form validation using Zod
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
});

// Type for form data
type ProfileFormData = z.infer<typeof profileSchema>;

// Mock API functions (replace with actual API calls)
const fetchPatientProfile = async () => {
  // Simulate API call to fetch user data
  return {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    contactPhone: "+1234567890",
    address: "123 Main St, City",
  };
};

const updatePatientProfile = async (data: ProfileFormData) => {
  // Simulate API call
  console.log("Updating patient profile with:", data);
  return { success: true };
};

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchPatientProfile();
        reset(profileData); // Populate form with fetched data
      } catch (error) {
        toast.error("Failed to load profile data");
      }
    };
    loadProfile();
  }, [reset]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const response = await updatePatientProfile(data);
      if (response.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center space-x-3 mb-6">
            <FaUserCheck size={30} className="text-primary" />
            <h2 className="card-title text-2xl">Patient Profile</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.firstName ? "input-error" : ""}`}
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="text-error text-sm">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.lastName ? "input-error" : ""}`}
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="text-error text-sm">{errors.lastName.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-error text-sm">{errors.email.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Contact Phone</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.contactPhone ? "input-error" : ""}`}
                {...register("contactPhone")}
              />
              {errors.contactPhone && (
                <span className="text-error text-sm">{errors.contactPhone.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.address ? "input-error" : ""}`}
                {...register("address")}
              />
              {errors.address && (
                <span className="text-error text-sm">{errors.address.message}</span>
              )}
            </div>

            <div className="card-actions justify-end">
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;