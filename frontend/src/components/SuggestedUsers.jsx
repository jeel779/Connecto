import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../store/useAuthStore'

function SuggestedUserCard({ user }) {
  const { authUser, followUnfollowUser } = useAuthStore()
  const isFollowing = authUser?.following?.includes(user._id)

  const handleFollow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    followUnfollowUser(user._id)
  }

  const avatarUrl = user.profileImage || '/avatar-placeholder.svg'

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-accent/30 transition-colors">
      <img
        src={avatarUrl}
        alt={user.fullName}
        className="w-11 h-11 rounded-full object-cover ring-1 ring-border flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-foreground truncate">{user.fullName}</p>
        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
      </div>
      <Button
        size="sm"
        variant={isFollowing ? 'outline' : 'default'}
        className="text-xs h-7 px-3 rounded-full flex-shrink-0 transition-all cursor-pointer"
        onClick={handleFollow}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  )
}

export default function SuggestedUsers() {
  const { suggestedUsers, fetchSuggestedUsers, isFetchingSuggestions } = useAuthStore()

  useEffect(() => {
    fetchSuggestedUsers()
  }, [fetchSuggestedUsers])

  if (isFetchingSuggestions && suggestedUsers.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden p-5 text-center text-sm text-muted-foreground">
        Loading suggestions...
      </div>
    )
  }

  if (suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="font-bold text-lg text-foreground">Suggested Users</h2>
      </div>

      <div className="divide-y divide-border">
        {suggestedUsers.slice(0, 5).map(user => (
          <SuggestedUserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  )
}
