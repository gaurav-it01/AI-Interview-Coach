import React from 'react';
import { ChevronRight, Clock, Trash2 } from 'lucide-react';
import { isResultPending } from '../../utils/resultMetrics';

const SessionCard = ({ session, onViewReport, onDelete }) => {
  const pending = isResultPending(session.evaluations);
  const score = Number(session.averageScore) || 0;
  const questionCount = session.evaluations?.length;

  let badgeStyle = 'bg-amber-50 text-amber-700 border-amber-100';
  if (pending) badgeStyle = 'bg-slate-100 text-slate-500 border-slate-200';
  else if (score >= 8) badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  else if (score >= 6) badgeStyle = 'bg-blue-50 text-blue-700 border-blue-100';

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200 bg-white gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border flex-shrink-0 transition-transform group-hover:scale-105 ${badgeStyle}`}>
          {pending ? <Clock className="w-5 h-5" /> : score.toFixed(1)}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-800 text-sm">Mock Interview</h4>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            <span className="font-medium text-slate-600">{session.resume?.fileName || 'Resume'}</span>
            {' · '}
            {new Date(session.createdAt).toLocaleDateString()}
            {questionCount ? ` · ${questionCount} Q` : ''}
            {pending ? ' · Pending' : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => onViewReport(session._id)}
          className="text-primary-600 text-sm font-semibold hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3.5 py-2 rounded-lg transition-colors inline-flex items-center gap-1"
        >
          View Report
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(session)}
          aria-label="Delete interview session"
          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
