
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  LogOut, 
  Grid, 
  Bookmark, 
  Star, 
  Camera, 
  Edit3, 
  Check, 
  X, 
  Mail, 
  Phone, 
  AtSign, 
  Info,
  ChevronLeft,
  Video,
  Heart
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../services/supabase';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone: ''
  });
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');

  useEffect(() => {
    fetchProfile();
  }, [user.id]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfileData(data);
      setEditForm({
        full_name: data.full_name || '',
        username: data.username || '',
        bio: data.bio || '',
        phone: data.phone || ''
      });
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editForm.full_name,
        username: editForm.username,
        bio: editForm.bio,
        phone: editForm.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (!error) {
      setIsEditing(false);
      fetchProfile();
    } else {
      console.error('Update error:', error);
      alert('Xatolik yuz berdi!');
    }
    setLoading(false);
  };

  if (!profileData) return (
    <div className="min-h-screen bg-[#05011a] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05011a] text-white animate-in fade-in duration-500">
      {/* Header with Blur Background */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.id}`} 
          className="w-full h-full object-cover blur-2xl opacity-30 scale-110" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05011a]/50 to-[#05011a]" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <button className="w-10 h-10 glass rounded-xl flex items-center justify-center active:scale-90 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 glass rounded-xl flex items-center justify-center active:scale-90 transition-all">
              <Settings size={20} />
            </button>
            <button 
              onClick={onLogout}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-red-400 active:scale-90 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-blue-600/10 border-4 border-blue-500/20 overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
              <img 
                src={profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.id}`} 
                className="w-full h-full object-cover" 
                alt={profileData.full_name} 
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl border-4 border-[#05011a] flex items-center justify-center shadow-lg active:scale-90 transition-all">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="mt-6 space-y-1">
            <h2 className="text-3xl font-black tracking-tight">{profileData.full_name || 'Vibogram User'}</h2>
            <p className="text-blue-400 font-bold text-sm tracking-widest uppercase">Online</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="glass rounded-[2.5rem] p-6 border border-white/5 grid grid-cols-3 gap-4 shadow-2xl">
          <StatCard label="Postlar" value="0" />
          <StatCard label="Obunachilar" value="0" />
          <StatCard label="Layklar" value="0" />
        </div>
      </div>

      {/* Info Sections */}
      <div className="p-6 space-y-4 pb-32">
        <div className="glass rounded-[2.5rem] p-6 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Ma'lumotlar</h3>
            <button 
              onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-green-600 shadow-lg shadow-green-600/30' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {isEditing ? (
                <>{loading ? <X className="animate-spin" size={14} /> : <Check size={14} />} Saqlash</>
              ) : (
                <><Edit3 size={14} /> Tahrirlash</>
              )}
            </button>
          </div>

          <div className="space-y-5">
            {isEditing ? (
              <div className="space-y-4">
                <EditField 
                  icon={<AtSign size={18}/>} 
                  label="Username" 
                  value={editForm.username} 
                  onChange={(v) => setEditForm({...editForm, username: v})} 
                />
                <EditField 
                  icon={<Phone size={18}/>} 
                  label="Telefon" 
                  value={editForm.phone} 
                  onChange={(v) => setEditForm({...editForm, phone: v})} 
                />
                <EditField 
                  icon={<Info size={18}/>} 
                  label="Bio" 
                  value={editForm.bio} 
                  onChange={(v) => setEditForm({...editForm, bio: v})} 
                  isTextArea
                />
              </div>
            ) : (
              <>
                <InfoItem icon={<AtSign size={18} className="text-blue-400"/>} label={`@${profileData.username || 'user'}`} sub="Username" />
                <InfoItem icon={<Phone size={18} className="text-purple-400"/>} label={profileData.phone || 'Biriktirilmagan'} sub="Telefon" />
                <InfoItem icon={<Info size={18} className="text-emerald-400"/>} label={profileData.bio || 'Bio hali yozilmagan...'} sub="Bio" />
              </>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="glass rounded-[2.5rem] p-2 border border-white/5 flex gap-2">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all ${activeTab === 'posts' ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'hover:bg-white/5 text-white/40'}`}
          >
            <Grid size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Postlar</span>
          </button>
          <button 
            onClick={() => setActiveTab('reels')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all ${activeTab === 'reels' ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'hover:bg-white/5 text-white/40'}`}
          >
            <Video size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Reels</span>
          </button>
        </div>

        {/* Grid Placeholder */}
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square glass rounded-2xl border border-white/5 overflow-hidden group relative">
              <img 
                src={`https://picsum.photos/seed/${profileData.id + i}/300/300`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                alt="" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Heart size={14} className="fill-white" />
                <span className="text-[10px] font-bold">0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, sub }: { icon: React.ReactNode, label: string, sub: string }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-white/90">{label}</p>
      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{sub}</p>
    </div>
  </div>
);

const EditField = ({ icon, label, value, onChange, isTextArea }: any) => (
  <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 focus-within:border-blue-500/50 transition-all">
    <div className="mt-2 text-white/20">{icon}</div>
    <div className="flex-1">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{label}</p>
      {isTextArea ? (
        <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none text-sm text-white resize-none h-20"
        />
      ) : (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none text-sm text-white"
        />
      )}
    </div>
  </div>
);

const StatCard = ({ label, value }: { label: string, value: string }) => (
  <div className="text-center space-y-1">
    <p className="text-xl font-black text-white">{value}</p>
    <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">{label}</p>
  </div>
);

export default ProfileView;
