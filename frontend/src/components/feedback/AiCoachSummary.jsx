import React from 'react';
import { Lightbulb, Sparkles, Target, Zap } from 'lucide-react';

const BLOCKS = [
  { key: 'strengths', icon: Sparkles, title: 'Strengths', tone: 'emerald' },
  { key: 'weaknesses', icon: Target, title: 'Weaknesses', tone: 'amber' },
  { key: 'improvements', icon: Lightbulb, title: 'Improvements', tone: 'blue' },
];

const toneStyles = {
  emerald: {
    header: 'text-emerald-700',
    item: 'bg-emerald-50/60 border-emerald-100 text-emerald-900',
  },
  amber: {
    header: 'text-amber-700',
    item: 'bg-amber-50/60 border-amber-100 text-amber-900',
  },
  blue: {
    header: 'text-blue-700',
    item: 'bg-blue-50/60 border-blue-100 text-blue-900',
  },
};

const AiCoachSummary = ({ feedback }) => (
  <div className="glass rounded-xl overflow-hidden border border-white/60 shadow-sm h-full flex flex-col">
    <div className="px-4 py-3 border-b border-slate-100 bg-white/60">
      <p className="text-sm font-bold text-slate-900">AI Coach Summary</p>
      <p className="text-xs text-slate-500 mt-0.5">Aggregated from your session feedback</p>
    </div>

    <div className="p-4 space-y-4 flex-1">
      {BLOCKS.map(({ key, icon: Icon, title, tone }) => {
        const items = feedback[key];
        const styles = toneStyles[tone];
        if (!items?.length) return null;

        return (
          <div key={key}>
            <p className={`text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${styles.header}`}>
              <Icon className="w-3.5 h-3.5" />
              {title}
            </p>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item} className={`text-sm leading-snug rounded-lg border px-3 py-2 ${styles.item}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {feedback.recommendation && (
        <div className="pt-3 border-t border-slate-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-primary-700">
            <Zap className="w-3.5 h-3.5" />
            Final Recommendation
          </p>
          <p className="text-sm text-slate-700 leading-relaxed rounded-lg border border-primary-100 bg-gradient-to-br from-primary-50/80 to-blue-50/50 px-3 py-2.5">
            {feedback.recommendation}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default AiCoachSummary;
