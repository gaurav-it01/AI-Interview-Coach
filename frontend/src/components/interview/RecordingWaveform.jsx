import React, { useEffect, useState } from 'react';

const BAR_COUNT = 24;

const RecordingWaveform = ({ active = false }) => {
  const [heights, setHeights] = useState(() => Array(BAR_COUNT).fill(20));

  useEffect(() => {
    if (!active) {
      setHeights(Array(BAR_COUNT).fill(12));
      return undefined;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: BAR_COUNT }, () => 12 + Math.random() * 68)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex items-end justify-center gap-1 h-16 w-full max-w-xs mx-auto" aria-hidden="true">
      {heights.map((height, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-150 ${
            active
              ? 'bg-gradient-to-t from-violet-600 to-purple-400'
              : 'bg-slate-200'
          }`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};

export default RecordingWaveform;
