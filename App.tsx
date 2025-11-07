import React, { useState, useCallback, useRef } from 'react';
import { RetroWindow } from './components/RetroWindow';
import { ProgressBar } from './components/ProgressBar';
import { UploadSection } from './components/UploadSection';
import { DecadeGrid } from './components/DecadeGrid';
import { generateDecadeImage, detectGender, type DecadeResult } from './services/geminiService';
import { Camera, Save, Sparkles, AlertCircle } from 'lucide-react';

const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [results, setResults] = useState<DecadeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<string>('person');
  const stopProcessing = useRef(false);

  const handleUpload = (base64: string) => {
    setOriginalImage(base64);
    setResults([]);
    setError(null);
  };

  const handleStartProcessing = useCallback(async () => {
    if (!originalImage) return;
    setLoading(true);
    setProgress(0);
    setError(null);
    stopProcessing.current = false;
    setResults([]);

    try {
      setStatusText("Scanning subject info...");
      setProgress(5);
      const detectedGender = await detectGender(originalImage);
      setGender(detectedGender);
      
      const newResults: DecadeResult[] = [];
      let completedCount = 0;
      
      for (let i = 0; i < DECADES.length; i++) {
        if (stopProcessing.current) break;
        const decade = DECADES[i];
        setStatusText(`Going back in time to retrieve photos... [${decade}]`);
        setProgress(10 + (i / DECADES.length) * 80); // Scale progress
        
        try {
          const result = await generateDecadeImage(originalImage, decade, detectedGender);
          newResults.push(result);
          setResults(prev => [...prev, result]);
        } catch (e) {
          console.error(`Error generating ${decade}:`, e);
          newResults.push({ decade, imageUrl: '', status: 'error' });
          setResults(prev => [...prev, { decade, imageUrl: '', status: 'error' }]);
        }
        completedCount++;
      }

      if (!stopProcessing.current) {
          setStatusText("Finalizing temporal data...");
          setProgress(100);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during time travel sequence.');
      setStatusText("Error initializing sequence.");
    } finally {
      setLoading(false);
    }
  }, [originalImage]);

  const handleReset = () => {
    stopProcessing.current = true;
    setOriginalImage(null);
    setResults([]);
    setProgress(0);
    setLoading(false);
    setStatusText('');
    setError(null);
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center font-sans">
      <RetroWindow title="DecadeBook.exe" icon={<Camera className="w-4 h-4" />}>
        <div className="flex flex-col space-y-4">
          {/* Top Actions Toolbar */}
          <div className="bg-[#c0c0c0] border-b border-[#808080] p-1 flex items-center space-x-2 text-sm">
            <button onClick={handleReset} className="flex items-center px-2 py-1 border border-white border-r-black border-b-black active:border-l-black active:border-t-black active:border-r-white active:border-b-white">
              <span className="mr-1">File</span>
            </button>
            <div className="flex-1" />
            <span className="text-gray-600">V1.0.1998</span>
          </div>

          {!originalImage && (
            <div className="p-6 bg-white border-2 border-inset border-gray-400">
              <UploadSection onUpload={handleUpload} />
            </div>
          )}

          {originalImage && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start bg-white p-2 border-2 border-gray-400 border-inset">
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-sm font-bold text-[#000080] self-start">Subject:</p>
                  <img src={originalImage} alt="Original" className="w-32 h-32 object-cover border-2 border-[#808080]" />
                </div>
                <div className="flex-1 space-y-4">
                  <p className="text-sm text-gray-700 leading-tight">
                    Ready to initiate temporal scan. Click 'Start Process' to generate your decade-based photos.
                    Please ensure subject is facing camera clearly.
                  </p>
                  {!loading && results.length === 0 && (
                     <div className="flex gap-2">
                       <RetroButton onClick={handleStartProcessing} primary icon={<Sparkles className="w-4 h-4"/>}>
                         Start Process
                       </RetroButton>
                       <RetroButton onClick={handleReset} icon={<AlertCircle className="w-4 h-4"/>}>
                         Cancel / Reset
                       </RetroButton>
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="p-4 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black">
              <p className="mb-1 text-sm font-bold">{statusText}</p>
              <ProgressBar progress={progress} />
            </div>
          )}

           {error && (
            <div className="bg-[#ff0000] text-white p-2 text-sm font-bold border-2 border-black flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {results.length > 0 && (
            <DecadeGrid results={results} />
          )}

          {originalImage && !loading && results.length > 0 && (
             <div className="flex justify-end pt-2">
               <RetroButton onClick={handleReset} icon={<Save className="w-4 h-4"/>}>
                 Start Over
               </RetroButton>
             </div>
          )}

          {/* Status Bar Footer */}
          <div className="border border-gray-400 border-inset bg-[#c0c0c0] px-2 py-1 text-xs flex justify-between">
            <span>Status: {loading ? "Processing..." : results.length > 0 ? "Completed" : "Ready"}</span>
            {results.length > 0 && <span>Processed: {results.length} / {DECADES.length}</span>}
          </div>
        </div>
      </RetroWindow>
    </div>
  );
};

interface RetroButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
  icon?: React.ReactNode;
}

const RetroButton: React.FC<RetroButtonProps> = ({ onClick, children, primary, icon }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 flex items-center space-x-1 text-sm
        border-2 border-white border-b-black border-r-black
        active:border-t-black active:border-l-black active:border-b-white active:border-r-white
        ${primary ? 'font-bold' : ''}
        bg-[#c0c0c0] hover:bg-[#d0d0d0] active:bg-[#b0b0b0]`}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
);

export default App;
