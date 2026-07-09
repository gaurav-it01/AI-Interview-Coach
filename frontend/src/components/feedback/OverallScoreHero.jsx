import React from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';
import ScoreRing from './ScoreRing';
import { getScoreTone, isResultPending } from '../../utils/resultMetrics';

const OverallScoreHero = ({ score, resumeName, completedAt, questionCount, evaluations }) => {
  const pending = isResultPending(evaluations);
  const numeric = Number(score) || 0;
  const formatted = pending ? null : numeric.toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 shadow-lg bg-gradient-to-br from-white via-white to-primary-50/40 p-5 sm:p-6">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary-400/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {pending ? (
              <div className="w-[88px] h-[88px] rounded-full border-[6px] border-slate-200 flex items-center justify-center bg-slate-50">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
            ) : (
              <>
                <ScoreRing score={numeric} size={88} strokeWidth={6} delay={0} />
                <div className="absolute inset-0 flex items-center justify-center rotate-90">
                  <span className={`text-2xl font-extrabold ${getScoreTone(numeric)}`}>{formatted}</span>
                </div>
              </>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">Overall Score</p>
            {pending ? (
              <p className="text-2xl sm:text-3xl font-bold text-slate-500">Pending Evaluation</p>
            ) : (
              <p className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${getScoreTone(numeric)}`}>
                {formatted}
                <span className="text-lg font-semibold text-slate-400">/10</span>
              </p>
            )}
            <p className="text-sm text-slate-500 mt-1">{questionCount} questions evaluated</p>
          </div>
        </div>

        <div className="sm:ml-auto flex flex-wrap gap-2 text-xs text-slate-500">
          {resumeName && (
            <span className="inline-flex items-center gap-1.5 bg-white/80 border border-slate-200 rounded-full px-3 py-1.5">
              <FileText className="w-3.5 h-3.5 text-primary-600" />
              <span className="truncate max-w-[180px] font-medium text-slate-700">{resumeName}</span>
            </span>
          )}
          {completedAt && (
            <span className="inline-flex items-center gap-1.5 bg-white/80 border border-slate-200 rounded-full px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-600" />
              {completedAt}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverallScoreHero;
