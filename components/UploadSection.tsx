import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (base64: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUpload }) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-500 bg-[#f0f0f0] group hover:bg-[#e0e0e0]">
      <Upload className="w-12 h-12 text-gray-500 mb-4" />
      <h3 className="text-lg font-bold text-gray-700 mb-2">Insert Photo Floppy</h3>
      <p className="text-sm text-gray-600 mb-4 text-center max-w-sm">
        Select a clear photo of yourself or a friend. We recommend a forward-facing headshot.
      </p>
      <label className="px-4 py-2 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black cursor-pointer flex items-center gap-2">
        <span className="font-bold text-sm">Browse System...</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
};
