
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="glass rounded-[2rem] p-5 border border-white/5 shadow-2xl space-y-4 overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={post.user.avatar} className="w-10 h-10 rounded-full border-2 border-blue-400 p-0.5" alt={post.user.name} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#05011a] flex items-center justify-center">
              <span className="text-[8px] font-bold">✓</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm">{post.user.name}</h4>
            <span className="text-xs text-white/40">{post.timestamp}</span>
          </div>
        </div>
        <button className="p-1">
          <MoreHorizontal className="w-5 h-5 text-white/40" />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-white/90">{post.content}</p>

      {/* Code Rendering */}
      {post.type === 'code' && post.codeSnippet && (
        <div className="rounded-2xl bg-black/60 border border-white/10 p-5 font-mono text-xs overflow-x-auto relative">
          <div className="absolute top-3 right-3 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          <pre className="text-blue-300"><code>{post.codeSnippet}</code></pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <button 
            onClick={toggleLike}
            className={`flex items-center gap-1.5 transition-all ${liked ? 'text-red-500' : 'text-white/40 hover:text-white'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 animate-bounce' : ''}`} />
            <span className="text-[11px] font-black">{likesCount >= 1000 ? (likesCount/1000).toFixed(1) + 'K' : likesCount}</span>
          </button>
          <div className="w-px h-3 bg-white/10" />
          <button className="flex items-center gap-1.5 text-white/40 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-[11px] font-black">{post.comments}</span>
          </button>
          <div className="w-px h-3 bg-white/10" />
          <button className="flex items-center gap-1.5 text-white/40 hover:text-green-400 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        
        <button className="p-2 glass rounded-xl text-white/30 hover:text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
