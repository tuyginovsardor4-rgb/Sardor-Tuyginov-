
import React from 'react';
import { Sparkles, ArrowRight, Github, Chrome } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#05011a] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-sm space-y-12 z-10 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/40 transform rotate-12 mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white neon-text">Vibogram</h1>
          <p className="text-white/40 text-sm">Kelajak dasturchilari ijtimoiy tarmog'i</p>
        </div>

        <div className="space-y-4">
          <div className="glass p-1 rounded-2xl border border-white/10">
            <input 
              type="text" 
              placeholder="Username yoki Email"
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-white/20"
            />
          </div>
          <div className="glass p-1 rounded-2xl border border-white/10">
            <input 
              type="password" 
              placeholder="Parol"
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-white/20"
            />
          </div>
          <button 
            onClick={onLogin}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group"
          >
            KIRISH <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-white/20">
            <div className="h-px flex-1 bg-current" />
            <span className="text-xs uppercase tracking-widest font-bold">Yoki</span>
            <div className="h-px flex-1 bg-current" />
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 glass rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <Github size={20} /> <span className="text-sm font-medium">Github</span>
            </button>
            <button className="flex-1 py-4 glass rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <Chrome size={20} /> <span className="text-sm font-medium">Google</span>
            </button>
          </div>
        </div>

        <p className="text-white/40 text-xs">
          Ro'yxatdan o'tmaganmisiz? <span className="text-blue-400 font-bold cursor-pointer hover:underline">Yaratish</span>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
