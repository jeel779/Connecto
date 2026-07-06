import { useEffect } from 'react'
import PostCard from './PostCard'
import { usePostStore } from '../store/usePostStore'
import { Loader2 } from 'lucide-react'

export default function PostFeed({ activeTab }) {
  const { posts, fetchPosts, isFetchingPosts } = usePostStore()

  useEffect(() => {
    fetchPosts(activeTab === 'Following' ? 'following' : 'all')
  }, [activeTab, fetchPosts])

  if (isFetchingPosts) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {posts.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No posts yet. {activeTab === 'Following' ? 'Follow people to see their posts here.' : 'Be the first to post!'}
        </div>
      ) : (
        posts.map(post => <PostCard key={post._id} post={post} />)
      )}
    </div>
  )
}
