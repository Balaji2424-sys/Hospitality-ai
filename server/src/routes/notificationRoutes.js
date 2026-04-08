import express from "express";
import { addNotification, getNotifications } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getNotifications);
router.post("/add", protect, addNotification);

export default router;
