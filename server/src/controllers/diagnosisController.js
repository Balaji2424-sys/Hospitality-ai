import MedicalRecord from "../models/MedicalRecord.js";
import User from "../models/User.js";
import { getNearbyHospitals } from "../services/doctorDiscoveryService.js";
import { generatePdfReport } from "../services/reportService.js";
import { callAiService } from "../utils/aiClient.js";

export const runDiagnosis = async (req, res, next) => {
  try {
    const { symptoms, language = "en", patientDetails = {} } = req.body;

    const history = await MedicalRecord.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const diagnosis = await callAiService("/predict", {
      symptoms,
      language,
      history: history.map((item) => ({
        symptoms: item.symptoms,
        predictions: item.predictions
      })),
      patient_details: patientDetails
    });

    const nearbyHospitals = getNearbyHospitals();

    const record = await MedicalRecord.create({
      userId: req.user._id,
      symptoms,
      predictions: diagnosis.predictions,
      severity: diagnosis.severity,
      reportText: diagnosis.report_text,
      reportLanguage: language,
      recommendations: diagnosis.recommendations,
      nearbyHospitals,
      meta: {
        confidenceAverage: diagnosis.confidence_average,
        source: "ai"
      }
    });

    const user = await User.findById(req.user._id);
    const pdf = await generatePdfReport({ record, user });

    record.reportUrl = pdf.url;
    await record.save();

    res.json({
      success: true,
      diagnosis,
      record,
      reportUrl: pdf.url
    });
  } catch (error) {
    next(error);
  }
};
