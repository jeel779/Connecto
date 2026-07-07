import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = process.env.VITE_BACKEND_URL || "http://localhost:3000/api/v1"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    isCheckingAuth: false,
    suggestedUsers: [],
    isFetchingSuggestions: false,

    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true })
            const response = await axios.get(`${BASE_URL}/user/profile`)
            set({ authUser: response.data.user })
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (userData) => {
        try {
            set({ isSigningUp: true })
            await axios.post(`${BASE_URL}/user/signup`, userData)
            // Automatically log in user after signup
            await get().login({ email: userData.email, password: userData.password })
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false })
        }
    },
    login: async (userData) => {
        try {
            set({ isLoggingIn: true })
            const response = await axios.post(`${BASE_URL}/user/login`, userData)
            set({ authUser: response.data.user })
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false })
        }
    },
    updateProfile: async (userData) => {
        try {
            set({ isUpdatingProfile: true })
            const response = await axios.patch(`${BASE_URL}/user/update`, userData)
            // Fetch updated profile
            await get().checkAuth()
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
    logout: async () => {
        try {
            set({ isLoggingOut: true })
            await axios.post(`${BASE_URL}/user/logout`)
            set({ authUser: null })
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        } finally {
            set({ isLoggingOut: false })
        }
    },
    fetchSuggestedUsers: async () => {
        try {
            set({ isFetchingSuggestions: true })
            const response = await axios.get(`${BASE_URL}/user/suggested`)
            set({ suggestedUsers: response.data })
        } catch (error) {
            console.error(error.response?.data?.message || "Failed to fetch suggestions");
        } finally {
            set({ isFetchingSuggestions: false })
        }
    },
    followUnfollowUser: async (userId) => {
        try {
            const response = await axios.post(`${BASE_URL}/user/follow/${userId}`)
            toast.success(response.data.message)
            
            const authUser = get().authUser;
            if (authUser) {
                const isFollowing = authUser.following.includes(userId);
                const updatedFollowing = isFollowing
                    ? authUser.following.filter(id => id !== userId)
                    : [...authUser.following, userId];
                set({ authUser: { ...authUser, following: updatedFollowing } });
            }
            // Refresh suggestion lists
            await get().fetchSuggestedUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to follow/unfollow user");
        }
    }
}))

