export default function UserProfile({ user }) {
  const displayName = user?.fullName || 'You'
  const username = user?.username || 'yourhandle'
  const avatarUrl = user?.profileImage || '/avatar-placeholder.svg'

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/30 transition-colors cursor-pointer">
      <img
        src={avatarUrl}
        alt={displayName}
        className="w-10 h-10 rounded-full object-cover ring-1 ring-border flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
        <p className="text-xs text-muted-foreground truncate">@{username}</p>
      </div>
    </div>
  )
}
