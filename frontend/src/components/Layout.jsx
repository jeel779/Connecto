import Sidebar from './Sidebar'
import SuggestedUsers from './SuggestedUsers'
import UserProfile from './UserProfile'
import { useAuthStore } from '../store/useAuthStore'

export default function Layout({ children }) {
  const { authUser, logout } = useAuthStore()

  const CURRENT_USER = {
    fullName: authUser?.fullName || 'User',
    username: authUser?.username || 'handle',
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* LEFT SIDEBAR */}
      <Sidebar onLogout={logout} />

      {/* CENTER CONTENT */}
      <main className="flex-1 min-w-0 border-r border-border">
        {children}
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-[22%] shrink-0 flex flex-col gap-5 px-5 py-8 overflow-y-auto bg-background">
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
  )
}
