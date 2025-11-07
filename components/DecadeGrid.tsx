import React from 'react';
import { type DecadeResult } from '../services/geminiService';
import { AlertOctagon, Download } from 'lucide-react';

interface DecadeGridProps {
  results: DecadeResult[];
}

export const DecadeGrid: React.FC<DecadeGridProps> = ({ results }) => {

  const handleDownload = (dataUrl: string, decade: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `DecadeBook_${decade}_Yearbook.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-2 bg-white border-2 border-gray-400 border-inset">
      {results.map((res) => (
        <div key={res.decade} className="flex flex-col bg-[#c0c0c0] p-1 border border-white border-b-black border-r-black">
          <div className="bg-[#000080] text-white px-2 py-0.5 text-xs font-bold flex justify-between">
            <span>{res.decade}.jpg</span>
          </div>
          <div className="relative bg-gray-100 h-64 border-2 border-inset border-gray-500 mt-1 flex items-center justify-center overflow-hidden">
            {res.status === 'done' && (
              <img src={res.imageUrl} alt={`${res.decade} yearbook`} className="w-full h-full object-cover" />
            )}
            {res.status === 'loading' && (
              <div className="text-xs text-gray-500 animate-pulse">Rendering...</div>
            )}
            {res.status === 'error' && (
              <div className="flex flex-col items-center text-red-600 px-4 text-center">
                <AlertOctagon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs">Failed to load data</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-700 mt-1 px-1 text-center font-bold">
            {res.decade} Yearbook Edition
          </div>
          {res.status === 'done' && (
            <div className="mt-2 flex justify-center pb-1">
               <button
                onClick={() => handleDownload(res.imageUrl, res.decade)}
                className="px-2 py-1 flex items-center space-x-1 text-xs
                  border border-white border-b-black border-r-black
                  active:border-t-black active:border-l-black active:border-b-white active:border-r-white
                  bg-[#c0c0c0] hover:bg-[#d0d0d0] active:bg-[#b0b0b0]"
              >
                <Download className="w-3 h-3" />
                <span>Save to Disk</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
