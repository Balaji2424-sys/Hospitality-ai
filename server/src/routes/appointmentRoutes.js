import express from "express";
import {
  cancelAppointmentByPatient,
  getAppointments,
  requestAppointment,
  requestRescheduleByPatient,
  respondAppointment,
  updateDoctorTracking,
  updatePatientTracking
} from "../controllers/appointmentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAppointments);
router.post("/request", protect, authorize("user"), requestAppointment);
router.post("/respond", protect, authorize("doctor"), respondAppointment);
router.post("/cancel", protect, authorize("user"), cancelAppointmentByPatient);
router.post("/reschedule", protect, authorize("user"), requestRescheduleByPatient);
router.post("/track/patient", protect, authorize("user"), updatePatientTracking);
router.post("/track/doctor", protect, authorize("doctor"), updateDoctorTracking);

export default router;
