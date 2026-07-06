import { useState } from 'react'
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePostStore } from '../store/usePostStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatPostDate } from '../utils/date/date'
import { cn } from '@/lib/utils'

export default function PostCard({ post }) {
  const { authUser } = useAuthStore()
  const { likeUnlikePost, deletePost, commentOnPost } = usePostStore()

  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const isLiked = post.likes?.includes(authUser?._id)
  const isMyPost = post.user?._id === authUser?._id

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    likeUnlikePost(post._id)
  }

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(post._id)
    }
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    commentOnPost(post._id, commentText)
    setCommentText('')
  }

  const userAvatar = post.user?.profileImage || '/avatar-placeholder.svg'
  const postDate = formatPostDate(post.createdAt)

  return (
    <article className="px-6 py-5 border-b border-border hover:bg-accent/10 transition-colors duration-200">
      <div className="flex gap-4">
        {/* Avatar */}
        <Link to={`/profile/${post.user?.username}`} className="flex-shrink-0">
          <img
            src={userAvatar}
            alt={post.user?.username}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${post.user?.username}`} className="hover:underline font-bold text-base text-foreground truncate">
                {post.user?.fullName}
              </Link>
              <span className="text-muted-foreground text-sm truncate">@{post.user?.username}</span>
              <span className="text-muted-foreground text-xs flex-shrink-0">· {postDate}</span>
            </div>

            {isMyPost && (
              <button
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full hover:bg-destructive/10 cursor-pointer"
                title="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Post text */}
          <p className="text-base text-foreground leading-loose mb-4 whitespace-pre-wrap">{post.text}</p>

          {/* Optional image */}
          {post.image && (
            <div className="mb-4 rounded-xl overflow-hidden border border-border">
              <img
                src={post.image}
                alt="Post media"
                className="w-full max-h-[400px] object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-8 mt-2">
            {/* Like */}
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors group cursor-pointer',
                isLiked ? 'text-rose-500 font-semibold' : 'text-muted-foreground hover:text-rose-500'
              )}
            >
              <Heart
                className={cn('w-5 h-5 transition-transform group-hover:scale-110', isLiked && 'fill-rose-500')}
              />
              <span className="text-sm">{post.likes?.length || 0}</span>
            </button>

            {/* Comment toggler */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors group cursor-pointer",
                showComments ? "text-blue-500 font-semibold" : "text-muted-foreground hover:text-blue-500"
              )}
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-5 pt-4 border-t border-border/60 animate-fadeIn space-y-4">
              {/* Comment composer */}
              <form onSubmit={handleCommentSubmit} className="flex gap-3 items-center">
                <img
                  src={authUser?.profileImage || '/avatar-placeholder.svg'}
                  alt="Your Avatar"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-border flex-shrink-0"
                />
                <div className="flex-1 flex bg-accent/40 rounded-full px-4 py-2 items-center border border-border">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-sm placeholder:text-muted-foreground"
                  />
                  <button type="submit" className="text-primary hover:text-primary-foreground p-1 rounded-full transition cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Comments list */}
              <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => {
                    const commentUserAvatar = comment.user?.profileImage || '/avatar-placeholder.svg';
                    return (
                      <div key={comment._id || index} className="flex gap-3 items-start text-sm">
                        <Link to={`/profile/${comment.user?.username}`} className="flex-shrink-0 mt-0.5">
                          <img
                            src={commentUserAvatar}
                            alt={comment.user?.username || 'user'}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-border"
                          />
                        </Link>
                        <div className="flex-1 min-w-0 bg-accent/20 rounded-2xl px-4 py-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Link to={`/profile/${comment.user?.username}`} className="font-semibold text-foreground hover:underline">
                              {comment.user?.fullName}
                            </Link>
                            <span className="text-muted-foreground text-xs">@{comment.user?.username}</span>
                          </div>
                          <p className="text-foreground leading-relaxed break-words">{comment.text}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Write one above!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
