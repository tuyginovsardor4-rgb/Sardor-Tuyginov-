
import React from 'react';
import { Story } from '../types';
import { ChevronRight, Plus } from 'lucide-react';

interface StoriesBarProps {
  stories: Story[];
}

const StoriesBar: React.FC<StoriesBarProps> = ({ stories }) => {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-2 min-w-[70px] group">
          <div className={`p-0.5 rounded-full ${story.seen ? 'border-2 border-white/20' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] border-2 border-transparent'} relative`}>
            <div className="p-0.5 bg-[#05011a] rounded-full">
              <img src={story.user.avatar} className="w-14 h-14 rounded-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt={story.user.name} />
            </div>
            {!story.seen && (
              <div className="absolute -bottom-1 right-0 w-5 h-5 bg-blue-500 rounded-full border-4 border-[#05011a] flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
          <span className="text-[10px] text-white/60 font-medium whitespace-nowrap">{story.user.name}</span>
        </div>
      ))}
      
      <div className="flex flex-col items-center gap-2 min-w-[70px]">
        <div className="w-16 h-16 rounded-full glass border border-blue-400/30 flex items-center justify-center">
          <Plus className="w-8 h-8 text-blue-400" />
        </div>
        <span className="text-[10px] text-white/60 font-medium">Add Story</span>
      </div>
      
      <div className="flex items-center justify-center min-w-[40px]">
         <ChevronRight className="w-6 h-6 text-white/30" />
      </div>
    </div>
  );
};

export default StoriesBar;
