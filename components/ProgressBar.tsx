
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-blue-400/30 rounded-full h-2.5">
      <div 
        className="bg-white h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
