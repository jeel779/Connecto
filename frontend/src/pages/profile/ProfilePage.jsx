import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/useAuthStore'
import { usePostStore } from '@/store/usePostStore'
import { Camera, Edit2, Link as LinkIcon, Calendar, Loader2, X } from 'lucide-react'
import { formatMemberSinceDate } from '@/utils/date/date'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PostCard from '@/components/PostCard'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { username } = useParams()
  const { authUser, followUnfollowUser, updateProfile, checkAuth } = useAuthStore()
  const { posts, likedPosts, fetchPosts, fetchLikedPosts, isFetchingPosts } = usePostStore()

  const [profileUser, setProfileUser] = useState(null)
  const [isFetchingProfile, setIsFetchingProfile] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
    link: '',
    currentPassword: '',
    newPassword: '',
  })

  const avatarInputRef = useRef()
  const coverInputRef = useRef()

  const isMyProfile = !username || username === authUser?.username

  const fetchProfile = async (uname) => {
    try {
      setIsFetchingProfile(true)
      const response = await axios.get(`http://localhost:3000/api/v1/user/profile/${uname}`)
      setProfileUser(response.data.user)
    } catch (error) {
      console.error(error)
      toast.error("User not found")
      setProfileUser(null)
    } finally {
      setIsFetchingProfile(false)
    }
  }

  useEffect(() => {
    if (username) {
      fetchProfile(username)
    } else if (authUser) {
      setProfileUser(authUser)
    }
  }, [username, authUser])

  useEffect(() => {
    fetchPosts('all')
    if (isMyProfile) {
      fetchLikedPosts()
    }
  }, [isMyProfile, fetchPosts, fetchLikedPosts, profileUser])

  useEffect(() => {
    if (profileUser) {
      setEditFormData({
        fullName: profileUser.fullName || '',
        username: profileUser.username || '',
        bio: profileUser.bio || '',
        link: profileUser.link || '',
        currentPassword: '',
        newPassword: '',
      })
    }
  }, [profileUser, showEditModal])

  const handleFollowUnfollow = async () => {
    if (!profileUser) return
    await followUnfollowUser(profileUser._id)
    if (username) {
      fetchProfile(username)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('profileImage', file)

    const loadingToast = toast.loading("Updating profile image...")
    try {
      await axios.patch(`http://localhost:3000/api/v1/user/update-profile-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success("Profile image updated", { id: loadingToast })
      await checkAuth()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile image", { id: loadingToast })
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('coverImage', file)

    const loadingToast = toast.loading("Updating cover banner...")
    try {
      await axios.patch(`http://localhost:3000/api/v1/user/update-cover-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success("Cover banner updated", { id: loadingToast })
      await checkAuth()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cover banner", { id: loadingToast })
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    // Clean passwords if empty
    const submissionData = { ...editFormData }
    if (!submissionData.currentPassword || !submissionData.newPassword) {
      delete submissionData.currentPassword
      delete submissionData.newPassword
    }
    await updateProfile(submissionData)
    setShowEditModal(false)
  }

  if (isFetchingProfile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    )
  }

  if (!profileUser) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">User not found</h2>
          <p className="text-muted-foreground mb-4">The profile you are looking for does not exist.</p>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </Layout>
    )
  }

  // Filter posts
  const userPosts = posts.filter(p => p.user?._id === profileUser._id)
  const displayedLikedPosts = isMyProfile
    ? likedPosts
    : posts.filter(p => p.likes?.includes(profileUser._id))

  const isFollowing = authUser?.following?.includes(profileUser._id)

  const coverUrl = profileUser.coverImage
  const avatarUrl = profileUser.profileImage || '/avatar-placeholder.svg'
  const joinedDate = formatMemberSinceDate(profileUser.createdAt)

  return (
    <Layout>
      <div className="bg-background min-h-screen text-foreground pb-20">
        {/* Banner Cover */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-violet-600 to-indigo-600 w-full overflow-hidden group">
          {coverUrl && (
            <img src={coverUrl} alt="Cover banner" className="w-full h-full object-cover" />
          )}
          {isMyProfile && (
            <button
              onClick={() => coverInputRef.current.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
            >
              <Camera className="w-8 h-8" />
              <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
            </button>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="px-6 relative">
          {/* Avatar positioning */}
          <div className="relative -mt-16 md:-mt-24 mb-4 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background bg-card group shadow-lg">
            <img src={avatarUrl} alt={profileUser.fullName} className="w-full h-full object-cover" />
            {isMyProfile && (
              <button
                onClick={() => avatarInputRef.current.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
              >
                <Camera className="w-6 h-6" />
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-6 flex gap-3">
            {isMyProfile ? (
              <Button
                variant="outline"
                className="rounded-full gap-2 font-semibold text-sm cursor-pointer"
                onClick={() => setShowEditModal(true)}
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <Button
                variant={isFollowing ? 'outline' : 'default'}
                className="rounded-full font-semibold text-sm cursor-pointer"
                onClick={handleFollowUnfollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{profileUser.fullName}</h1>
            <p className="text-base text-muted-foreground">@{profileUser.username}</p>

            {profileUser.bio && (
              <p className="mt-3.5 text-base text-foreground leading-relaxed max-w-xl whitespace-pre-wrap">
                {profileUser.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {profileUser.link && (
                <a
                  href={profileUser.link.startsWith('http') ? profileUser.link : `https://${profileUser.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{profileUser.link}</span>
                </a>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{joinedDate}</span>
              </div>
            </div>

            {/* Follow stats */}
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="font-bold text-foreground">{profileUser.following?.length || 0}</span>{' '}
                <span className="text-muted-foreground">Following</span>
              </div>
              <div>
                <span className="font-bold text-foreground">{profileUser.followers?.length || 0}</span>{' '}
                <span className="text-muted-foreground">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="mt-8 border-b border-border flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-4 text-center font-semibold border-b-2 text-base transition-colors cursor-pointer ${
              activeTab === 'posts'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex-1 py-4 text-center font-semibold border-b-2 text-base transition-colors cursor-pointer ${
              activeTab === 'liked'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Likes ({displayedLikedPosts.length})
          </button>
        </div>

        {/* Feed List */}
        <div className="px-2 mt-2">
          {isFetchingPosts ? (
            <div className="py-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeTab === 'posts' ? (
            userPosts.length === 0 ? (
              <p className="py-16 text-center text-muted-foreground text-sm">No posts yet.</p>
            ) : (
              userPosts.map(post => <PostCard key={post._id} post={post} />)
            )
          ) : displayedLikedPosts.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground text-sm">No liked posts yet.</p>
          ) : (
            displayedLikedPosts.map(post => <PostCard key={post._id} post={post} />)
          )}
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-card border border-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative animate-scaleUp">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-accent transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="px-6 py-5 border-b border-border">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Update your personal handles and details</p>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none h-20"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={editFormData.link}
                    onChange={(e) => setEditFormData({ ...editFormData, link: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="pt-4 border-t border-border/60">
                  <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Change Password</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={editFormData.currentPassword}
                        onChange={(e) => setEditFormData({ ...editFormData, currentPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={editFormData.newPassword}
                        onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border/60">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="rounded-full cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-full px-6 cursor-pointer">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}