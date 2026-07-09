import React from 'react';
import { Activity, Award, MessageSquare } from 'lucide-react';

const DashboardStats = ({ totalInterviews, averageScore, totalQuestions }) => {
  const stats = [
    { label: 'Sessions Completed', value: totalInterviews, icon: Activity, accent: 'text-primary-600 bg-primary-50 border-primary-100' },
    {
      label: 'Average Score',
      value: totalInterviews > 0 ? `${averageScore}/10` : '—',
      icon: Award,
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Questions Answered',
      value: totalQuestions,
      icon: MessageSquare,
      accent: 'text-violet-600 bg-violet-50 border-violet-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform duration-200"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${stat.accent}`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-slate-900 truncate">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
