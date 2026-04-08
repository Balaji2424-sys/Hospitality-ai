import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Cancelled", "Reschedule Requested"],
      default: "Pending"
    },
    rescheduleRequest: {
      proposedDate: String,
      proposedTime: String,
      note: String,
      requestedAt: Date
    },
    tracking: {
      patientStatus: {
        type: String,
        enum: ["Waiting", "On The Way", "Arrived"],
        default: "Waiting"
      },
      consultationStatus: {
        type: String,
        enum: ["Scheduled", "In Progress", "Completed", "No Show"],
        default: "Scheduled"
      },
      lastUpdatedBy: {
        type: String,
        enum: ["user", "doctor", "system"],
        default: "system"
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
