import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../store/slices/authSlice';
import { getResults, reset } from '../store/slices/interviewSlice';

import ResumeUpload from '../components/ResumeUpload';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardStats from '../components/dashboard/DashboardStats';
import PastSessionsList from '../components/dashboard/PastSessionsList';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { results, isLoading, isError, message } = useSelector((state) => state.interview);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getResults());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleViewReport = (id) => {
    navigate(`/result/${id}`);
  };

  const totalInterviews = results?.length || 0;
  const totalQuestions = results?.reduce(
    (sum, session) => sum + (session.evaluations?.length || 0),
    0
  ) || 0;
  const averageScore = totalInterviews > 0
    ? (results.reduce((acc, curr) => acc + Number(curr.averageScore || 0), 0) / totalInterviews).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen landing-mesh flex flex-col md:flex-row">
      <DashboardSidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 overflow-y-auto">
        <header className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back, {user?.name || 'User'}. Upload a resume to start your next session.
          </p>
        </header>

        <DashboardStats
          totalInterviews={totalInterviews}
          averageScore={averageScore}
          totalQuestions={totalQuestions}
        />

        <div id="new" className="mb-5">
          <ResumeUpload />
        </div>

        <PastSessionsList
          results={results}
          isLoading={isLoading}
          onViewReport={handleViewReport}
        />
      </main>
    </div>
  );
};

export default Dashboard;
