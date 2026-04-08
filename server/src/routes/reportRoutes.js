import express from "express";
import { getReportById } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:recordId", protect, getReportById);

export default router;
