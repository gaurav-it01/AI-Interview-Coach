import React, { useEffect, useState } from 'react';

const AnimatedScoreBar = ({
  label,
  value,
  max = 10,
  delay = 0,
  suffix = '',
  colorClass = 'from-primary-500 to-blue-600',
  pending = false,
}) => {
  const [width, setWidth] = useState(0);
  const numeric = Number(value) || 0;
  const target = pending ? 0 : Math.min(100, Math.max(0, (numeric / max) * 100));

  useEffect(() => {
    const timer = setTimeout(() => setWidth(target), delay);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600 font-medium truncate pr-2">{label}</span>
        <span className={`font-semibold flex-shrink-0 ${pending ? 'text-slate-400' : 'text-slate-800'}`}>
          {pending ? 'Pending' : `${numeric}${suffix}`}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            pending ? 'bg-slate-200 w-0' : `bg-gradient-to-r ${colorClass}`
          }`}
          style={{ width: pending ? '0%' : `${width}%` }}
        />
      </div>
    </div>
  );
};

export default AnimatedScoreBar;
