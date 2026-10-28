import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register, reset, googleLogin } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SignupStepOne from '../components/auth/SignupStepOne';
import SignupStepTwo from '../components/auth/SignupStepTwo';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSignupRoute = location.pathname === '/signup';

  const [signupStep, setSignupStep] = useState(1);
  const [isSuccessState, setIsSuccessState] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
    profession: 'Working Professional',
    experienceLevel: '0–2 Years',
    currentRole: '',
    targetRole: '',
    skills: ['JavaScript', 'React'],
    interviewType: 'Technical',
    institution: '',
  });

  const { name, email, password } = formData;

  const { isLoading, isError, isSuccess, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Sync step reset on path change
  useEffect(() => {
    setSignupStep(1);
    setIsSuccessState(false);
  }, [location.pathname]);

  // Auth Redux response handling
  useEffect(() => {
    if (isSuccess && isAuthenticated) {
      navigate('/dashboard');
      dispatch(reset());
      return;
    }

    if (isError && message) {
      toast.error(message);
      setIsSuccessState(false);
      dispatch(reset());
    }
  }, [isError, isSuccess, message, isAuthenticated, navigate, dispatch]);

  const onChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleToggleMode = (targetPath) => {
    setSignupStep(1);
    setIsSuccessState(false);
    navigate(targetPath);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    dispatch(login({ email: email.trim(), password }));
  };

  const handleSignupSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      // Save Career Profile locally for personalized AI interview prompt enhancement
      const userCareerProfile = {
        profession: formData.profession,
        experienceLevel: formData.experienceLevel,
        currentRole: formData.currentRole,
        targetRole: formData.targetRole || 'Software Engineer',
        skills: formData.skills,
        interviewType: formData.interviewType,
        institution: formData.institution,
        phone: `${formData.countryCode} ${formData.phone}`,
      };
      localStorage.setItem('ai_coach_user_profile', JSON.stringify(userCareerProfile));

      setIsSuccessState(true);

      const result = await dispatch(
        register({ name: name.trim(), email: email.trim(), password })
      ).unwrap();

      toast.success(result.message || 'Account created successfully!');
      
      // Auto login user after registration
      await dispatch(login({ email: email.trim(), password })).unwrap();
    } catch (err) {
      setIsSuccessState(false);
      toast.error(typeof err === 'string' ? err : 'Registration failed');
      dispatch(reset());
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse?.credential) {
      dispatch(googleLogin(credentialResponse.credential));
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign In failed');
  };

  return (
    <AuthLayout isSignupRoute={isSignupRoute} onToggleMode={handleToggleMode}>
      {!isSignupRoute ? (
        <LoginForm
          email={formData.email}
          password={formData.password}
          onChange={onChange}
          onSubmit={handleLoginSubmit}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
          isLoading={isLoading}
          onSwitchToSignup={() => handleToggleMode('/signup')}
        />
      ) : signupStep === 1 ? (
        <SignupStepOne
          formData={formData}
          onChange={onChange}
          onNextStep={() => setSignupStep(2)}
          onSwitchToLogin={() => handleToggleMode('/login')}
        />
      ) : (
        <SignupStepTwo
          formData={formData}
          onChange={onChange}
          onPrevStep={() => setSignupStep(1)}
          onSubmit={handleSignupSubmit}
          isLoading={isLoading}
          isSuccessState={isSuccessState}
        />
      )}
    </AuthLayout>
  );
};

export default Login;
