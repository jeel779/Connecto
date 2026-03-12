import { NavLink } from 'react-router-dom'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: PenSquare, label: 'Post', to: '/post' },
  { icon: MessageCircle, label: 'Chat', to: '/chat' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bookmark, label: 'Bookmarks', to: '/bookmarks' },
  { icon: User, label: 'Profile', to: '/profile' },
]

export default function Sidebar({ onLogout }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[22%] min-w-[200px] max-w-[280px] flex flex-col border-r border-border bg-background px-4 py-6 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">Connecto</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'text-muted-foreground'
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-4 px-3 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl mt-4"
        onClick={onLogout}
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">Logout</span>
      </Button>
    </aside>
  )
}
