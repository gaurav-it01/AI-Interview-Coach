import React, { useState } from 'react';
import { LogOut, Plus, Activity, Calendar, Menu, X } from 'lucide-react';

/**
 * DashboardSidebar component provides navigation and user account actions.
 * 
 * @param {Object} props
 * @param {Object} props.user - The current authenticated user.
 * @param {Function} props.onLogout - Callback function when user signs out.
 */
const DashboardSidebar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="w-full md:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
            AI
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800">InterviewCoach</span>
        </div>
        <button 
          onClick={toggleSidebar} 
          aria-label="Toggle menu" 
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold">
                AI
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">InterviewCoach</span>
            </div>
            {/* Close button inside panel for mobile */}
            <button 
              onClick={closeSidebar} 
              className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <button
              type="button"
              onClick={closeSidebar}
              aria-current="page"
              className="flex w-full items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium transition-colors"
            >
              <Activity className="w-5 h-5" />
              Overview
            </button>
            <a 
              href="#new" 
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Interview
            </a>
            <a 
              href="#history" 
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors"
            >
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
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              closeSidebar();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
