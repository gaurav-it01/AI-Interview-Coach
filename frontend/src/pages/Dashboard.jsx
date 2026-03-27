import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { getResults } from '../store/slices/interviewSlice';

import ResumeUpload from '../components/ResumeUpload';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardStats from '../components/dashboard/DashboardStats';
import PastSessionsList from '../components/dashboard/PastSessionsList';

/**
 * Dashboard Page - The main container for user overview, stats, and historical interview sessions.
 */
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { results, isLoading } = useSelector((state) => state.interview);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch results when dashboard mounts
  useEffect(() => {
    dispatch(getResults());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleViewReport = (id) => {
    navigate(`/result/${id}`);
  };

  // Compute stats
  const totalInterviews = results?.length || 0;
  let averageScore = 0;
  
  if (totalInterviews > 0) {
    const sum = results.reduce((acc, curr) => acc + curr.averageScore, 0);
    averageScore = (sum / totalInterviews).toFixed(1);
  }

  // Approx practice time (15 mins per interview)
  const hoursPracticed = ((totalInterviews * 15) / 60).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <DashboardSidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.name || 'User'}! Ready for your next mock interview?</p>
        </header>

        {/* Top Statistics Cards */}
        <DashboardStats 
          totalInterviews={totalInterviews} 
          averageScore={averageScore} 
          hoursPracticed={hoursPracticed} 
        />

        {/* Upload Resume Form for New Session */}
        <div id="new">
          <ResumeUpload />
        </div>

        {/* History Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Past Sessions List */}
          <PastSessionsList 
            results={results} 
            isLoading={isLoading} 
            onViewReport={handleViewReport} 
          />
          
          {/* Upsell / Call to Action widget */}
          <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between relative overflow-hidden h-max">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">Ready to level up?</h2>
              <p className="text-primary-100 mb-6 text-sm leading-relaxed">
                Consistent practice improves response delivery. Drag your resume above to start a fresh tailored session!
              </p>
            </div>
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
