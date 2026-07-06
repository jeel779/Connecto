import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = "http://localhost:3000/api/v1";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    isFetchingNotifications: false,

    fetchNotifications: async () => {
        try {
            set({ isFetchingNotifications: true });
            const response = await axios.get(`${BASE_URL}/notification`);
            // Wait, let's verify the route registered in index.js:
            // app.use("/api/v1/notifications",notificationRouter)
            // Ah! The endpoint prefix is "/api/v1/notifications", NOT "/api/v1/notification". Let's use notifications!
            const responseCorrect = await axios.get(`${BASE_URL}/notifications`);
            set({ notifications: Array.isArray(responseCorrect.data) ? responseCorrect.data : [] });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            set({ notifications: [] });
        } finally {
            set({ isFetchingNotifications: false });
        }
    },

    clearNotifications: async () => {
        try {
            const response = await axios.delete(`${BASE_URL}/notifications`);
            toast.success(response.data.message || "Notifications cleared");
            set({ notifications: [] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear notifications");
        }
    }
}));
