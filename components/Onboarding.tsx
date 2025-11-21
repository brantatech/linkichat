import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { analyzeUserProfile } from '../services/geminiService';
import { Loader2, Upload, FileText, X, ArrowRight, Check } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

interface UploadedFile {
  name: string;
  data: string;
  mimeType: string;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setFile({
          name: selectedFile.name,
          data: base64Data,
          mimeType: selectedFile.type
        });
        setText(''); 
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if ((!text && !file) || !name) return;
    setIsLoading(true);
    try {
      let input;
      let rawContext = text;

      if (file) {
        input = {
          inlineData: {
            data: file.data,
            mimeType: file.mimeType
          }
        };
        rawContext = `[Resume Uploaded: ${file.name}]`;
      } else {
        input = text;
      }

      const analysis = await analyzeUserProfile(input);
      
      if (file) {
        rawContext += `\n\nExtracted Context & Analysis:\n${analysis}`;
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      onComplete({
        name,
        rawText: rawContext,
        analysis,
        isTrained: true
      });
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze profile. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 relative overflow-hidden font-sans">
      {/* Soft background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-float delay-1000"></div>

      <div className="bg-white max-w-4xl w-full rounded-[2.5rem] shadow-soft relative z-10 overflow-hidden flex flex-col md:flex-row animate-scale-in">
        
        {/* Left Side (Visual) */}
        <div className="md:w-2/5 bg-slate-900 p-10 flex flex-col justify-between relative overflow-hidden text-white">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-10 mix-blend-overlay"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-8">
                 <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h1 className="text-4xl font-bold leading-tight mb-4">Build your personal brand.</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Leverage AI to optimize your profile, grow your network, and create viral content.
              </p>
           </div>
           <div className="relative z-10 mt-12">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-300 mb-2">
                 <Check className="w-4 h-4 text-emerald-400" /> <span>Profile Analysis</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-300 mb-2">
                 <Check className="w-4 h-4 text-emerald-400" /> <span>Network Strategy</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
                 <Check className="w-4 h-4 text-emerald-400" /> <span>Content Engine</span>
              </div>
           </div>
        </div>

        {/* Right Side (Form) */}
        <div className="md:w-3/5 p-10 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Get Started</h2>
             <p className="text-slate-400 text-sm">Enter your details to initialize your digital twin.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
               <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Profile Data</label>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => { setFile(null); setText(''); }}
                       className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${!file ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                     >
                       TEXT
                     </button>
                     <button 
                       onClick={() => { setText(''); }}
                       className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${file ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                     >
                       UPLOAD
                     </button>
                  </div>
               </div>

               {!file ? (
                  <textarea
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none text-sm text-slate-600 placeholder:text-slate-400 font-medium"
                    placeholder="Paste your LinkedIn About section, Headline..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
               ) : (
                  <div className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center p-4 relative">
                     <FileText className="w-8 h-8 text-slate-900 mb-2" />
                     <p className="text-sm font-bold text-slate-900">{file.name}</p>
                     <button 
                        onClick={clearFile}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>
               )}

               <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt"
                  className="hidden" 
               />
               
               {/* Hidden trigger for file mode if needed */}
               {/* Logic handled by toggle buttons above, but need to trigger click if file mode active and no file */}
               {(!file && !text) && (
                  <div className="mt-2 text-center">
                     <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-purple-600 hover:underline">
                        Or click here to upload PDF
                     </button>
                  </div>
               )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || (!text && !file) || !name}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Setting up...
                </>
              ) : (
                <>
                  Initialize Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};