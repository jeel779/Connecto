import { create } from "zustand";
import toast from "react-hot-toast";
import {
  checkAuthStatus,
  signupUser,
  loginUser,
  logoutUser,
  updateProfile as apiUpdateProfile,
  getSuggestedUsers,
  followAndUnfollowUser
} from "../helpers/api-communicator";

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
            const data = await checkAuthStatus()
            set({ authUser: data.user })
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (userData) => {
        try {
            set({ isSigningUp: true })
            await signupUser(userData.fullName, userData.username, userData.email, userData.password)
            await get().login({ email: userData.email, password: userData.password })
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Signup failed");
        } finally {
            set({ isSigningUp: false })
        }
    },
    login: async (userData) => {
        try {
            set({ isLoggingIn: true })
            const data = await loginUser(userData.email, userData.password)
            set({ authUser: data.user })
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Login failed");
        } finally {
            set({ isLoggingIn: false })
        }
    },
    updateProfile: async (userData) => {
        try {
            set({ isUpdatingProfile: true })
            await apiUpdateProfile(userData)
            await get().checkAuth()
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Profile update failed");
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
    logout: async () => {
        try {
            set({ isLoggingOut: true })
            await logoutUser()
            set({ authUser: null })
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Logout failed");
        } finally {
            set({ isLoggingOut: false })
        }
    },
    fetchSuggestedUsers: async () => {
        try {
            set({ isFetchingSuggestions: true })
            const data = await getSuggestedUsers()
            set({ suggestedUsers: data })
        } catch (error) {
            console.error(error.response?.data?.message || error.message || "Failed to fetch suggestions");
        } finally {
            set({ isFetchingSuggestions: false })
        }
    },
    followUnfollowUser: async (userId) => {
        try {
            const data = await followAndUnfollowUser(userId)
            toast.success(data.message)
            
            const authUser = get().authUser;
            if (authUser) {
                const isFollowing = authUser.following.includes(userId);
                const updatedFollowing = isFollowing
                    ? authUser.following.filter(id => id !== userId)
                    : [...authUser.following, userId];
                set({ authUser: { ...authUser, following: updatedFollowing } });
            }
            await get().fetchSuggestedUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to follow/unfollow user");
        }
    }
}))
