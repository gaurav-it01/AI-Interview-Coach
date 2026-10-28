import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPasswordModal = ({ isOpen, onClose, initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate send reset email request with smooth UI feedback
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleResetState = () => {
    setIsSubmitted(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={handleResetState}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Reset Link Sent</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We've sent password reset instructions to <span className="font-semibold text-slate-800">{email}</span>. Please check your inbox.
            </p>
            <button
              type="button"
              onClick={handleResetState}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all shadow-sm mt-4"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Reset your password</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Enter your account email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
