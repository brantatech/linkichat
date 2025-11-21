import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Save, Upload, User } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export const Settings: React.FC<Props> = ({ userProfile, onUpdateProfile }) => {
  const [name, setName] = useState(userProfile.name);
  const [rawText, setRawText] = useState(userProfile.rawText);
  const [avatar, setAvatar] = useState<string | undefined>(userProfile.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network request
    setTimeout(() => {
      onUpdateProfile({
        ...userProfile,
        name,
        rawText,
        avatar
      });
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="animate-slide-up max-w-3xl mx-auto pb-8">
       <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          
          <div className="p-8 border-b border-slate-50">
             <h2 className="text-2xl font-bold text-slate-900">Profile Settings</h2>
             <p className="text-slate-400 text-sm font-medium">Manage your personal branding details.</p>
          </div>

          <div className="p-8 space-y-8">
             
             {/* Profile Picture */}
             <div className="flex items-center gap-6">
                <div className="relative group">
                   <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-sm">
                      {avatar ? (
                         <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300">
                            <User className="w-10 h-10" />
                         </div>
                      )}
                   </div>
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-md hover:bg-slate-800 transition-colors"
                   >
                      <Upload className="w-3 h-3" />
                   </button>
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      accept="image/*" 
                      className="hidden" 
                   />
                </div>
                <div>
                   <h3 className="font-bold text-slate-800 text-sm">Profile Photo</h3>
                   <p className="text-xs text-slate-400 max-w-[200px] mt-1">Recommended: Square JPG, PNG, or WEBP. Max 2MB.</p>
                   {avatar && (
                      <button onClick={() => setAvatar(undefined)} className="text-xs text-red-500 font-bold mt-2 hover:underline">Remove Photo</button>
                   )}
                </div>
             </div>

             {/* Name */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Display Name</label>
                <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-slate-700"
                />
             </div>

             {/* Profile Data */}
             <div className="space-y-2">
                <div className="flex justify-between items-center ml-1 mb-1">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio & Experience Data</label>
                   <span className="text-[10px] text-slate-400 font-medium">Used for AI Context</span>
                </div>
                <textarea 
                   value={rawText}
                   onChange={(e) => setRawText(e.target.value)}
                   className="w-full h-48 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm font-medium text-slate-600 leading-relaxed custom-scrollbar"
                   placeholder="Your Headline, About section, and Experience..."
                />
             </div>
             
             <div className="pt-4 flex justify-end">
                <button
                   onClick={handleSave}
                   disabled={isSaving}
                   className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                   {isSaving ? (
                      <>Saving...</>
                   ) : (
                      <><Save className="w-4 h-4" /> Save Changes</>
                   )}
                </button>
             </div>

          </div>
       </div>
    </div>
  );
};