import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import CountryCodeSelect from './CountryCodeSelect';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { toast } from 'react-toastify';

const SignupStepOne = ({ formData, onChange, onNextStep, onSwitchToLogin }) => {
  const { name, email, countryCode = '+91', phone = '', password = '', confirmPassword = '' } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    onNextStep();
  };

  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Step Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Step 1 of 2 — Account
          </span>
          <span className="text-xs text-slate-400 font-medium">50% Complete</span>
        </div>
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-primary-600 w-1/2 rounded-full transition-all duration-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create your account</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter your contact details and security credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="eg. xyz"
              required
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="name@company.com"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Phone Number with Country Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="flex gap-2">
            <CountryCodeSelect
              value={countryCode}
              onChange={(code) =>
                onChange({ target: { name: 'countryCode', value: code } })
              }
            />
            <div className="relative flex-1">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={onChange}
                placeholder="98765 43210"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={onChange}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            {isPasswordMatch && (
              <span className="text-[11px] font-semibold text-emerald-600">✓ Passwords match</span>
            )}
            {isPasswordMismatch && (
              <span className="text-[11px] font-semibold text-rose-500">✕ Passwords do not match</span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="••••••••"
              required
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all font-medium ${
                isPasswordMismatch
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Next Step Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 flex items-center justify-center gap-2 mt-4"
        >
          <span>Continue to Career Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch to Login Link */}
      <div className="pt-2 text-center border-t border-slate-100">
        <p className="text-xs sm:text-sm text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-primary-600 hover:text-primary-700 hover:underline focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupStepOne;
