import React from 'react';
import { Activity, Award, Calendar } from 'lucide-react';

/**
 * DashboardStats displays the summary statistics of the user's interview performance.
 *
 * @param {Object} props
 * @param {number} props.totalInterviews - The total number of past interview sessions.
 * @param {string|number} props.averageScore - The overall average score out of 10.
 * @param {string|number} props.hoursPracticed - The total hours the user has practiced.
 */
const DashboardStats = ({ totalInterviews, averageScore, hoursPracticed }) => {
  const stats = [
    { label: "Interviews Completed", value: totalInterviews, icon: <Activity className="w-6 h-6 text-blue-500" /> },
    { label: "Average Score", value: `${averageScore}/10`, icon: <Award className="w-6 h-6 text-green-500" /> },
    { label: "Hours Practiced", value: hoursPracticed, icon: <Calendar className="w-6 h-6 text-purple-500" /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
