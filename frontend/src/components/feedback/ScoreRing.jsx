import React, { useEffect, useState } from 'react';
import { getRingColor } from '../../utils/resultMetrics';

const ScoreRing = ({ score, size = 52, strokeWidth = 4, delay = 0 }) => {
  const [offset, setOffset] = useState(0);
  const numericScore = Number(score) || 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (numericScore / 10) * circumference;
  const color = getRingColor(numericScore);

  useEffect(() => {
    const timer = setTimeout(() => setOffset(targetOffset), delay);
    return () => clearTimeout(timer);
  }, [targetOffset, delay]);

  return (
    <svg width={size} height={size} className="flex-shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

export default ScoreRing;
