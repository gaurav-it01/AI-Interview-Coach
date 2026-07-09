import React from 'react';
import ScoreRing from './ScoreRing';
import { getScoreTone } from '../../utils/resultMetrics';

const SummaryMetricCard = ({ icon: Icon, label, value, suffix = '/10', showRing = true, delay = 0, accent = 'primary', pending = false }) => {
  const accentMap = {
    primary: 'from-primary-500/10 to-blue-500/10 text-primary-600',
    emerald: 'from-emerald-500/10 to-green-500/10 text-emerald-600',
    violet: 'from-violet-500/10 to-purple-500/10 text-violet-600',
    amber: 'from-amber-500/10 to-orange-500/10 text-amber-600',
    slate: 'from-slate-500/10 to-slate-600/10 text-slate-600',
  };

  const numericValue = Number(value);
  const displayValue = pending
    ? 'Pending'
    : Number.isFinite(numericValue)
      ? (suffix === '' ? String(Math.round(numericValue)) : numericValue.toFixed(1))
      : value;

  return (
    <div className="glass rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${accentMap[accent]} flex items-center justify-center mb-3`}>
            <Icon className="w-4 h-4" />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className={`text-xl font-extrabold mt-0.5 ${pending ? 'text-slate-400' : showRing ? getScoreTone(value) : 'text-slate-900'}`}>
            {displayValue}
            {!pending && suffix && <span className="text-sm font-medium text-slate-400">{suffix}</span>}
          </p>
        </div>
        {showRing && !pending && Number.isFinite(numericValue) && (
          <ScoreRing score={numericValue} size={48} delay={delay} />
        )}
      </div>
    </div>
  );
};

export default SummaryMetricCard;
