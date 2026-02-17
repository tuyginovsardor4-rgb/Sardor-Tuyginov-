
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Zap } from 'lucide-react';
import { generateAIResponse } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Salom, bro! Vibogram AI tayyor. Kod bormi yoki g\'oyami? 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateAIResponse(input);
    const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText || '' };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[75vh] p-4 space-y-4 bg-gradient-to-b from-transparent to-[#0a061e]/50">
      <div className="flex items-center justify-between mb-2 glass px-4 py-3 rounded-2xl border-white/5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Vibogram AI</h2>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Online Assistant</span>
            </div>
          </div>
        </div>
        <Zap className="text-yellow-400 w-5 h-5" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-3xl flex flex-col gap-2 shadow-2xl ${
              msg.role === 'user' 
              ? 'bg-gradient-to-tr from-blue-600 to-blue-700 text-white rounded-tr-none' 
              : 'glass border border-white/10 rounded-tl-none text-white/90'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <span className="text-[9px] opacity-40 self-end uppercase">Hozirgina</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="glass p-4 rounded-3xl rounded-tl-none flex items-center gap-3 border border-blue-500/20">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-xs text-blue-400/80 font-medium">Fikrlayapman...</span>
            </div>
          </div>
        )}
      </div>

      <div className="glass p-2 rounded-[2rem] border border-white/10 flex items-center gap-2 shadow-2xl">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Kod yoki savol yozing..."
          className="flex-1 bg-transparent border-none focus:outline-none p-3 text-sm text-white placeholder:text-white/20"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-2xl hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
