import express from "express";
import { addDoctorNote, addHistory, getHistory } from "../controllers/historyController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getHistory);
router.post("/add", protect, addHistory);
router.post("/note/:recordId", protect, authorize("doctor"), addDoctorNote);

export default router;
