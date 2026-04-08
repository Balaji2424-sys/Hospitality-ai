import express from "express";
import { getDoctors, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/doctors", protect, getDoctors);
router.put("/profile", protect, updateProfile);

export default router;
