import express from "express";
import { analytics, dashboardSummary } from "../controllers/doctorController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("doctor"), dashboardSummary);
router.get("/analytics", protect, authorize("doctor"), analytics);

export default router;
