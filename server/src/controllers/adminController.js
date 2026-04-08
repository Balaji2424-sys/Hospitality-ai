import User from "../models/User.js";

export const verifyDoctor = async (req, res, next) => {
  try {
    const doctor = await User.findById(req.params.doctorId);
    if (!doctor || doctor.role !== "doctor") {
      res.status(404);
      throw new Error("Doctor not found");
    }

    doctor.verifiedDoctor = true;
    await doctor.save();

    res.json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

export const listPendingDoctors = async (_req, res, next) => {
  try {
    const doctors = await User.find({ role: "doctor", verifiedDoctor: false }).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    next(error);
  }
};
