// src/components/user/ChangeRole.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { useEffect } from "react";
import { useUpdateUserRoleMutation, type TUser } from "../../../features/users/userAPI";

type ChangeRoleProps = {
  user: TUser | null;
};

type ChangeRoleInputs = {
  role: "user" | "admin" | "doctor";
};

const schema = yup.object({
  role: yup.string().oneOf(["user", "admin", "doctor"]).required("Role is required"),
});

const ChangeRole = ({ user }: ChangeRoleProps) => {
  // Debug: Log when component receives new user prop
  useEffect(() => {
    console.log('🎭 ChangeRole component received user:', user);
  }, [user]);

  // Fixed: Use the exported hook directly, not from usersAPI object
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ChangeRoleInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: user ? (user.role as "user" | "admin" | "doctor") : "user",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("role", user.role as "user" | "admin" | "doctor");
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const closeModal = () => {
    const modal = document.getElementById("role_modal") as HTMLDialogElement;
    if (modal) {
      modal.close(); // Use close() method for dialog elements
    }
    reset();
  };

  const onSubmit: SubmitHandler<ChangeRoleInputs> = async (data) => {
    console.log('🔥 FORM SUBMITTED!', { data, user }); // Debug log
    
    try {
      if (!user) {
        console.log('❌ No user selected');
        toast.error("No user selected for role change.");
        return;
      }

      console.log('✅ About to update user role:', { 
        userId: user.userId, 
        role: data.role,
        currentRole: user.role 
      });

      // Check if role is actually different
      if (user.role === data.role) {
        toast.info(`User already has the ${data.role} role.`);
        closeModal();
        return;
      }

      const result = await updateUserRole({
        userId: user.userId,
        role: data.role,
      }).unwrap();

      console.log('✅ Role update successful:', result);
      toast.success(`Role updated successfully from ${user.role} to ${data.role}!`);
      closeModal();
    } catch (error: any) {
      console.error("❌ Error updating role:", error);
      
      // Better error handling
      let errorMessage = "Failed to update role. Please try again.";
      if (error?.status === 404) {
        errorMessage = "User not found.";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  // Don't render if no user is selected
  if (!user) {
    console.log('🚫 ChangeRole: No user provided, not rendering modal');
    return (
      <dialog className="modal" id="role_modal">
        <div className="modal-box">
          <p>No user selected</p>
        </div>
      </dialog>
    );
  }

  console.log('✅ ChangeRole: Rendering modal for user:', user.firstName, user.lastName);

  return (
    <dialog className="modal" id="role_modal" style={{ zIndex: 1000 }}>
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg relative">
        <form method="dialog">
          <button 
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white hover:bg-gray-700"
            onClick={() => {
              console.log('❌ Close button clicked');
              closeModal();
            }}
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mb-4">
          Change Role for {user.firstName} {user.lastName}
        </h3>

        <div className="mb-4 p-3 bg-gray-700 rounded">
          <p className="text-sm">
            <span className="font-semibold">Current Role:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              user.role === 'admin' ? 'bg-red-600' : 
              user.role === 'doctor' ? 'bg-blue-600' : 'bg-green-600'
            }`}>
              {user.role.toUpperCase()}
            </span>
          </p>
          <p className="text-sm mt-1">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-white font-semibold block mb-2">Select New Role:</label>
            <select
              {...register("role")}
              className="select select-bordered w-full bg-white text-black"
              onChange={(e) => {
                console.log('🔄 Role changed to:', e.target.value);
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          
          {errors.role && (
            <span className="text-sm text-red-400">{errors.role.message}</span>
          )}

          <div className="modal-action flex flex-col sm:flex-row gap-2 mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={isLoading}
              onClick={() => console.log('🖱️ Submit button clicked!')}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </button>
            
            <button
              className="btn btn-outline w-full sm:w-auto"
              type="button"
              onClick={() => {
                console.log('🖱️ Cancel button clicked!');
                closeModal();
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal backdrop - clicking outside closes modal */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
};

export default ChangeRole;