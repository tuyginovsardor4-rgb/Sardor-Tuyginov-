
export interface User {
  id: string;
  name: string;
  avatar: string;
  username?: string;
  bio?: string;
  phone?: string;
  isLive?: boolean;
}

export interface Post {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  type: 'text' | 'code' | 'image' | 'video';
  mediaUrl?: string;
  title?: string;
  codeSnippet?: string;
  language?: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Story {
  id: string;
  user: User;
  seen: boolean;
}

export type AppTab = 'home' | 'chat' | 'ai' | 'pricing' | 'code';
