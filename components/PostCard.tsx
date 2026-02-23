
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Pause, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const renderMedia = () => {
    if (post.type === 'image' && post.mediaUrl) {
      return (
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/5">
          <img 
            src={post.mediaUrl} 
            className="w-full h-full object-cover" 
            alt="" 
          />
        </div>
      );
    }
    
    if (post.type === 'video' && post.mediaUrl) {
      return (
        <div className="relative aspect-[9/16] max-h-[600px] overflow-hidden rounded-3xl border border-white/5 bg-black group">
          <video 
            src={post.mediaUrl} 
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            onClick={() => setIsPlaying(!isPlaying)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            ref={(el) => {
              if (el) {
                if (isPlaying) el.play().catch(() => {});
                else el.pause();
              }
            }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {!isPlaying && (
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                <Play size={32} className="text-white fill-white ml-1" />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center active:scale-90 transition-all"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {post.title && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="text-sm font-black text-white tracking-tight">{post.title}</h4>
            </div>
          )}
        </div>
      );
    }

    if (post.type === 'code' && post.codeSnippet) {
      return (
        <div className="glass rounded-3xl p-6 border border-white/5 font-mono text-xs overflow-x-auto bg-black/40">
          <div className="flex items-center justify-between mb-4 opacity-30">
            <span className="uppercase tracking-widest font-black">{post.language || 'code'}</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          </div>
          <pre className="text-blue-300"><code>{post.codeSnippet}</code></pre>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="glass rounded-[2.5rem] border border-white/5 p-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 overflow-hidden">
              <img src={post.user.avatar} className="w-full h-full object-cover" alt="" />
            </div>
            {post.user.isLive && (
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-red-600 rounded-md text-[8px] font-black text-white border-2 border-[#05011a] uppercase tracking-tighter">
                Live
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-black text-white">{post.user.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{post.timestamp}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">@{post.user.username || 'user'}</span>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/20 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-white/80 leading-relaxed font-medium px-1">
        {post.content}
      </p>

      {/* Media */}
      {renderMedia()}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${isLiked ? 'bg-red-600/20 text-red-500 shadow-lg shadow-red-600/10' : 'glass text-white/40 hover:bg-white/5'}`}
          >
            <Heart size={18} className={isLiked ? 'fill-red-500' : ''} />
            <span className="text-xs font-black">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-3 rounded-2xl glass text-white/40 hover:bg-white/5 transition-all">
            <MessageCircle size={18} />
            <span className="text-xs font-black">{post.comments}</span>
          </button>
        </div>
        <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:bg-white/5 transition-all">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
