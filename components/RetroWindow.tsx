import React from 'react';
import { Minus, Square, X } from 'lucide-react';

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black shadow-lg w-full max-w-2xl">
      <div className="bg-[#000080] px-2 py-1 flex justify-between items-center">
        <div className="flex items-center space-x-1 text-white font-bold">
          {icon}
          <span className="text-sm tracking-wide">{title}</span>
        </div>
        <div className="flex space-x-1">
          <WindowControl icon={<Minus className="w-3 h-3" />} />
          <WindowControl icon={<Square className="w-3 h-3" />} />
          <WindowControl icon={<X className="w-3 h-3" />} />
        </div>
      </div>
      <div className="p-1">
        <div className="bg-[#c0c0c0]">
          {children}
        </div>
      </div>
    </div>
  );
};

const WindowControl: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <button className="w-5 h-5 flex items-center justify-center bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white">
    {icon}
  </button>
);
