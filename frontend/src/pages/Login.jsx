import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register, reset } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { Bot, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const isSignupRoute = location.pathname === '/signup';
  
  const [isLogin, setIsLogin] = useState(!isSignupRoute);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && isLogin && isAuthenticated) {
      // Login successful
      navigate('/dashboard');
    } else if (isSuccess && !isLogin && message) {
      // Registration successful (needs verification)
      toast.success(message);
      setIsLogin(true); // switch to login view
      navigate('/login');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, isAuthenticated, navigate, dispatch, isLogin]);

  useEffect(() => {
    setIsLogin(!isSignupRoute);
  }, [isSignupRoute]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (!name || !email || !password) {
        toast.error('Please fill in all fields');
        return;
      }
      const userData = { name, email, password };
      dispatch(register(userData));
    } else {
      if (!email || !password) {
        toast.error('Please fill in all fields');
        return;
      }
      const userData = { email, password };
      dispatch(login(userData));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    navigate(isLogin ? '/signup' : '/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full glass rounded-3xl p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-center text-slate-500 mb-8">
            {isLogin ? 'Enter your details to access your account' : 'Sign up to start your interview prep journey'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={name}
                    onChange={onChange}
                    className="block w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" 
                    placeholder="John Doe" 
                    required={!isLogin} 
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="block w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" 
                  placeholder="you@example.com" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="block w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot your password?</a>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all font-semibold mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleMode} className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
              {isLogin ? 'Sign up now' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
