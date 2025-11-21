import React from 'react';
import { UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Eye, Activity, ArrowUpRight, Calendar, BookOpen, MoreHorizontal } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
}

// Mock data
const MOCK_GROWTH_DATA = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 1200 },
  { name: 'Wed', value: 2400 },
  { name: 'Thu', value: 1800 },
  { name: 'Fri', value: 3200 },
  { name: 'Sat', value: 4100 },
  { name: 'Sun', value: 3800 },
];

export const Dashboard: React.FC<Props> = ({ userProfile }) => {
  
  const StatCard = ({ icon: Icon, label, value, subtext, color, bgColor, delay }: any) => (
    <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up ${delay} h-full flex flex-col justify-between`}>
       <div className="flex justify-between items-start mb-4">
          <div className={`p-4 rounded-[1.5rem] ${bgColor}`}>
             <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <button className="text-slate-300 hover:text-slate-500">
             <MoreHorizontal className="w-5 h-5" />
          </button>
       </div>
       <div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
          <div className="flex items-center gap-2">
             <p className="text-sm font-medium text-slate-400">{label}</p>
             {subtext && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">{subtext}</span>}
          </div>
       </div>
    </div>
  );

  const CourseCard = ({ title, category, color, number, delay }: any) => (
    <div className={`bg-white p-4 rounded-[2rem] border border-slate-100 flex items-center gap-4 animate-slide-up ${delay} hover:shadow-md transition-all cursor-pointer group`}>
        <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
            <BookOpen className="w-6 h-6 text-white opacity-80" />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{category}</span>
                <span className="text-[10px] font-bold text-slate-300">#{number}</span>
            </div>
            <h4 className="font-bold text-slate-800 text-sm mt-1 line-clamp-1">{title}</h4>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-100">
               {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold text-2xl">
                     {userProfile.name.charAt(0)}
                  </div>
               )}
            </div>
            <div>
               <h1 className="text-4xl font-bold text-slate-900 mb-1">Hey {userProfile.name.split(' ')[0]},</h1>
               <p className="text-slate-500 font-medium">It's a great day to build your authority. 🚀</p>
            </div>
         </div>
         <div className="flex gap-3">
             <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm text-xs font-bold text-slate-600 flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-slate-400" />
                 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
             </div>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Left Column: Stats */}
         <div className="lg:col-span-8 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={Users}
                    label="Connections"
                    value="2,543"
                    subtext="+12%"
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                    delay="delay-75"
                />
                <StatCard 
                    icon={Eye}
                    label="Impressions"
                    value="12.4k"
                    color="text-pink-500"
                    bgColor="bg-pink-50"
                    delay="delay-150"
                />
                <StatCard 
                    icon={Activity}
                    label="SSI Score"
                    value="84"
                    subtext="Top 1%"
                    color="text-amber-500"
                    bgColor="bg-amber-50"
                    delay="delay-200"
                />
            </div>

            {/* Chart Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-slide-up delay-300">
               <div className="flex justify-between items-center mb-8">
                   <div>
                       <h3 className="text-xl font-bold text-slate-900">Growth Analytics</h3>
                       <p className="text-sm text-slate-400 font-medium">Profile views over time</p>
                   </div>
                   <div className="flex gap-2">
                       <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"><ArrowUpRight className="w-4 h-4" /></span>
                   </div>
               </div>
               <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_GROWTH_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 500}} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 12, fill: '#94a3b8'}} 
                            />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}} 
                                contentStyle={{
                                    borderRadius: '16px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                                    padding: '16px',
                                    fontFamily: 'sans-serif'
                                }}
                                itemStyle={{color: '#1e293b', fontWeight: 'bold', fontSize: '12px'}}
                            />
                            <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                                {MOCK_GROWTH_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 5 ? '#a855f7' : '#f1f5f9'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Right Column: Activity/Suggestions */}
         <div className="lg:col-span-4 space-y-6">
            <div className="flex justify-between items-center px-2">
                <h3 className="font-bold text-slate-900">Recommended Actions</h3>
                <button className="text-xs font-bold text-slate-400 hover:text-slate-600">See all</button>
            </div>

            <CourseCard 
                title="Networking Mastery"
                category="Strategy"
                number="01"
                color="bg-blue-400"
                delay="delay-100"
            />
             <CourseCard 
                title="Viral Hooks 101"
                category="Content"
                number="02"
                color="bg-purple-400"
                delay="delay-150"
            />
             <CourseCard 
                title="Profile Optimization"
                category="Audit"
                number="03"
                color="bg-pink-400"
                delay="delay-200"
            />

            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg animate-slide-up delay-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold mb-4 inline-block backdrop-blur-sm">PRO TIP</span>
                    <h3 className="text-xl font-bold mb-2 leading-snug">Engage 15 mins daily.</h3>
                    <p className="text-indigo-200 text-xs mb-6 leading-relaxed">Consistency beats intensity. Check your Networking tab for today's leads.</p>
                    <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-colors">Start Session</button>
                </div>
            </div>

         </div>

      </div>
    </div>
  );
};