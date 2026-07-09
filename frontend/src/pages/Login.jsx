import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register, reset, googleLogin } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientId = rawGoogleClientId && rawGoogleClientId !== 'your-google-oauth-client-id.apps.googleusercontent.com' && rawGoogleClientId.trim() !== '' ? rawGoogleClientId : null;

const Login = () => {
  const location = useLocation();
  const isSignupRoute = location.pathname === '/signup';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    setStep(1);
  }, [location.pathname]);

  useEffect(() => {
    if (isSuccess && isAuthenticated) {
      navigate('/dashboard');
      dispatch(reset());
      return;
    }

    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, isSuccess, message, isAuthenticated, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignupRoute) {
      if (!name.trim() || !password) {
        toast.error('Please fill in all fields');
        return;
      }

      try {
        const result = await dispatch(register({ name: name.trim(), email: email.trim(), password })).unwrap();
        toast.success(result.message || 'Account created successfully!');
        await dispatch(login({ email: email.trim(), password })).unwrap();
      } catch (err) {
        toast.error(typeof err === 'string' ? err : 'Registration failed');
        dispatch(reset());
      }
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    dispatch(login({ email: email.trim(), password }));
  };

  const toggleMode = () => {
    setStep(1);
    navigate(isSignupRoute ? '/login' : '/signup');
  };

  return (
    <div className="min-h-screen landing-mesh flex items-center justify-center px-4 font-sans py-8">
      <div className="max-w-[440px] w-full glass rounded-2xl p-8 sm:p-10 shadow-xl border border-white/60 relative">

        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Back to email"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <h2 className="text-[28px] font-semibold text-center text-slate-900 mb-8 mt-2 tracking-tight">
          {isSignupRoute ? 'Create Account' : 'Sign In'}
        </h2>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="w-full flex justify-center">
              {googleClientId ? (
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    dispatch(googleLogin(credentialResponse.credential));
                  }}
                  onError={() => {
                    toast.error('Google Sign In failed');
                  }}
                  shape="rectangular"
                  text={isSignupRoute ? 'signup_with' : 'signin_with'}
                  width="100%"
                  size="large"
                />
              ) : (
                <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to frontend/.env to enable it.
                </div>
              )}
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-[15px]">
                or continue with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleNextStep}>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="flex-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-[15px]"
                  placeholder="Email address"
                  aria-label="Email address"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="p-3 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 flex-shrink-0"
                  aria-label="Continue"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              {isSignupRoute ? 'Already have an account? ' : "Don't have an account? "}
              <button type="button" onClick={toggleMode} className="font-medium text-slate-800 hover:text-slate-900 focus:outline-none focus:underline">
                {isSignupRoute ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[15px] font-medium flex justify-between items-center mb-6">
              {email}
              <button type="button" onClick={() => setStep(1)} className="text-xs text-primary-600 hover:underline">Edit</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignupRoute && (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-[15px]"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    required
                  />
                </div>
              )}

              <div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-[15px]"
                  placeholder="Password"
                  aria-label="Password"
                  autoFocus
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.06)] text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all font-medium mt-6 disabled:opacity-70 disabled:cursor-not-allowed text-[15px]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>{isSignupRoute ? 'Create Account' : 'Sign In'}</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
