import PostCard from './PostCard'
import { useState } from 'react'

// Mock data - using UI Avatars for deterministic, beautiful avatars
const ALL_POSTS = [
  {
    id: 1,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=alex',
    displayName: 'Alex Morgan',
    username: 'alexmorgan',
    time: '2h',
    text: '🚀 Just shipped a new feature for Connecto! Real-time notifications are live. Huge shoutout to the team for the late nights and relentless energy. Excited to see what you all think! #buildinpublic #webdev',
    image: null,
    likes: 142,
    comments: 28,
    shares: 17,
    tab: 'For You',
  },
  {
    id: 2,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sarah',
    displayName: 'Sarah Designs',
    username: 'sarahdesigns',
    time: '4h',
    text: 'Minimalism in UI design isn\'t about removing things — it\'s about keeping only what matters. Every element should earn its place. Your users will thank you. ✨',
    image: null,
    likes: 389,
    comments: 54,
    shares: 91,
    tab: 'For You',
  },
  {
    id: 3,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=dev42',
    displayName: 'Dev42',
    username: 'dev42',
    time: '6h',
    text: 'Hot take: dark mode is not just aesthetic — it actually reduces eye strain during long coding sessions. Once you go dark, you never go back. 🌑\n\n#developer #programming',
    image: null,
    likes: 910,
    comments: 203,
    shares: 155,
    tab: 'For You',
  },
  {
    id: 4,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=jaya',
    displayName: 'Jaya Krishnan',
    username: 'jayak',
    time: '8h',
    text: 'Following people who build cool stuff is the best education. Your timeline is curated university. 📚 Curate it wisely.',
    image: null,
    likes: 234,
    comments: 41,
    shares: 62,
    tab: 'Following',
  },
  {
    id: 5,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=mike',
    displayName: 'Mike Chen',
    username: 'mikebuilds',
    time: '12h',
    text: 'Side project update: crossed 500 users today without spending a single dollar on ads. Community-driven growth is real. 🎉 Thread below on what worked 👇',
    image: null,
    likes: 1204,
    comments: 312,
    shares: 489,
    tab: 'Following',
  },
  {
    id: 6,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=priya',
    displayName: 'Priya Nair',
    username: 'priya_nair',
    time: '1d',
    text: 'Reminder: rest is productive. You don\'t have to be grinding 24/7 to be making progress. Your best work comes from a rested, clear mind. 🧘‍♀️',
    image: null,
    likes: 2011,
    comments: 87,
    shares: 573,
    tab: 'For You',
  },
]

export default function PostFeed({ activeTab }) {
  const posts = ALL_POSTS.filter(p => p.tab === activeTab)

  return (
    <div className="divide-y divide-border">
      {posts.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No posts yet. Follow people to see their posts here.
        </div>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
