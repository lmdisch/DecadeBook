import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const blocks = Math.floor((progress / 100) * 20); // Represent 100% with 20 blocks

  return (
    <div className="w-full h-6 bg-white border-2 border-inset border-gray-500 p-1 flex space-x-0.5">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-full ${
            i < blocks ? 'bg-[#000080]' : 'bg-transparent'
          }`}
        />
      ))}
    </div>
  );
};
