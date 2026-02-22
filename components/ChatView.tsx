import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User, MoreVertical, Phone, Video, Smile } from 'lucide-react';
import { supabase } from '../services/supabase';
import { User as UserType } from '../types';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatViewProps {
  currentUser: UserType;
}

const ChatView: React.FC<ChatViewProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUser.id);
      if (data) setUsers(data);
    };
    fetchUsers();
  }, [currentUser.id]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${selectedUser.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${selectedUser.id},receiver_id=eq.${currentUser.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, currentUser.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          content: newMessage
        }
      ])
      .select();

    if (error) {
      console.error('Error sending message:', error);
    } else if (data) {
      setMessages(prev => [...prev, data[0] as Message]);
      setNewMessage('');
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col h-[75vh] animate-in fade-in">
        <div className="p-6 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Kontaktlarni qidirish..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 px-4 mb-4">Kontaktlar</h3>
          {users.map(user => (
            <button 
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group active:scale-[0.98]"
            >
              <div className="relative">
                <img 
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                  className="w-12 h-12 rounded-full border border-white/10" 
                  alt={user.full_name} 
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#05011a]"></span>
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-sm">{user.full_name || 'User'}</h4>
                <p className="text-xs text-white/40 truncate">Online</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[75vh] animate-in slide-in-from-right-4 duration-300">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 glass">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedUser(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5">
            <User size={18} className="text-white/40" />
          </button>
          <div className="flex items-center gap-3">
            <img 
              src={selectedUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.id}`} 
              className="w-10 h-10 rounded-full border border-white/10" 
              alt="" 
            />
            <div>
              <h4 className="font-bold text-sm leading-tight">{selectedUser.full_name || 'User'}</h4>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/40"><Phone size={18}/></button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/40"><Video size={18}/></button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/40"><MoreVertical size={18}/></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.sender_id === currentUser.id 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20' 
                : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'
            }`}>
              {msg.content}
              <div className={`text-[9px] mt-1 opacity-40 ${msg.sender_id === currentUser.id ? 'text-right' : 'text-left'}`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 glass border-t border-white/5">
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-blue-500/50 transition-all">
          <button type="button" className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white/40"><Smile size={20}/></button>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabar yozing..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white"
          />
          <button 
            type="submit"
            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/40 active:scale-90 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
