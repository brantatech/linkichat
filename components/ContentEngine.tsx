import React, { useState } from 'react';
import { UserProfile, ContentFramework, ContentResult } from '../types';
import { generateContentPost } from '../services/geminiService';
import { PenTool, Layout, Image as ImageIcon, Loader2, Copy, Zap, Brain, Eye } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
}

export const ContentEngine: React.FC<Props> = ({ userProfile }) => {
  const [topic, setTopic] = useState('');
  const [framework, setFramework] = useState<ContentFramework>(ContentFramework.SYSTEM_REVEAL);
  const [result, setResult] = useState<ContentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setResult(null);
    try {
      const data = await generateContentPost(userProfile.rawText, framework, topic);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Failed to generate content.");
    } finally {
      setIsLoading(false);
    }
  };

  const FrameworkCard = ({ id, icon: Icon, title, desc, color }: any) => (
    <button
      onClick={() => setFramework(id)}
      className={`relative p-5 rounded-[1.5rem] border transition-all duration-300 text-left w-full h-full flex flex-col ${
        framework === id
          ? `bg-white border-${color}-500 shadow-md`
          : 'bg-white border-slate-100 hover:border-slate-300'
      }`}
    >
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${framework === id ? `bg-${color}-50 text-${color}-600` : 'bg-slate-50 text-slate-400'}`}>
          <Icon className="w-5 h-5" />
       </div>
       <h3 className={`font-bold mb-1 text-sm ${framework === id ? 'text-slate-900' : 'text-slate-600'}`}>{title}</h3>
       <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
    </button>
  );

  return (
    <div className="flex flex-col h-full space-y-8 pb-8">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-slide-up delay-75">
        <div className="mb-8">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Select Framework</label>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FrameworkCard 
                    id={ContentFramework.SYSTEM_REVEAL}
                    icon={Zap}
                    title="System Reveal"
                    desc="Case study workflow."
                    color="blue"
                />
                <FrameworkCard 
                    id={ContentFramework.REALITY_CHECK}
                    icon={Eye}
                    title="Reality Check"
                    desc="Mythbusting & truth."
                    color="purple"
                />
                <FrameworkCard 
                    id={ContentFramework.MINDSET_SHIFT}
                    icon={Brain}
                    title="Mindset Shift"
                    desc="Controversial takes."
                    color="orange"
                />
             </div>
        </div>

        <div className="flex flex-col">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">2. Topic</label>
          <div className="relative">
            <textarea
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none resize-none min-h-[120px] transition-all font-medium text-slate-700 placeholder:text-slate-400"
                placeholder="What do you want to write about?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            ></textarea>
            <div className="absolute bottom-4 right-4">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !topic}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:-translate-y-1 text-xs"
                >
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                    Generate Content
                </button>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up delay-200">
          
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                      <Layout className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Post Text</h3>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(result.postBody); }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 flex-1 overflow-auto custom-scrollbar bg-slate-50/30">
              <div className="prose prose-slate prose-sm max-w-none whitespace-pre-wrap font-medium leading-relaxed text-slate-600">
                {result.postBody}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden text-white flex flex-col h-[500px] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-6 border-b border-white/10 flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white/10 rounded-lg">
                  <ImageIcon className="w-4 h-4 text-purple-300" />
              </div>
              <span className="font-bold text-slate-200 text-sm">Visual Concept</span>
            </div>
            <div className="p-8 flex-1 overflow-auto custom-scrollbar relative z-10">
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-mono text-slate-300 leading-relaxed text-xs">
                {result.visualDescription}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};