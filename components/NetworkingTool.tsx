import React, { useState, useRef } from 'react';
import { UserProfile, NetworkingResult } from '../types';
import { generateNetworkingStrategy } from '../services/geminiService';
import { UserPlus, Send, MessageSquare, Sparkles, Loader2, Copy, Upload, FileText, X, AlignLeft, Briefcase, Globe, History, ChevronRight, Trash2 } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  onSaveResult: (result: NetworkingResult) => void;
  onDeleteResult: (id: string) => void;
}

interface UploadedFile {
  name: string;
  data: string;
  mimeType: string;
}

export const NetworkingTool: React.FC<Props> = ({ userProfile, onSaveResult, onDeleteResult }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [connectionText, setConnectionText] = useState('');
  const [connectionFile, setConnectionFile] = useState<UploadedFile | null>(null);
  const [result, setResult] = useState<NetworkingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setConnectionFile({
          name: selectedFile.name,
          data: base64Data,
          mimeType: selectedFile.type
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearFile = () => {
    setConnectionFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!connectionText && !connectionFile) return;
    setIsLoading(true);
    setResult(null);
    try {
      let input;
      if (activeTab === 'file' && connectionFile) {
        input = {
          inlineData: {
            data: connectionFile.data,
            mimeType: connectionFile.mimeType
          }
        };
      } else {
        input = connectionText;
      }

      const data = await generateNetworkingStrategy(userProfile.rawText, input);
      
      // Create complete result with ID
      const fullResult: NetworkingResult = {
          ...data,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          targetName: data.targetName || (connectionFile ? connectionFile.name.replace('.pdf', '') : 'Text Analysis')
      };

      setResult(fullResult);
      onSaveResult(fullResult); // Save to history
    } catch (e) {
      console.error(e);
      alert("Failed to generate strategy.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-8 relative">
      
      {/* Left Column: Input */}
      <div className="lg:col-span-5 space-y-6 animate-slide-up delay-100">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col relative overflow-hidden">
          
          <div className="mb-6 flex justify-between items-start">
            <div>
                 <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                    <Briefcase className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900">Target Analysis</h2>
                 <p className="text-slate-400 text-sm font-medium">
                   Decode psychology & find real-time hooks.
                 </p>
            </div>
            <button 
                onClick={() => setShowHistory(!showHistory)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors relative"
                title="View Past Dossiers"
            >
                <History className="w-5 h-5" />
                {userProfile.networkingHistory && userProfile.networkingHistory.length > 0 && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>
          </div>

          {/* Recent Dossiers Drawer (Overlay) */}
          {showHistory && (
            <div className="absolute inset-0 bg-white z-20 p-6 flex flex-col animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900">Recent Dossiers</h3>
                    <button onClick={() => setShowHistory(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                    {userProfile.networkingHistory && userProfile.networkingHistory.length > 0 ? (
                        userProfile.networkingHistory.map((item) => (
                            <div key={item.id} className="group flex items-center gap-2">
                                <button 
                                    onClick={() => { setResult(item); setShowHistory(false); }}
                                    className="flex-1 p-4 rounded-2xl bg-slate-50 hover:bg-purple-50 text-left transition-colors flex justify-between items-center"
                                >
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-slate-800 truncate pr-2">{item.targetName}</p>
                                        <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 shrink-0" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteResult(item.id); }}
                                    className="p-4 rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <History className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">No saved profiles yet.</p>
                        </div>
                    )}
                </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-6 border border-slate-100">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <AlignLeft className="w-4 h-4" /> Text
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Upload className="w-4 h-4" /> PDF
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            {/* Text Input */}
            {activeTab === 'text' && (
              <textarea
                className="w-full flex-1 p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm text-slate-600 placeholder:text-slate-400 font-medium mb-4"
                placeholder="Paste target profile URL, 'About' section, or recent posts..."
                value={connectionText}
                onChange={(e) => setConnectionText(e.target.value)}
              ></textarea>
            )}

            {/* File Input */}
            {activeTab === 'file' && (
              <div className={`flex-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 mb-4 relative overflow-hidden ${connectionFile ? 'border-purple-500 bg-purple-50/30' : 'border-slate-200 hover:border-purple-400 hover:bg-slate-50'}`}>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden" 
                />
                
                {!connectionFile ? (
                  <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer w-full h-full flex flex-col items-center justify-center z-10">
                    <div className="w-14 h-14 bg-white text-purple-500 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                       <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Upload Profile PDF</p>
                  </div>
                ) : (
                  <div className="w-full max-w-xs bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 truncate">{connectionFile.name}</p>
                    </div>
                    <button onClick={clearFile} className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading || (activeTab === 'text' ? !connectionText : !connectionFile)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-slate-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin w-5 h-5" /> <span className="animate-pulse">Analyzing...</span></>
              ) : (
                <><Sparkles className="w-5 h-5 text-yellow-300" /> Generate Roadmap</>
              )}
            </button>
            
            {isLoading && (
               <div className="mt-3 text-center text-xs font-medium text-purple-600 animate-pulse">
                  Querying Google Search for real-time insights...
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="lg:col-span-7 space-y-6 z-10">
        {result ? (
          <div className="space-y-6 animate-slide-up">
            {/* Context Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-bl-full opacity-50"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-xs font-extrabold text-purple-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                    Intelligence Dossier
                    </h3>
                    <p className="text-xl font-bold text-slate-900 mt-1">{result.targetName}</p>
                </div>
                {result.sources && result.sources.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                     <Globe className="w-3 h-3" /> Live Data
                  </span>
                )}
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10">
                {result.context}
              </p>

              {result.sources && result.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100 relative z-10">
                   <div className="flex flex-wrap gap-2">
                      {result.sources.slice(0, 3).map((src, idx) => (
                        <a key={idx} href={src} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-purple-600 bg-slate-50 hover:bg-purple-50 px-3 py-1.5 rounded-lg border border-slate-100 transition-colors truncate max-w-[200px] font-medium">
                          {new URL(src).hostname}
                        </a>
                      ))}
                   </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Icebreaker */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Send className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">Icebreaker</h3>
                    </div>
                    <button onClick={() => copyToClipboard(result.icebreaker)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-emerald-600 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-50 text-slate-600 text-sm font-medium">
                      {result.icebreaker}
                  </div>
                </div>

                {/* Follow Up */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                             <MessageSquare className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">Follow-Up</h3>
                    </div>
                    <button onClick={() => copyToClipboard(result.followUp)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-amber-600 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-50 text-slate-600 text-sm font-medium">
                      {result.followUp}
                  </div>
                </div>
            </div>

            {/* Trust Builder */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                 <div className="relative z-10">
                    <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Authority Anchor
                    </h3>
                    <p className="font-bold text-lg leading-relaxed">"{result.trustBuilder}"</p>
                 </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
               <UserPlus className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to strategize?</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Upload a profile or text to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};