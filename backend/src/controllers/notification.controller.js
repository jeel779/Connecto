import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;  

        const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImage",
		});

       return  res.status(200).json(notifications);
    } catch (err) {
       return res.status(500).json({ error: err.message });
    }
};
export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

       return  res.status(200).json({ message: "All notifications deleted" });
    } catch (err) {
       return  res.status(500).json({ error: err.message });
    }
};