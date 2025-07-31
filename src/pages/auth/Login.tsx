import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from 'framer-motion';
import { loginAPI } from "../../features/login/loginAPI";
import { loginSuccess } from "../../features/users/userSlice";
 // Update path as needed

type LoginInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .max(100, "Max 100 characters")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Min 8 characters")
    .max(100, "Max 100 characters")
    .required("Password is required"),
});

const DotsLoader = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 bg-white rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = loginAPI.useLoginUserMutation();
  const emailFormState = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFormState,
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    console.log("Login attempt with data:", data);
    try {
      const response = await loginUser(data).unwrap();
      
      // Log the full response to see what we're getting
      console.log("Login response:", response);
      
      // Prepare user data for Redux store
      

      // Dispatch login success with properly formatted data
      dispatch(loginSuccess(response))

    

      toast.success("Login was successful");

      // Navigate based on role
      if (response.user.role === "admin") {
        navigate("/admin/dashboard/users");
      } else if (response.user.role === "doctor") {
        navigate("/doctor/dashboard/appointments");
      } else {
        navigate("/user/dashboard/appointments");
      }
    } catch (error: any) {
      console.log("Login Error:", error);
      toast.error(error?.data?.message || error?.data?.error || "Error logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      {isLoading ? (
        <div className="flex flex-col gap-4 items-center">
          <span className="loading loading-bars loading-xl text-blue-500"></span>
          <p className="text-center text-2xl font-semibold text-blue-600">
            Logging in, Please wait..
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-2xl flex flex-col w-full max-w-lg p-8 rounded-md">
          <div>
            <h2 className="text-center font-semibold text-xl text-blue-600 md:text-2xl">
              Login to SwiftCare
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full mt-4"
          >
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
              readOnly={!!emailFormState}
            />
            {errors.email && (
              <span className="text-rose-500 text-sm">
                {errors.email.message}
              </span>
            )}
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
            />
            {errors.password && (
              <span className="text-rose-500 text-sm">
                {errors.password.message}
              </span>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded-md mt-4 text-white h-12 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? <DotsLoader /> : 'Login'}
            </button>
          </form>
          <div className="mt-4">
            Don&apos;t have an account?{" "}
            <span className="text-sm text-blue-500 cursor-pointer">
              <NavLink to={"/register"}>Register</NavLink>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;