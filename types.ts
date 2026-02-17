
export interface User {
  id: string;
  name: string;
  avatar: string;
  isLive?: boolean;
}

export interface Post {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  type: 'text' | 'code' | 'image';
  mediaUrl?: string;
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
