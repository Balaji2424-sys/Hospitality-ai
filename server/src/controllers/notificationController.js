import Notification from "../models/Notification.js";

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Cannot access notifications");
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

export const addNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};
