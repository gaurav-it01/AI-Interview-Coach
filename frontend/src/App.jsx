import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearSession } from './store/slices/authSlice';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InterviewModeSelect from './pages/InterviewModeSelect';
import TextInterview from './pages/TextInterview';
import VoiceInterview from './pages/VoiceInterview';
import ResultDetails from './pages/ResultDetails';
import VerifyEmail from './pages/VerifyEmail';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleSessionExpired = () => dispatch(clearSession());
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [dispatch]);

  return (
    <Router>
      <div className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview/:resumeId"
            element={
              <PrivateRoute>
                <InterviewModeSelect />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview/:resumeId/text"
            element={
              <PrivateRoute>
                <TextInterview />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview/:resumeId/voice"
            element={
              <PrivateRoute>
                <VoiceInterview />
              </PrivateRoute>
            }
          />
          <Route
            path="/result/:id"
            element={
              <PrivateRoute>
                <ResultDetails />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" newestOnTop pauseOnFocusLoss={false} />
      </div>
    </Router>
  );
}

export default App;
