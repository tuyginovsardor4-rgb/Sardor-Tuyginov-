
import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="glass rounded-[2rem] p-5 border border-white/5 shadow-2xl space-y-4 overflow-hidden">
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

      {/* Media Rendering */}
      {post.type === 'code' && post.codeSnippet && (
        <div className="rounded-2xl bg-black/40 border border-white/10 p-4 font-mono text-xs overflow-x-auto relative group">
          <div className="absolute top-2 right-2 flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <pre className="text-blue-300">
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {post.type === 'image' && post.mediaUrl && (
        <div className="relative rounded-2xl overflow-hidden aspect-video">
          <img src={post.mediaUrl} className="w-full h-full object-cover" alt="Post content" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
             <div className="glass px-2 py-1 rounded-lg text-[10px] flex items-center gap-1">
               <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
               LIVE PREVIEW
             </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full">
          <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            <span className="text-xs font-medium">{(post.likes / 1000).toFixed(1)}K</span>
          </button>
          <div className="w-px h-3 bg-white/10" />
          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium">{post.comments}</span>
          </button>
          <div className="w-px h-3 bg-white/10" />
          <button className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
            <Share2 className="w-4 h-4 text-white/40" />
            <span className="text-xs font-medium">{post.shares}</span>
          </button>
          <ChevronRight className="w-4 h-4 text-white/20" />
        </div>
        
        <button className="p-2 glass rounded-xl">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
