
import React from 'react';
import { 
  User as UserIcon, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Moon, 
  Shield, 
  MessageSquare,
  X,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';
import Logo from './Logo';
import { supabase } from '../services/supabase';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  onNavigate: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user, onLogout, onNavigate }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#05011a] border-r border-white/5 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
        {/* User Profile Header */}
        <div className="p-6 bg-gradient-to-br from-blue-600/20 to-transparent border-b border-white/5">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 overflow-hidden shadow-xl">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.id}`} 
                className="w-full h-full object-cover" 
                alt="" 
              />
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">{user?.name || 'Vibogram User'}</h3>
            <p className="text-xs font-bold text-blue-400 tracking-widest uppercase">
              @{user?.username || 'username'}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <MenuSection title="Asosiy">
            <MenuItem 
              icon={<UserIcon size={20} />} 
              label="Mening Profilim" 
              onClick={() => { onNavigate('pricing'); onClose(); }} 
            />
            <MenuItem 
              icon={<MessageSquare size={20} />} 
              label="Xabarlar" 
              onClick={() => { onNavigate('chat'); onClose(); }} 
            />
            <MenuItem 
              icon={<Bell size={20} />} 
              label="Bildirishnomalar" 
              badge="3"
            />
          </MenuSection>

          <MenuSection title="Sozlamalar">
            <MenuItem icon={<Settings size={20} />} label="Ilova Sozlamalari" />
            <MenuItem icon={<Shield size={20} />} label="Maxfiylik" />
            <MenuItem icon={<Moon size={20} />} label="Tungi Rejim" isToggle />
          </MenuSection>

          <MenuSection title="Yordam">
            <MenuItem icon={<HelpCircle size={20} />} label="Yordam Markazi" />
          </MenuSection>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Chiqish</span>
          </button>
          
          <div className="mt-4 flex flex-col items-center gap-2 opacity-20">
            <Logo size={24} />
            <p className="text-[8px] font-black uppercase tracking-[0.3em]">Vibogram v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-1 py-2">
    <h4 className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">{title}</h4>
    {children}
  </div>
);

const MenuItem = ({ 
  icon, 
  label, 
  onClick, 
  badge, 
  isToggle 
}: { 
  icon: React.ReactNode, 
  label: string, 
  onClick?: () => void,
  badge?: string,
  isToggle?: boolean
}) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="text-white/40 group-hover:text-blue-400 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && (
        <span className="px-2 py-0.5 bg-blue-600 rounded-lg text-[10px] font-black text-white shadow-lg shadow-blue-600/30">
          {badge}
        </span>
      )}
      {isToggle ? (
        <div className="w-8 h-4 bg-white/10 rounded-full relative">
          <div className="absolute left-1 top-1 w-2 h-2 bg-white/40 rounded-full" />
        </div>
      ) : (
        <ChevronRight size={14} className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
      )}
    </div>
  </button>
);

export default Sidebar;
