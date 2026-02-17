
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Zap, Globe, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { generateAIResponse, generateDevImage } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string, uri: string }[];
  image?: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Salom, bro! Vibogram AI tayyor. Kod yozamizmi yoki rasm yaratamizmi? 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (mode === 'chat') {
      const result = await generateAIResponse(input);
      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: result.text,
        sources: result.sources
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      const imageUrl = await generateDevImage(input);
      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "Mana siz so'ragan futuristik rasm:",
        image: imageUrl || undefined
      };
      setMessages(prev => [...prev, aiMessage]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[75vh] p-4 space-y-4">
      <div className="flex items-center justify-between glass p-1.5 rounded-2xl">
        <button 
          onClick={() => setMode('chat')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${mode === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40'}`}
        >
          <Globe size={14} /> AI SEARCH
        </button>
        <button 
          onClick={() => setMode('image')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${mode === 'image' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40'}`}
        >
          <ImageIcon size={14} /> AI ART
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] p-4 rounded-3xl flex flex-col gap-3 ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'glass border border-white/10 rounded-tl-none'
            }`}>
              {msg.image && (
                <div className="rounded-2xl overflow-hidden mb-2 border border-white/10">
                  <img src={msg.image} className="w-full h-auto object-cover" alt="AI Generated" />
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <p className="text-[10px] font-bold text-blue-400 flex items-center gap-1 uppercase">
                    <LinkIcon size={10} /> Manbalar:
                  </p>
                  {msg.sources.map((s, i) => (
                    <a key={i} href={s.uri} target="_blank" className="block glass-light p-2 rounded-xl text-[10px] text-white/60 hover:text-white truncate">
                      {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass p-4 rounded-3xl rounded-tl-none flex items-center gap-3 border border-blue-500/20">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-xs text-blue-400/80 font-bold uppercase tracking-widest">Processing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="glass p-2 rounded-[2rem] border border-white/10 flex items-center gap-2 shadow-2xl">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={mode === 'chat' ? "AI dan so'rang..." : "Rasm uchun prompt yozing..."}
          className="flex-1 bg-transparent border-none focus:outline-none p-3 text-sm text-white"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl active:scale-95 transition-all shadow-lg ${mode === 'chat' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-purple-600 shadow-purple-500/20'}`}
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
