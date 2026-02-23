
import React, { useState } from 'react';
import { ArrowRight, Github, Chrome, User, Mail, Lock, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../services/supabase';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting auth...', isLogin ? 'Login' : 'Signup');
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        console.log('Login success:', data);
        onLogin();
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Parollar mos kelmadi');
        }
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });
        if (error) throw error;
        console.log('Signup success:', data);
        
        // Agar email tasdiqlash yoqilgan bo'lsa (Supabase default)
        if (data.user && data.session === null) {
          setIsVerifying(true);
        } else {
          onLogin();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Xatolik yuz berdi. Internet aloqasini tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Kod kamida 6 xonali bo\'lishi kerak');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: 'signup'
      });
      if (error) throw error;
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Kod noto\'g\'ri yoki muddati o\'tgan');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });
      if (error) throw error;
      setError('Yangi kod yuborildi! 📧');
    } catch (err: any) {
      setError(err.message || 'Kod yuborishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#05011a] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />

        <div className="w-full max-w-sm space-y-10 z-10 text-center">
          <div className="space-y-4 flex flex-col items-center animate-in zoom-in duration-700">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20 mb-2">
              <ShieldCheck size={40} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Tasdiqlash</h1>
            <p className="text-white/40 text-xs leading-relaxed">
              Biz <span className="text-blue-400 font-bold">{formData.email}</span> manziliga tasdiqlash kodini yubordik.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass p-1 rounded-2xl border border-white/10 flex items-center px-4">
              <input 
                type="text" 
                placeholder="Kod"
                maxLength={8}
                required
                className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-white/10 text-center text-2xl font-black tracking-[0.3em]"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            {error && (
              <div className={`p-3 rounded-xl border ${error.includes('yuborildi') ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <p className={`${error.includes('yuborildi') ? 'text-green-400' : 'text-red-400'} text-[10px] font-bold uppercase tracking-widest leading-tight`}>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 rounded-2xl font-black text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Tasdiqlash'}
              </button>
              
              <button 
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full py-4 glass rounded-2xl text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-widest disabled:opacity-50"
              >
                Kodni qayta yuborish
              </button>
            </div>
          </form>

          <button 
            onClick={() => setIsVerifying(false)}
            className="text-white/40 text-[10px] uppercase font-black tracking-widest hover:text-white transition-colors"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

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

        <form onSubmit={handleAuth} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

          {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Tizimga kirish' : 'Ro\'yxatdan o\'tish'} 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
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
