import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    symptoms: [String],
    predictions: [
      {
        disease: String,
        confidence: Number
      }
    ],
    severity: { type: String, enum: ["Low", "Medium", "High"] },
    doctorNotes: { type: String, default: "" },
    reportUrl: String,
    reportText: String,
    reportLanguage: { type: String, enum: ["en", "hi", "ta"], default: "en" },
    recommendations: [String],
    nearbyHospitals: [
      {
        name: String,
        distanceKm: Number,
        address: String
      }
    ],
    meta: {
      confidenceAverage: Number,
      source: { type: String, default: "ai" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("MedicalRecord", medicalRecordSchema);
