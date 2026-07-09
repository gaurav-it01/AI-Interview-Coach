import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { reset, verifyEmail } from '../store/slices/authSlice';

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, token]);

  const statusIcon = isLoading ? (
    <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
  ) : isError ? (
    <XCircle className="h-10 w-10 text-red-500" />
  ) : (
    <CheckCircle className="h-10 w-10 text-green-500" />
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
          {statusIcon}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isLoading ? 'Verifying email' : isError ? 'Verification failed' : 'Email verified'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {message || 'Please wait while we confirm your account.'}
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          Go to login
        </Link>
      </section>
    </main>
  );
};

export default VerifyEmail;
