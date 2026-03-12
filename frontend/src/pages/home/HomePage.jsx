import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import FeedTabs from '@/components/FeedTabs'
import PostFeed from '@/components/PostFeed'
import SuggestedUsers from '@/components/SuggestedUsers'
import UserProfile from '@/components/UserProfile'
import {
  Home,
  PenSquare,
  MessageCircle,
  Bell,
  Bookmark,
  User,
  LogOut,
  Zap,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock logged-in user
const CURRENT_USER = {
  fullName: 'Jeel Patel',
  username: 'jeelp',
}

const navItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: PenSquare, label: 'Post', to: '/post' },
  { icon: MessageCircle, label: 'Chat', to: '/chat' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bookmark, label: 'Bookmarks', to: '/bookmarks' },
  { icon: User, label: 'Profile', to: '/profile' },
]

export default function HomePage() {
  const { isDark, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('For You')

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Full-viewport flex row — no centering, no gaps */}
      <div className="flex min-h-screen w-full bg-background text-foreground">

        {/* LEFT SIDEBAR — ~30% width, sticky */}
        <aside className="sticky top-0 h-screen w-[20%] shrink-0 flex flex-col border-r border-border px-6 py-8 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-4 px-2 mb-10">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Connecto</span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-4 px-5 py-4 rounded-xl text-lg font-medium transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground'
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 px-5 py-4 text-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl mt-4"
            onClick={() => console.log('Logout')}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium">Logout</span>
          </Button>
        </aside>

        {/* CENTER FEED — flex-1 fills remaining space */}
        <main className="flex-1 min-w-0 border-x border-border">
          <FeedTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
          <div className="px-2">
            <PostFeed activeTab={activeTab} />
          </div>
        </main>

        {/* RIGHT SIDEBAR — ~22% width, sticky */}
        <aside className="hidden lg:flex sticky top-0 h-screen w-[22%] shrink-0 flex-col gap-5 px-5 py-8 overflow-y-auto border-l border-border">
          <SuggestedUsers />

          <div className="flex-1" />

          {/* Current User Mini Profile */}
          <div className="border border-border rounded-2xl overflow-hidden bg-card">
            <div className="px-5 pt-4 pb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Logged in as
              </h3>
            </div>
            <div className="px-3 pb-4">
              <UserProfile user={CURRENT_USER} />
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}