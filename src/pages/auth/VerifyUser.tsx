import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

type VerifyInputs = {
  email: string;
  code: string;
};

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  code: yup
    .string()
    .matches(/^\d{6}$/, 'Code must be a 6 digit number')
    .required('Verification code is required'),
});

const VerifyUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [emailEditable, setEmailEditable] = useState(!emailFromState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerifyInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFromState,
    },
  });

  const onSubmit: SubmitHandler<VerifyInputs> = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Account verified successfully!');
        setIsVerified(true);
        setTimeout(() => {
          navigate('/login', {
            state: { email: data.email },
          });
        }, 3000);
      } else {
        toast.error(result.error || 'Verification failed. Try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-white">
        {isVerified ? (
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle size={48} className="text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">Verification Successful!</h2>
            <p className="text-gray-600">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Verify Your Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Email"
                  readOnly={!emailEditable}
                  className={`input border w-full p-2 rounded text-lg ${
                    emailEditable
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                      : 'bg-gray-100 cursor-not-allowed border-gray-200'
                  }`}
                />
                {!emailEditable && (
                  <button
                    type="button"
                    className="text-blue-500 text-sm absolute top-2 right-2 underline"
                    onClick={() => {
                      setEmailEditable(true);
                      setValue('email', '');
                    }}
                  >
                    Change?
                  </button>
                )}
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  {...register('code')}
                  placeholder="6 Digit Code"
                  maxLength={6}
                  className="input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg"
                />
                {errors.code && (
                  <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner text-white" /> Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyUser;
