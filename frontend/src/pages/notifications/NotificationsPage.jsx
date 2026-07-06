import { useEffect } from 'react'
import Layout from '@/components/Layout'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Bell, Trash2, Heart, UserPlus, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPostDate } from '@/utils/date/date'

export default function NotificationsPage() {
  const { notifications, fetchNotifications, clearNotifications, isFetchingNotifications } = useNotificationStore()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return (
    <Layout>
      <div className="bg-background min-h-screen text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Notifications</h1>
              <p className="text-xs text-muted-foreground">Stay updated on your interactions</p>
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition cursor-pointer"
              title="Clear all notifications"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {isFetchingNotifications && notifications.length === 0 ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">No notifications yet</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                When people like your posts or follow you, they'll show up here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60 border border-border rounded-2xl overflow-hidden bg-card/20">
              {notifications.map((notif) => {
                const isLike = notif.type === 'like'
                const userAvatar = notif.from?.profileImage || '/avatar-placeholder.svg'
                const notifDate = formatPostDate(notif.createdAt)

                return (
                  <div
                    key={notif._id}
                    className="p-5 flex gap-4 hover:bg-accent/20 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {isLike ? (
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      ) : (
                        <UserPlus className="w-5 h-5 text-blue-500" />
                      )}
                    </div>

                    <Link to={`/profile/${notif.from?.username}`} className="flex-shrink-0">
                      <img
                        src={userAvatar}
                        alt={notif.from?.username}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-border hover:opacity-90 transition"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <p className="text-base text-foreground leading-normal">
                        <Link to={`/profile/${notif.from?.username}`} className="font-bold hover:underline">
                          {notif.from?.username}
                        </Link>{' '}
                        {isLike ? 'liked your post' : 'started following you'}
                      </p>
                      <span className="text-xs text-muted-foreground">{notifDate}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}