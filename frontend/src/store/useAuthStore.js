import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = "http://localhost:3000/api/v1"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    isCheckingAuth: false,
    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true })
            const response = await axios.get(`${BASE_URL}/user/profile`)
            set({ authUser: response.data.user })
        } catch (error) {
            toast.error(error.response?.data?.message || "Authentication failed");
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (userData) => {
        try {
            set({ isSigningUp: true })
            const response = await axios.post(`${BASE_URL}/user/signup`, userData)
            set({ authUser: response.data.user })
            toast.success("Account created successfully")
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
            const response = await axios.post(`${BASE_URL}/user/update`, userData)
            set({ authUser: response.data.user })
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
    }

}))

