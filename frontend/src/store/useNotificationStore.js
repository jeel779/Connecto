import { create } from "zustand";
import toast from "react-hot-toast";
import {
  getNotifications,
  clearNotifications as apiClearNotifications
} from "../helpers/api-communicator";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    isFetchingNotifications: false,

    fetchNotifications: async () => {
        try {
            set({ isFetchingNotifications: true });
            const data = await getNotifications();
            set({ notifications: Array.isArray(data) ? data : [] });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            set({ notifications: [] });
        } finally {
            set({ isFetchingNotifications: false });
        }
    },

    clearNotifications: async () => {
        try {
            const data = await apiClearNotifications();
            toast.success(data.message || "Notifications cleared");
            set({ notifications: [] });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to clear notifications");
        }
    }
}));
