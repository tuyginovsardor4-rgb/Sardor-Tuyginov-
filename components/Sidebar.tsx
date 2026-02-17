
import React from 'react';
import { X, Settings, User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Zap } from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user, onLogout }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] glass border-r border-white/10 z-[101] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-black tracking-tight neon-text">Menu</span>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center glass rounded-xl hover:bg-white/5 active:scale-90 transition-all"
            >
              <X className="w-5 h-5 text-white/50" />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="glass p-4 rounded-2xl border-white/5 mb-8 flex items-center gap-3">
            <img src={user.avatar} className="w-12 h-12 rounded-full border border-blue-500/30" alt={user.name} />
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm truncate">{user.name}</h4>
              <p className="text-[10px] text-white/40 truncate">vibogram.io/sardor</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <SidebarItem icon={<User size={18} />} label="Mening Profilim" />
            <SidebarItem icon={<Bell size={18} />} label="Bildirishnomalar" badge="12" />
            <SidebarItem icon={<Settings size={18} />} label="Sozlamalar" />
            <SidebarItem icon={<Shield size={18} />} label="Xavfsizlik" />
            <SidebarItem icon={<HelpCircle size={18} />} label="Yordam Markazi" />
          </nav>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-white/5">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-between p-4 glass rounded-2xl text-red-400 hover:bg-red-400/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                <span className="text-sm font-bold">Chiqish</span>
              </div>
              <ChevronRight size={14} className="opacity-40 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-center text-white/20 mt-6 uppercase tracking-[0.2em] font-medium">Vibogram v1.0.4</p>
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ icon, label, badge }: { icon: React.ReactNode, label: string, badge?: string }) => (
  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group active:scale-[0.98]">
    <div className="flex items-center gap-3 text-white/70 group-hover:text-white transition-colors">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && (
        <span className="bg-blue-600 px-1.5 py-0.5 rounded-lg text-[9px] font-black text-white">{badge}</span>
      )}
      <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
    </div>
  </button>
);

export default Sidebar;
