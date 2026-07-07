import { create } from "zustand";
import toast from "react-hot-toast";
import {
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  createPost as apiCreatePost,
  deletePost as apiDeletePost,
  likeUnlikePost as apiLikeUnlikePost,
  commentOnPost as apiCommentOnPost
} from "../helpers/api-communicator";

export const usePostStore = create((set, get) => ({
    posts: [],
    likedPosts: [],
    isFetchingPosts: false,
    isCreatingPost: false,

    fetchPosts: async (feedType = "all") => {
        try {
            set({ isFetchingPosts: true });
            const data = feedType === "following" ? await getFollowingPosts() : await getAllPosts();
            set({ posts: Array.isArray(data) ? data : [] });
        } catch (error) {
            console.error("Error fetching posts:", error);
            set({ posts: [] });
        } finally {
            set({ isFetchingPosts: false });
        }
    },

    fetchLikedPosts: async () => {
        try {
            set({ isFetchingPosts: true });
            const data = await getLikedPosts();
            set({ likedPosts: Array.isArray(data) ? data : [] });
        } catch (error) {
            console.error("Error fetching liked posts:", error);
            set({ likedPosts: [] });
        } finally {
            set({ isFetchingPosts: false });
        }
    },

    createPost: async (text, imageFile) => {
        try {
            set({ isCreatingPost: true });
            const formData = new FormData();
            if (text) formData.append("text", text);
            if (imageFile) formData.append("image", imageFile);

            const data = await apiCreatePost(formData);
            
            toast.success(data.message || "Post created successfully");
            get().fetchPosts();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to create post");
            return false;
        } finally {
            set({ isCreatingPost: false });
        }
    },

    deletePost: async (postId) => {
        try {
            const data = await apiDeletePost(postId);
            toast.success(data.message || "Post deleted successfully");
            set({
                posts: get().posts.filter(p => p._id !== postId),
                likedPosts: get().likedPosts.filter(p => p._id !== postId),
            });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to delete post");
        }
    },

    likeUnlikePost: async (postId) => {
        try {
            const data = await apiLikeUnlikePost(postId);
            const updatedLikes = data;

            set({
                posts: get().posts.map(p => {
                    if (p._id === postId) {
                        return { ...p, likes: updatedLikes };
                    }
                    return p;
                }),
                likedPosts: get().likedPosts.map(p => {
                    if (p._id === postId) {
                        return { ...p, likes: updatedLikes };
                    }
                    return p;
                })
            });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to like/unlike post");
        }
    },

    commentOnPost: async (postId, text) => {
        try {
            const data = await apiCommentOnPost(postId, text);
            toast.success(data.message || "Comment added");
            
            const dataAll = await getAllPosts();
            set({ posts: Array.isArray(dataAll) ? dataAll : [] });
            
            const dataLiked = await getLikedPosts();
            set({ likedPosts: Array.isArray(dataLiked) ? dataLiked : [] });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to add comment");
        }
    }
}));
