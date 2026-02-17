
import { Post, Story } from './types';

export const STORIES: Story[] = [
  { id: '1', user: { id: 'bf', name: 'Best Friends', avatar: 'https://picsum.photos/seed/bf/100/100' }, seen: false },
  { id: '2', user: { id: 'emily', name: 'Emily', avatar: 'https://picsum.photos/seed/emily/100/100' }, seen: false },
  { id: '3', user: { id: 'josh1', name: 'Josh', avatar: 'https://picsum.photos/seed/josh1/100/100' }, seen: true },
  { id: '4', user: { id: 'josh2', name: 'Josh', avatar: 'https://picsum.photos/seed/josh2/100/100' }, seen: true },
  { id: '5', user: { id: 'daniel', name: 'Daniel', avatar: 'https://picsum.photos/seed/daniel/100/100' }, seen: true },
];

export const POSTS: Post[] = [
  {
    id: 'p1',
    user: { id: 'codeman', name: 'Codeman', avatar: 'https://picsum.photos/seed/codeman/100/100' },
    timestamp: '15m ago',
    content: '5 Essential Python Tips for Cleaner Code 🐍🐍',
    type: 'code',
    language: 'python',
    codeSnippet: `def shorten_list(names):
  return [name[:3] for name in names]

result = shorten_list(["Alice", "Bob", "Charlie"])
print(result)
# Output: ['Ali', 'Bob', 'Cha']`,
    likes: 1100,
    comments: 245,
    shares: 79
  },
  {
    id: 'p2',
    user: { id: 'emily', name: 'Emily', avatar: 'https://picsum.photos/seed/emily/100/100' },
    timestamp: '30m ago',
    content: 'VSCode Shortcuts Every Developer Should Know 💻🚀',
    type: 'image',
    mediaUrl: 'https://picsum.photos/seed/vscode/600/350',
    likes: 853,
    comments: 178,
    shares: 62
  }
];
