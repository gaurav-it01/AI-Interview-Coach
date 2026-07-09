import React, { useEffect, useState } from 'react';

const AnimatedScoreBar = ({ label, score, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  const numericScore = Number(score) || 0;
  const targetWidth = Math.min(100, Math.max(0, numericScore * 10));

  useEffect(() => {
    const timer = setTimeout(() => setWidth(targetWidth), delay);
    return () => clearTimeout(timer);
  }, [targetWidth, delay]);

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{numericScore}/10</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const AiFeedbackPanel = ({
  overallScore,
  dimensions = [],
  summaryFeedback,
  className = '',
  animate = true,
}) => {
  const formattedOverall = Number(overallScore || 0).toFixed(1);

  return (
    <div className={`glass rounded-2xl overflow-hidden border border-white/60 shadow-xl ${className}`}>
      <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
        </div>
        <span className="text-xs text-slate-400 ml-2">AI Feedback</span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-bold text-slate-900">Overall Score</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gradient">{formattedOverall}</p>
        </div>

        <div className="space-y-3">
          {dimensions.map((dimension, index) => (
            <AnimatedScoreBar
              key={dimension.label}
              label={dimension.label}
              score={dimension.score}
              delay={animate ? index * 120 : 0}
            />
          ))}
        </div>

        {summaryFeedback && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-emerald-800 leading-relaxed">
            {summaryFeedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFeedbackPanel;
