import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import ForgotPasswordModal from './ForgotPasswordModal';

const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientId = rawGoogleClientId;

const LoginForm = ({
  email,
  password,
  onChange,
  onSubmit,
  onGoogleSuccess,
  onGoogleError,
  isLoading,
  onSwitchToSignup,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Enter your credentials to access your interview dashboard.
        </p>
      </div>

      {/* Google Login Option */}
      <div className="w-full">
        {googleClientId ? (
          <div className="w-full flex justify-center overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              shape="rectangular"
              text="signin_with"
              width="100%"
              size="large"
            />
          </div>
        ) : (
          <div className="w-full rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 text-center font-medium">
            Google sign-in is available when client ID is configured.
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-slate-200/80"></div>
        <span className="flex-shrink-0 mx-3 text-xs uppercase font-bold tracking-wider text-slate-400">
          or sign in with email
        </span>
        <div className="flex-grow border-t border-slate-200/80"></div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="name@company.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={onChange}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full pl-11 pr-11 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-primary-600"
            />
            <span className="text-xs text-slate-600 font-medium">Remember me on this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In to Coach</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup Prompt */}
      <div className="pt-3 text-center border-t border-slate-100">
        <p className="text-xs sm:text-sm text-slate-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-bold text-primary-600 hover:text-primary-700 hover:underline focus:outline-none"
          >
            Create Account
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
      />
    </div>
  );
};

export default LoginForm;
