import { useState } from 'react'
import { Button } from '@/components/ui/button'

const SUGGESTED_USERS = [
  {
    id: 1,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=luna',
    displayName: 'Luna Rodriguez',
    username: 'lunacodes',
  },
  {
    id: 2,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=tomjay',
    displayName: 'Tom Jayden',
    username: 'tomjaydev',
  },
  {
    id: 3,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=aisha',
    displayName: 'Aisha Kapoor',
    username: 'aisha_k',
  },
  {
    id: 4,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=oscar99',
    displayName: 'Oscar Huang',
    username: 'oscarbuilds',
  },
  {
    id: 5,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=zara_x',
    displayName: 'Zara Kim',
    username: 'zarakim',
  },
]

function FollowButton() {
  const [following, setFollowing] = useState(false)
  return (
    <Button
      size="sm"
      variant={following ? 'outline' : 'default'}
      className="text-xs h-7 px-3 rounded-full flex-shrink-0 transition-all"
      onClick={() => setFollowing(p => !p)}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  )
}

function SuggestedUserCard({ user }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-accent/30 transition-colors">
      <img
        src={user.avatar}
        alt={user.displayName}
        className="w-11 h-11 rounded-full object-cover ring-1 ring-border flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-foreground truncate">{user.displayName}</p>
        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
      </div>
      <FollowButton />
    </div>
  )
}

export default function SuggestedUsers() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="font-bold text-lg text-foreground">Suggested Users</h2>
      </div>

      <div className="divide-y divide-border">
        {SUGGESTED_USERS.map(user => (
          <SuggestedUserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
