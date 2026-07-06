import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = "http://localhost:3000/api/v1";

export const usePostStore = create((set, get) => ({
    posts: [],
    likedPosts: [],
    isFetchingPosts: false,
    isCreatingPost: false,

    fetchPosts: async (feedType = "all") => {
        try {
            set({ isFetchingPosts: true });
            const endpoint = feedType === "following" ? `${BASE_URL}/posts/following` : `${BASE_URL}/posts/all`;
            const response = await axios.get(endpoint);
            // If empty response, backend returns [] or status 200 with empty array
            set({ posts: Array.isArray(response.data) ? response.data : [] });
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
            const response = await axios.get(`${BASE_URL}/posts/liked`);
            set({ likedPosts: Array.isArray(response.data) ? response.data : [] });
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

            const response = await axios.post(`${BASE_URL}/posts/create`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            toast.success(response.data.message || "Post created successfully");
            // Refresh feed
            get().fetchPosts();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post");
            return false;
        } finally {
            set({ isCreatingPost: false });
        }
    },

    deletePost: async (postId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/posts/${postId}`);
            toast.success(response.data.message || "Post deleted successfully");
            set({
                posts: get().posts.filter(p => p._id !== postId),
                likedPosts: get().likedPosts.filter(p => p._id !== postId),
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    },

    likeUnlikePost: async (postId) => {
        try {
            const response = await axios.patch(`${BASE_URL}/posts/like/${postId}`);
            const updatedLikes = response.data; // Array of liked user IDs

            // Update in posts list
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
            toast.error(error.response?.data?.message || "Failed to like/unlike post");
        }
    },

    commentOnPost: async (postId, text) => {
        try {
            const response = await axios.post(`${BASE_URL}/posts/comment/${postId}`, { text });
            toast.success(response.data.message || "Comment added");
            
            // Re-fetch posts to get complete populated comments
            const responseAll = await axios.get(`${BASE_URL}/posts/all`);
            set({ posts: Array.isArray(responseAll.data) ? responseAll.data : [] });
            
            // Also refresh liked posts in case we are on the liked page
            const responseLiked = await axios.get(`${BASE_URL}/posts/liked`);
            set({ likedPosts: Array.isArray(responseLiked.data) ? responseLiked.data : [] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add comment");
        }
    }
}));
