import express from "express";
import { listPendingDoctors, verifyDoctor } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/doctors/pending", protect, authorize("admin"), listPendingDoctors);
router.patch("/doctors/:doctorId/verify", protect, authorize("admin"), verifyDoctor);

export default router;
