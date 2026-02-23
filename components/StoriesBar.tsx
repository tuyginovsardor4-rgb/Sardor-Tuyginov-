
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../services/supabase';

interface StoriesBarProps {
  currentUser: User | null;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ currentUser }) => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (data) {
      setStories(data);
    }
    setLoading(false);
  };

  const handleAddStory = async () => {
    const url = prompt("Story uchun rasm/video URL kiriting:");
    if (!url || !currentUser) return;

    const { error } = await supabase
      .from('stories')
      .insert([{ 
        user_id: currentUser.id, 
        media_url: url 
      }]);

    if (!error) {
      fetchStories();
    }
  };

  return (
    <div className="flex items-center gap-5 overflow-x-auto pb-6 scrollbar-hide px-1">
      {/* Add Story */}
      <div className="flex flex-col items-center gap-2.5 min-w-[75px] group cursor-pointer" onClick={handleAddStory}>
        <div className="relative">
          <div className="w-[72px] h-[72px] rounded-[2rem] bg-blue-600/10 border-2 border-dashed border-blue-500/30 flex items-center justify-center group-hover:border-blue-500 transition-all">
            <Plus className="w-8 h-8 text-blue-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-xl border-4 border-[#05011a] flex items-center justify-center shadow-lg">
            <Plus size={12} className="text-white" />
          </div>
        </div>
        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Sizniki</span>
      </div>

      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-2.5 min-w-[75px] group cursor-pointer">
          <div className="p-[3px] rounded-[2rem] bg-gradient-to-tr from-blue-500 via-purple-600 to-indigo-600 shadow-lg shadow-blue-500/20">
            <div className="p-[3px] bg-[#05011a] rounded-[1.8rem]">
              <img 
                src={story.profiles.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${story.profiles.id}`} 
                className="w-14 h-14 rounded-[1.5rem] object-cover group-hover:scale-110 transition-transform duration-500" 
                alt="" 
              />
            </div>
          </div>
          <span className="text-[10px] text-white/60 font-black uppercase tracking-widest whitespace-nowrap truncate w-full text-center">
            {story.profiles.full_name?.split(' ')[0] || 'User'}
          </span>
        </div>
      ))}

      {loading && [1,2,3].map(i => (
        <div key={i} className="flex flex-col items-center gap-2.5 min-w-[75px] animate-pulse">
          <div className="w-[72px] h-[72px] rounded-[2rem] bg-white/5 border border-white/5" />
          <div className="w-10 h-2 bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default StoriesBar;
