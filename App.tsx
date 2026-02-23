
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
  const [isAppReady, setIsAppReady] = useState(false);
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
        media_url,
        title,
        likes_count,
        comments_count,
        profiles (
          id,
          full_name,
          avatar_url,
          username
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
          avatar: p.profiles.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.profiles.full_name || p.profiles.id}`,
          username: p.profiles.username
        },
        timestamp: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: p.content,
        type: p.type as any,
        mediaUrl: p.media_url,
        title: p.title,
        likes: p.likes_count,
        comments: p.comments_count,
        shares: 0
      }));
      setPosts(formattedPosts);
    }
    setLoadingPosts(false);
  };

  const fetchUserProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return profile;
  };

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (!isAppReady) {
        console.warn('App initialization timed out, forcing ready state');
        setIsAppReady(true);
      }
    }, 6000);

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Session check error:', error);
        setIsAppReady(true);
        return;
      }

      if (session?.user) {
        try {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setCurrentUser({
              id: profile.id,
              name: profile.full_name || 'User',
              avatar: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.id}`,
              username: profile.username,
              bio: profile.bio,
              phone: profile.phone
            });
          } else {
            // Fallback if profile doesn't exist yet
            setCurrentUser({
              id: session.user.id,
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.id}`
            });
          }
          setIsLoggedIn(true);
        } catch (e) {
          console.error('Profile fetch error:', e);
          // Set emergency fallback to prevent stuck screen
          setCurrentUser({
            id: session.user.id,
            name: session.user.email?.split('@')[0] || 'User',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.id}`
          });
          setIsLoggedIn(true);
        }
      }
      setIsAppReady(true);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        try {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setCurrentUser({
              id: profile.id,
              name: profile.full_name || 'User',
              avatar: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.id}`,
              username: profile.username,
              bio: profile.bio,
              phone: profile.phone
            });
          } else {
            setCurrentUser({
              id: session.user.id,
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.id}`
            });
          }
        } catch (e) {
          console.error('Auth change profile fetch error:', e);
          // Set emergency fallback
          setCurrentUser({
            id: session.user.id,
            name: session.user.email?.split('@')[0] || 'User',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.id}`
          });
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setIsAppReady(true);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => setNotifications(prev => prev.slice(1)), 3000);
  };

  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [mediaUrl, setMediaUrl] = useState('');
  const [postTitle, setPostTitle] = useState('');

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !currentUser) return;
    
    const { error } = await supabase
      .from('posts')
      .insert([
        { 
          user_id: currentUser.id, 
          content: newPostContent,
          type: postType,
          media_url: mediaUrl || null,
          title: postTitle || null
        }
      ]);

    if (error) {
      console.error('Error saving post:', error);
      addNotification("Xatolik: Post saqlanmadi ❌");
    } else {
      setNewPostContent('');
      setMediaUrl('');
      setPostTitle('');
      setPostType('text');
      setShowCreatePost(false);
      addNotification("Post muvaffaqiyatli ulashildi! 🚀");
      fetchPosts();
    }
  };

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-[#05011a] flex flex-col items-center justify-center p-10 text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-500/20">
          <Logo size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">Konfiguratsiya xatosi</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Supabase URL yoki Anon Key topilmadi. Iltimos, Google AI Studio'dagi "Environment Variables" bo'limiga ushbu ma'lumotlarni kiriting.
          </p>
        </div>
        <div className="glass p-4 rounded-2xl border-white/5 text-left w-full max-w-xs">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Kerakli o'zgaruvchilar:</p>
          <ul className="text-[10px] font-mono text-blue-400 space-y-1">
            <li>• VITE_SUPABASE_URL</li>
            <li>• VITE_SUPABASE_ANON_KEY</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-[#05011a] flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-black rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/10 animate-pulse">
          <Logo size={60} />
        </div>
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Initializing Vibogram...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#05011a] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Profilingiz yuklanmoqda...</p>
      </div>
    );
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
        onNavigate={setActiveTab}
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
            <StoriesBar currentUser={currentUser} />
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
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-7 border border-white/10 mb-20 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black">Broadcast</h3>
              <button onClick={() => setShowCreatePost(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10">
                <X size={20}/>
              </button>
            </div>

            <div className="flex gap-2 p-1 glass rounded-2xl">
              {(['text', 'image', 'video'] as const).map(t => (
                <button 
                  key={t}
                  onClick={() => setPostType(t)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${postType === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-white/20 hover:text-white/40'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={postType === 'video' ? "Video haqida qisqacha..." : "Nima yangiliklar?"}
                className="w-full h-24 bg-transparent border-none focus:outline-none text-white/90 placeholder:text-white/20 resize-none text-lg"
                autoFocus
              />

              {postType !== 'text' && (
                <div className="space-y-4">
                  <div className="glass p-1 rounded-2xl border border-white/10 flex items-center px-4">
                    <input 
                      type="text" 
                      placeholder={`${postType === 'video' ? 'Video' : 'Rasm'} sarlavhasi (ixtiyoriy)`}
                      className="w-full bg-transparent p-3 text-sm text-white focus:outline-none placeholder:text-white/20"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                    />
                  </div>
                  <div className="glass p-1 rounded-2xl border border-white/10 flex items-center px-4">
                    <input 
                      type="url" 
                      placeholder={`${postType === 'video' ? 'Video' : 'Rasm'} URL manzili`}
                      className="w-full bg-transparent p-3 text-sm text-white focus:outline-none placeholder:text-white/20"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleCreatePost}
              disabled={loadingPosts}
              className="w-full py-5 bg-blue-600 rounded-2xl font-black text-white shadow-xl shadow-blue-600/40 active:scale-95 transition-all uppercase tracking-widest text-xs"
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
