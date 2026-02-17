
import React, { useState } from 'react';
import { ArrowRight, Github, Chrome, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Bu yerda aslida Supabase Auth chaqiriladi
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#05011a] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-sm space-y-10 z-10 text-center">
        <div className="space-y-4 flex flex-col items-center animate-in zoom-in duration-700">
          <div className="w-24 h-24 bg-black rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/10 mb-2 transform hover:rotate-6 transition-transform">
            <Logo size={65} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white neon-text">Vibogram</h1>
          <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
            {isLogin ? 'Welcome Back, Dev' : 'Join the Future'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!isLogin && (
            <div className="glass p-1 rounded-2xl border border-white/10 flex items-center px-4">
              <User size={18} className="text-white/20" />
              <input 
                type="text" 
                placeholder="To'liq ismingiz"
                required
                className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-white/20 text-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div className="glass p-1 rounded-2xl border border-white/10 flex items-center px-4">
            <Mail size={18} className="text-white/20" />
            <input 
              type="email" 
              placeholder="Email manzilingiz"
              required
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-white/20 text-sm"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="glass p-1 rounded-2xl border border-white/10 flex items-center px-4">
            <Lock size={18} className="text-white/20" />
            <input 
              type="password" 
              placeholder="Parol"
              required
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-white/20 text-sm"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div className="glass p-1 rounded-2xl border border-white/10 flex items-center px-4">
              <CheckCircle2 size={18} className="text-white/20" />
              <input 
                type="password" 
                placeholder="Parolni tasdiqlang"
                required
                className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-white/20 text-sm"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group active:scale-95 uppercase tracking-widest text-xs"
          >
            {isLogin ? 'Tizimga kirish' : 'Ro\'yxatdan o\'tish'} 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-white/10">
            <div className="h-px flex-1 bg-current" />
            <span className="text-[10px] uppercase tracking-widest font-black">Social Connect</span>
            <div className="h-px flex-1 bg-current" />
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 glass rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
              <Github size={18} className="group-hover:text-white transition-colors" />
            </button>
            <button className="flex-1 py-4 glass rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
              <Chrome size={18} className="group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-white/40 text-xs hover:text-blue-400 transition-colors"
        >
          {isLogin ? (
            <>Hali a'zo emasmisiz? <span className="text-blue-400 font-black">Ro'yxatdan o'tish</span></>
          ) : (
            <>Akkountingiz bormi? <span className="text-blue-400 font-black">Kirish</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginView;
