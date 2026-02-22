
import React, { useState, useEffect } from 'react';
import { Menu, Search, Plus, Code2, LogIn, X, Bell } from 'lucide-react';
import { POSTS as INITIAL_POSTS, STORIES } from './constants';
import { AppTab, User, Post } from './types';
import PostCard from './components/PostCard';
import StoriesBar from './components/StoriesBar';
import BottomNav from './components/BottomNav';
import AIChat from './components/AIChat';
import CodePlayground from './components/CodePlayground';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import Logo from './components/Logo';
import ChatView from './components/ChatView';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        type,
        likes_count,
        comments_count,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else if (data) {
      const formattedPosts: Post[] = data.map((p: any) => ({
        id: p.id,
        user: {
          id: p.profiles.id,
          name: p.profiles.full_name || 'User',
          avatar: p.profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.profiles.id}`
        },
        timestamp: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: p.content,
        type: p.type as any,
        likes: p.likes_count,
        comments: p.comments_count,
        shares: 0
      }));
      setPosts(formattedPosts);
    }
    setLoadingPosts(false);
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
        });
      }
    });

    fetchPosts();

    // Real-time posts update
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
        });
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => setNotifications(prev => prev.slice(1)), 3000);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !currentUser) return;
    
    const { error } = await supabase
      .from('posts')
      .insert([
        { 
          user_id: currentUser.id, 
          content: newPostContent,
          type: 'text'
        }
      ]);

    if (error) {
      console.error('Error saving post:', error);
      addNotification("Xatolik: Post saqlanmadi ❌");
    } else {
      setNewPostContent('');
      setShowCreatePost(false);
      addNotification("Post muvaffaqiyatli ulashildi! 🚀");
      fetchPosts(); // Refresh posts
    }
  };

  if (!isLoggedIn || !currentUser) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden bg-[#05011a]">
      {/* Notifications Toast */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] space-y-2 pointer-events-none">
        {notifications.map((note, i) => (
          <div key={i} className="glass px-6 py-3 rounded-2xl border-blue-500/30 text-xs font-bold animate-in slide-in-from-top-4 shadow-xl text-blue-400">
            {note}
          </div>
        ))}
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={currentUser}
        onLogout={() => {
          setIsLoggedIn(false);
          setIsSidebarOpen(false);
        }}
      />

      <header className="sticky top-0 z-[60] px-5 py-4 flex items-center justify-between glass border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center glass rounded-xl active:scale-90 transition-all"
          >
            <Menu className="w-5 h-5 text-white/70" />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <h1 className="text-xl font-bold tracking-tight text-white neon-text">Vibogram</h1>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="w-10 h-10 flex items-center justify-center glass rounded-xl active:scale-90 relative">
            <Bell className="w-5 h-5 text-white/70" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#05011a]"></span>
          </button>
          <button 
            onClick={() => setShowCreatePost(true)}
            className="w-10 h-10 flex items-center justify-center bg-blue-600/20 glass border border-blue-500/20 rounded-xl active:scale-90"
          >
            <Plus className="w-6 h-6 text-blue-400" />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-32 overflow-y-auto scrollbar-hide">
        {activeTab === 'home' && (
          <div className="space-y-6 pt-4 px-4 animate-in fade-in">
            <StoriesBar stories={STORIES} />
            <div className="space-y-6">
              {loadingPosts ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Loading Feed...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white/10" />
                  </div>
                  <p className="text-white/40 text-sm italic">Hali postlar yo'q. Birinchi bo'lib ulashing!</p>
                </div>
              ) : (
                posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && <ChatView currentUser={currentUser} />}

        {activeTab === 'ai' && <AIChat />}
        {activeTab === 'code' && <CodePlayground />}
        {activeTab === 'pricing' && <ProfileView user={currentUser} onLogout={() => setIsLoggedIn(false)} />}
      </main>

      <button 
        onClick={() => setActiveTab('code')}
        className={`fixed bottom-28 right-6 w-14 h-14 rounded-2xl glass border border-blue-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] z-[55] transition-all hover:scale-110 active:scale-95 ${activeTab === 'code' ? 'bg-blue-600 scale-110 shadow-blue-500/50' : 'bg-[#0a061e]'}`}
      >
        <Code2 className="w-7 h-7 text-white" />
      </button>

      {showCreatePost && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in slide-in-from-bottom-20 duration-300">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-7 border border-white/10 mb-20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black">Broadcast Post</h3>
              <button onClick={() => setShowCreatePost(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10">
                <X size={20}/>
              </button>
            </div>
            <textarea 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Nima yangiliklar, bro?"
              className="w-full h-32 bg-transparent border-none focus:outline-none text-white/90 placeholder:text-white/20 resize-none text-lg mb-4"
              autoFocus
            />
            <button 
              onClick={handleCreatePost}
              className="w-full py-5 bg-blue-600 rounded-2xl font-black text-white shadow-xl shadow-blue-600/40 active:scale-95 transition-all uppercase tracking-widest"
            >
              Ulashish (Push)
            </button>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
