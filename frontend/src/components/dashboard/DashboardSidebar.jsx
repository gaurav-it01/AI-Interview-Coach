import React from 'react';
import { LogOut, Plus, Activity, Calendar } from 'lucide-react';

/**
 * DashboardSidebar component provides navigation and user account actions.
 * 
 * @param {Object} props
 * @param {Object} props.user - The current authenticated user.
 * @param {Function} props.onLogout - Callback function when user signs out.
 */
const DashboardSidebar = ({ user, onLogout }) => {
  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">InterviewCoach</span>
        </div>
        
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium transition-colors">
            <Activity className="w-5 h-5" />
            Overview
          </a>
          <a href="#new" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <Plus className="w-5 h-5" />
            New Interview
          </a>
          <a href="#history" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <Calendar className="w-5 h-5" />
            History
          </a>
        </nav>
      </div>
      
      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
