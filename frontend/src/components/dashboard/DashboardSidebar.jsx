import React, { useState } from 'react';
import { LogOut, Plus, Activity, Calendar, Menu, X, Bot, Sparkles } from 'lucide-react';

/**
 * DashboardSidebar component provides navigation and user account actions with modern SaaS styling.
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
      <div className="w-full md:hidden bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-slate-900">
            AI Interview<span className="text-primary-600">Coach</span>
          </span>
        </div>
        <button 
          onClick={toggleSidebar} 
          aria-label="Toggle menu" 
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static shadow-sm ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  AI Interview<span className="text-primary-600">Coach</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-600">
                  <Sparkles className="w-3 h-3" /> Pro Suite
                </span>
              </div>
            </div>
            {/* Close button inside panel for mobile */}
            <button 
              onClick={closeSidebar} 
              className="md:hidden p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={closeSidebar}
              aria-current="page"
              className="flex w-full items-center gap-3 px-4 py-3 bg-primary-50/80 text-primary-700 rounded-xl font-bold text-sm transition-colors border border-primary-100/50"
            >
              <Activity className="w-4 h-4 text-primary-600" />
              Overview
            </button>
            <a 
              href="#new" 
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-400" />
              New Interview
            </a>
            <a 
              href="#history" 
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-sm transition-colors"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              History
            </a>
          </nav>
        </div>
        
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              closeSidebar();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-xs font-semibold shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
