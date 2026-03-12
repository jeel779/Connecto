import { useState } from 'react'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    setLiked(prev => !prev)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  return (
    <article className="px-6 py-5 border-b border-border hover:bg-accent/20 transition-colors duration-200 cursor-pointer">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={post.avatar}
            alt={post.username}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User info */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-base text-foreground truncate">{post.displayName}</span>
            <span className="text-muted-foreground text-base truncate">@{post.username}</span>
            <span className="text-muted-foreground text-sm flex-shrink-0">· {post.time}</span>
          </div>

          {/* Post text */}
          <p className="text-base text-foreground leading-loose mb-4">{post.text}</p>

          {/* Optional image */}
          {post.image && (
            <div className="mb-3 rounded-xl overflow-hidden border border-border">
              <img
                src={post.image}
                alt="Post media"
                className="w-full max-h-72 object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-8 mt-2">
            {/* Like */}
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors group',
                liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
              )}
            >
              <Heart
                className={cn('w-5 h-5 transition-transform group-hover:scale-110', liked && 'fill-rose-500')}
              />
              <span className="text-sm">{likeCount}</span>
            </button>

            {/* Comment */}
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-400 transition-colors group">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{post.comments}</span>
            </button>

            {/* Share */}
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-green-400 transition-colors group">
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{post.shares}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
