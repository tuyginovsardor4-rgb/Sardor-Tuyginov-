
import React from 'react';
import { Home, MessageCircle, Sparkles, LayoutGrid, Package } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[70] px-4 pb-4">
      <div className="glass rounded-[2.5rem] p-2 flex items-center justify-between border border-white/10 shadow-[0_-20px_40px_-20px_rgba(59,130,246,0.3)] relative active-nav-glow">
        <NavItem 
          icon={<Home className="w-6 h-6" />} 
          label="Home" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
        />
        <NavItem 
          icon={<MessageCircle className="w-6 h-6" />} 
          label="Chat" 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
        />

        {/* High-End Central AI Core */}
        <div className="relative -top-12 mx-2">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-90 relative overflow-hidden group ${
              activeTab === 'ai' 
              ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600' 
              : 'glass border border-white/20'
            }`}
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
            <div className="relative">
              <Sparkles className={`w-10 h-10 ${activeTab === 'ai' ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-blue-400'}`} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_5px_#3b82f6]"></span>
              </span>
            </div>
          </button>
        </div>

        <NavItem 
          icon={<Package className="w-6 h-6" />} 
          label="Pricing" 
          active={activeTab === 'pricing'} 
          onClick={() => setActiveTab('pricing')} 
        />
        <NavItem 
          icon={<LayoutGrid className="w-6 h-6" />} 
          label="More" 
          active={activeTab === 'pricing'} 
          onClick={() => setActiveTab('pricing')} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all flex-1 py-3 group relative ${active ? 'text-blue-400' : 'text-white/30'}`}
  >
    <div className={`transition-transform duration-300 group-active:scale-90 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tighter transition-all ${active ? 'opacity-100 translate-y-0' : 'opacity-60'}`}>
      {label}
    </span>
    {active && (
      <div className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
    )}
  </button>
);

export default BottomNav;
