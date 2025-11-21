import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { auditProfile } from '../services/geminiService';
import { ShieldCheck, ScanLine, CheckCircle2 } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
}

export const ProfileAudit: React.FC<Props> = ({ userProfile }) => {
  const [auditResult, setAuditResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const runAudit = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const res = await auditProfile(userProfile.rawText);
        setAuditResult(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    runAudit();
  }, [userProfile.rawText]);

  return (
    <div className="h-full flex flex-col space-y-6 pb-8">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden animate-slide-up flex items-center gap-8">
        <div className="p-6 bg-emerald-50 rounded-[2rem] shrink-0">
            <ShieldCheck className="w-12 h-12 text-emerald-600" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Authority Audit</h2>
            <p className="text-slate-500 font-medium">Comparing your profile against Top 1% Creators.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-0 overflow-hidden flex flex-col animate-slide-up delay-100 relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
             <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-50 flex items-center justify-center">
                   <ScanLine className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
                <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
             </div>
             <h3 className="font-bold text-slate-800">Scanning Profile Data...</h3>
          </div>
        ) : (
          <div className="flex flex-col h-full">
             <div className="bg-emerald-50/50 border-b border-emerald-100 p-4 flex items-center gap-2 px-8">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-800 text-sm">Analysis Complete</span>
             </div>
             <div className="flex-1 overflow-auto p-8 custom-scrollbar">
               <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-600 leading-relaxed font-medium">
                    {auditResult}
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};