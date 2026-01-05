
import React from 'react';

interface TimerProps {
  duration: number;
  remaining: number;
}

const Timer: React.FC<TimerProps> = ({ duration, remaining }) => {
  const isCritical = remaining < 5;
  const percentage = (remaining / duration) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="transparent"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="transparent"
            stroke="white"
            strokeWidth="3"
            strokeDasharray={113.1}
            strokeDashoffset={113.1 - (113.1 * percentage) / 100}
            className="transition-all duration-1000 linear"
          />
        </svg>
        <span className={`absolute text-xs font-bold ${isCritical ? 'text-red-200 animate-pulse' : ''}`}>
          {remaining}s
        </span>
      </div>
    </div>
  );
};

export default Timer;
