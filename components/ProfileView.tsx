
import React from 'react';
import { Settings, LogOut, Grid, Bookmark, Award, Star, UserPlus } from 'lucide-react';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Optimized Profile Header */}
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 via-purple-600 to-indigo-600 p-1.5 shadow-2xl shadow-blue-500/30">
            <div className="w-full h-full rounded-full bg-[#05011a] p-1.5 overflow-hidden">
              <img src={user.avatar} className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500" alt={user.name} />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-xl border-4 border-[#05011a] shadow-lg">
            <UserPlus className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
          <p className="text-white/40 text-sm font-medium">Fullstack Developer | AI Enthusiast</p>
        </div>

        <div className="flex gap-3 w-full">
          <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-95">Edit Profile</button>
          <button className="w-14 h-14 flex items-center justify-center glass rounded-2xl hover:bg-white/10 transition-all active:scale-95">
            <Settings className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>

      {/* Optimized Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Posts" value="128" />
        <StatCard label="Followers" value="12.5K" />
        <StatCard label="Stars" value="842" />
      </div>

      {/* Profile Tabs */}
      <div className="flex glass p-1 rounded-2xl">
        <button className="flex-1 py-3 bg-white/10 rounded-xl text-blue-400 flex justify-center shadow-inner"><Grid size={20}/></button>
        <button className="flex-1 py-3 text-white/20 flex justify-center hover:text-white/40 transition-colors"><Star size={20}/></button>
        <button className="flex-1 py-3 text-white/20 flex justify-center hover:text-white/40 transition-colors"><Bookmark size={20}/></button>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5,6,7,8,9].map(i => (
          <div key={i} className="aspect-square glass rounded-2xl overflow-hidden group relative border border-white/5">
            <img src={`https://picsum.photos/seed/${i + 50}/300/300`} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
              <span className="text-[10px] font-black text-blue-400">#vibe_{i}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-5 glass border-red-500/20 text-red-500 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-red-500/10 transition-all active:scale-95"
      >
        <LogOut size={18} /> Logout Session
      </button>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string, value: string }) => (
  <div className="glass p-5 rounded-[2rem] text-center border border-white/5 hover:border-blue-500/30 transition-colors group">
    <p className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{value}</p>
    <p className="text-[9px] text-white/30 uppercase tracking-[0.1em] font-black mt-1">{label}</p>
  </div>
);

export default ProfileView;
