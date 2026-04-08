import express from "express";
import { runDiagnosis } from "../controllers/diagnosisController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, runDiagnosis);

export default router;
