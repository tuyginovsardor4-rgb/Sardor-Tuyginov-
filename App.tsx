
import React, { useState } from 'react';
import { Menu, Search, Plus, Sparkles, Code2, LogIn, X } from 'lucide-react';
import { POSTS, STORIES } from './constants';
import { AppTab, User } from './types';
import PostCard from './components/PostCard';
import StoriesBar from './components/StoriesBar';
import BottomNav from './components/BottomNav';
import AIChat from './components/AIChat';
import CodePlayground from './components/CodePlayground';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentUser] = useState<User>({
    id: 'me',
    name: 'Sardor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sardor'
  });

  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden bg-[#05011a]">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={currentUser}
        onLogout={() => {
          setIsLoggedIn(false);
          setIsSidebarOpen(false);
        }}
      />

      {/* Optimized Header */}
      <header className="sticky top-0 z-[60] px-5 py-4 flex items-center justify-between glass border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center glass rounded-xl active:scale-90 transition-all hover:bg-white/5"
          >
            <Menu className="w-5 h-5 text-white/70" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight text-white neon-text">Vibogram</h1>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="w-10 h-10 flex items-center justify-center glass rounded-xl active:scale-90 transition-all hover:bg-white/5">
            <Search className="w-5 h-5 text-white/70" />
          </button>
          <button 
            onClick={() => setShowCreatePost(true)}
            className="w-10 h-10 flex items-center justify-center bg-blue-600/20 glass border border-blue-500/20 rounded-xl active:scale-90 transition-all shadow-lg shadow-blue-500/10"
          >
            <Plus className="w-6 h-6 text-blue-400" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-32 overflow-y-auto scrollbar-hide">
        {activeTab === 'home' && (
          <div className="space-y-6 pt-4 px-4 animate-in fade-in duration-500">
            <StoriesBar stories={STORIES} />
            
            {/* Feed Tabs */}
            <div className="flex items-center justify-between glass p-1.5 rounded-2xl px-4 mx-1">
              <div className="flex gap-2 w-full">
                <button className="flex-1 text-white font-bold bg-blue-600 px-4 py-2 rounded-xl text-xs shadow-lg shadow-blue-500/30 transition-all">All Posts</button>
                <button className="flex-1 text-white/40 font-medium px-4 py-2 rounded-xl text-xs hover:text-white/60 transition-colors">Following</button>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
              {POSTS.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col items-center justify-center h-[70vh] text-white/40 p-10 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
               <LogIn className="w-10 h-10 opacity-20" />
            </div>
            <p className="italic text-sm">Xabarlar bo'limi tez kunda ishga tushadi...</p>
          </div>
        )}

        {activeTab === 'ai' && <AIChat />}
        {activeTab === 'code' && <CodePlayground />}
        {activeTab === 'pricing' && <ProfileView user={currentUser} onLogout={() => setIsLoggedIn(false)} />}
      </main>

      {/* VSCode Floating Button - High Visibility */}
      <button 
        onClick={() => setActiveTab('code')}
        className={`fixed bottom-28 right-6 w-14 h-14 rounded-2xl glass border border-blue-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] z-[55] transition-all hover:scale-110 active:scale-95 ${activeTab === 'code' ? 'bg-blue-600 scale-110 shadow-blue-500/50' : 'bg-[#0a061e]'}`}
      >
        <Code2 className="w-7 h-7 text-white" />
      </button>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in slide-in-from-bottom-20 duration-300">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-7 border border-white/10 mb-20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black">Share Code</h3>
              <button onClick={() => setShowCreatePost(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <X size={20}/>
              </button>
            </div>
            <textarea 
              placeholder="What's happening in your code today?"
              className="w-full h-32 bg-transparent border-none focus:outline-none text-white/90 placeholder:text-white/20 resize-none text-lg mb-4"
              autoFocus
            />
            <div className="flex gap-2 mb-8">
              <button className="flex-1 py-3 rounded-xl glass text-xs font-bold text-white/60 hover:bg-white/10 transition-colors">Attach File</button>
              <button className="flex-1 py-3 rounded-xl glass text-xs font-bold text-white/60 hover:bg-white/10 transition-colors">Snippet</button>
            </div>
            <button className="w-full py-5 bg-blue-600 rounded-2xl font-black text-white shadow-xl shadow-blue-600/40 active:scale-95 transition-all uppercase tracking-widest">Broadcast Post</button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
