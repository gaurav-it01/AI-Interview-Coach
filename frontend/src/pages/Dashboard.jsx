import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../store/slices/authSlice';
import { getResults, reset } from '../store/slices/interviewSlice';
import { Sparkles, Target, Award } from 'lucide-react';

import ResumeUpload from '../components/ResumeUpload';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardStats from '../components/dashboard/DashboardStats';
import PastSessionsList from '../components/dashboard/PastSessionsList';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { results, isLoading, isError, message } = useSelector((state) => state.interview);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    dispatch(getResults());
    try {
      const storedProfile = localStorage.getItem('ai_coach_user_profile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
    } catch {
      // Ignore JSON parse error if any
    }
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
    <div className="min-h-screen auth-mesh flex flex-col md:flex-row font-sans">
      <DashboardSidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        {/* Header Greeting Banner */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome back, {user?.name || 'Candidate'}!
              </span>
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Upload your resume or start a targeted mock session for your interview preparation.
            </p>
          </div>

          {/* User Profile Pill Tags */}
          {userProfile && (
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              {userProfile.targetRole && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-xs font-bold border border-primary-200/60">
                  <Target className="w-3.5 h-3.5 text-primary-600" />
                  Target: {userProfile.targetRole}
                </span>
              )}
              {userProfile.experienceLevel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  {userProfile.experienceLevel}
                </span>
              )}
            </div>
          )}
        </header>

        <DashboardStats
          totalInterviews={totalInterviews}
          averageScore={averageScore}
          totalQuestions={totalQuestions}
        />

        <div id="new">
          <ResumeUpload />
        </div>

        <div id="history">
          <PastSessionsList
            results={results}
            isLoading={isLoading}
            onViewReport={handleViewReport}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
