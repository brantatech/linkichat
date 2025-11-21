import React, { useState, useEffect } from 'react';
import { AppView, UserProfile, NetworkingResult } from './types';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { NetworkingTool } from './components/NetworkingTool';
import { ContentEngine } from './components/ContentEngine';
import { ProfileAudit } from './components/ProfileAudit';
import { Settings } from './components/Settings';
import { AuthScreen } from './components/AuthScreen';
import { LayoutDashboard, Users, PenTool, Search, Zap, Settings as SettingsIcon, Bell, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Helper to save to localStorage with validation
  const saveProfileToStorage = (profile: UserProfile) => {
    if (profile.email) {
      try {
        localStorage.setItem(`linkichat_user_${profile.email}`, JSON.stringify(profile));
      } catch (e) {
        console.error("Storage failed", e);
      }
    }
  };

  const handleLogin = (email: string) => {
    const savedData = localStorage.getItem(`linkichat_user_${email}`);
    
    if (savedData) {
      try {
        const parsedProfile = JSON.parse(savedData);
        setUserProfile(parsedProfile);
        // If they are already trained, go to dashboard, else onboarding
        setView(parsedProfile.isTrained ? AppView.DASHBOARD : AppView.ONBOARDING);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
        // Fallback if corrupt
        setUserProfile({ 
           name: '', 
           rawText: '', 
           isTrained: false, 
           email,
           networkingHistory: [] 
        });
        setView(AppView.ONBOARDING);
      }
    } else {
      // New User
      setUserProfile({ 
         name: '', 
         rawText: '', 
         isTrained: false, 
         email,
         networkingHistory: []
      });
      setView(AppView.ONBOARDING);
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    const newProfile = { 
        ...profile, 
        email: userProfile?.email, 
        networkingHistory: userProfile?.networkingHistory || [] 
    };
    setUserProfile(newProfile);
    saveProfileToStorage(newProfile);
    setView(AppView.DASHBOARD);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
     setUserProfile(updatedProfile);
     saveProfileToStorage(updatedProfile);
  };

  const handleSaveNetworking = (result: NetworkingResult) => {
    if (userProfile) {
      const updatedHistory = [result, ...(userProfile.networkingHistory || [])];
      const updatedProfile = { ...userProfile, networkingHistory: updatedHistory };
      setUserProfile(updatedProfile);
      saveProfileToStorage(updatedProfile);
    }
  };

  const handleDeleteNetworkingHistory = (id: string) => {
      if (userProfile && userProfile.networkingHistory) {
          const updatedHistory = userProfile.networkingHistory.filter(item => item.id !== id);
          const updatedProfile = { ...userProfile, networkingHistory: updatedHistory };
          setUserProfile(updatedProfile);
          saveProfileToStorage(updatedProfile);
      }
  }

  const handleLogout = () => {
     setUserProfile(null);
     setView(AppView.AUTH);
  };

  if (view === AppView.AUTH) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (view === AppView.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!userProfile) return null;

  const NavItem = ({ active, icon: Icon, label, onClick }: any) => (
    <button
      onClick={onClick}
      className={`w-full group flex items-center gap-4 px-6 py-4 transition-all duration-300 relative ${
        active 
          ? 'text-slate-900 font-bold' 
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-slate-900 rounded-r-full"></div>
      )}
      <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'text-slate-900 scale-110' : 'group-hover:scale-105'}`} />
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] font-sans text-slate-900">
      {/* Minimalist Sidebar */}
      <aside className="w-20 lg:w-64 bg-white flex flex-col shrink-0 z-20 border-r border-slate-100 hidden md:flex">
        <div className="p-8 mb-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                <Zap className="w-4 h-4 text-white fill-white" />
             </div>
             <span className="font-bold text-lg tracking-tight text-slate-900 hidden lg:block">Linkichat</span>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <NavItem 
            active={view === AppView.DASHBOARD} 
            icon={LayoutDashboard} 
            label="Dashboard" 
            onClick={() => setView(AppView.DASHBOARD)} 
          />
          <NavItem 
            active={view === AppView.NETWORKING} 
            icon={Users} 
            label="Networking" 
            onClick={() => setView(AppView.NETWORKING)} 
          />
          <NavItem 
            active={view === AppView.CONTENT} 
            icon={PenTool} 
            label="Content" 
            onClick={() => setView(AppView.CONTENT)} 
          />
          <NavItem 
            active={view === AppView.AUDIT} 
            icon={Search} 
            label="Audit" 
            onClick={() => setView(AppView.AUDIT)} 
          />
          <div className="my-2 border-t border-slate-50 mx-6"></div>
          <NavItem 
            active={view === AppView.SETTINGS} 
            icon={SettingsIcon} 
            label="Settings" 
            onClick={() => setView(AppView.SETTINGS)} 
          />
        </nav>

        <div className="p-6 mt-auto">
           <div className="bg-purple-50 rounded-2xl p-4 hidden lg:block mb-4">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs overflow-hidden">
                    {userProfile.avatar ? (
                       <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                       userProfile.name.charAt(0)
                    )}
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{userProfile.email || 'Pro Plan'}</p>
                 </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full py-2 bg-white border border-purple-100 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors flex items-center justify-center gap-1"
              >
                 <LogOut className="w-3 h-3" /> Sign Out
              </button>
           </div>
           
           <div className="text-[10px] text-slate-400 text-center">
              Product of <a href="https://brantatech.com" target="_blank" rel="noreferrer" className="text-slate-600 font-bold hover:underline">Branta Tech</a>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-8 shrink-0 z-10">
          <div>
             <h2 className="font-bold text-2xl text-slate-900">
              {view === AppView.DASHBOARD && 'Overview'}
              {view === AppView.NETWORKING && 'Networking'}
              {view === AppView.CONTENT && 'Content Creation'}
              {view === AppView.AUDIT && 'Profile Audit'}
              {view === AppView.SETTINGS && 'Account Settings'}
             </h2>
             <p className="text-slate-400 text-xs font-medium mt-1">
                {view === AppView.SETTINGS ? 'Update your preferences and profile.' : "Let's build your authority today."}
             </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-white rounded-full text-sm font-medium text-slate-600 focus:outline-none shadow-sm w-64 border border-slate-100" />
             </div>
             <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 hover:text-slate-600">
                <Bell className="w-4 h-4" />
             </button>
             
             {/* Mobile Menu Toggle */}
             <div className="md:hidden w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white">
                {userProfile.name.charAt(0)}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-0 relative">
           <div className="max-w-[1600px] mx-auto pb-10">
            {view === AppView.DASHBOARD && <Dashboard userProfile={userProfile} />}
            {view === AppView.NETWORKING && (
               <NetworkingTool 
                  userProfile={userProfile} 
                  onSaveResult={handleSaveNetworking} 
                  onDeleteResult={handleDeleteNetworkingHistory}
               />
            )}
            {view === AppView.CONTENT && <ContentEngine userProfile={userProfile} />}
            {view === AppView.AUDIT && <ProfileAudit userProfile={userProfile} />}
            {view === AppView.SETTINGS && <Settings userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />}
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;