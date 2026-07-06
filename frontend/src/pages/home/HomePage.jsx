import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import FeedTabs from '@/components/FeedTabs'
import PostFeed from '@/components/PostFeed'
import Layout from '@/components/Layout'
import { Image, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePostStore } from '@/store/usePostStore'
import { useAuthStore } from '@/store/useAuthStore'

export default function HomePage() {
  const { isDark, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('For You')
  const { authUser } = useAuthStore()

  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const { createPost, isCreatingPost } = usePostStore()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imageFile) return
    const success = await createPost(text, imageFile)
    if (success) {
      setText('')
      removeImage()
    }
  }

  return (
    <Layout>
      <div className={isDark ? 'dark' : ''}>
        <div className="bg-background min-h-screen text-foreground">
          <FeedTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          {/* Create Post Area */}
          <div className="p-6 border-b border-border bg-card/20">
            <div className="flex gap-4">
              <img
                src={authUser?.profileImage || '/avatar-placeholder.svg'}
                alt="Your Avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-border flex-shrink-0"
              />
              <div className="flex-1">
                <form onSubmit={handleCreatePost}>
                  <textarea
                    placeholder="What is happening?!"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-transparent border-0 outline-none text-lg resize-none placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
                    rows={3}
                  />

                  {imagePreview && (
                    <div className="relative mb-4 rounded-2xl overflow-hidden border border-border max-h-80">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover max-h-80"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <label className="flex items-center gap-2 text-primary hover:text-primary/80 cursor-pointer p-2 rounded-full hover:bg-primary/10 transition">
                      <Image className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={isCreatingPost}
                      />
                    </label>

                    <Button
                      type="submit"
                      disabled={isCreatingPost || (!text.trim() && !imageFile)}
                      className="rounded-full px-5 py-1.5 font-semibold text-sm"
                    >
                      {isCreatingPost ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                          Posting
                        </>
                      ) : (
                        'Post'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="px-2">
            <PostFeed activeTab={activeTab} />
          </div>
        </div>
      </div>
    </Layout>
  )
}