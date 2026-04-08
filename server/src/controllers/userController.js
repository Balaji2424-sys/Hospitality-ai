import User from "../models/User.js";
import MedicalRecord from "../models/MedicalRecord.js";
import { getNearbyDoctors } from "../services/doctorDiscoveryService.js";

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getDoctors = async (req, res, next) => {
  try {
    const latestRecord = await MedicalRecord.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    const latestDiagnosis = latestRecord?.predictions?.[0]?.disease;
    const doctors = await getNearbyDoctors({
      specialization: req.query.specialization,
      diagnosis: latestDiagnosis
    });

    res.json({
      success: true,
      doctors,
      recommendedSpecialization: req.query.specialization || null,
      diagnosisBasedOn: latestDiagnosis || null
    });
  } catch (error) {
    next(error);
  }
};
