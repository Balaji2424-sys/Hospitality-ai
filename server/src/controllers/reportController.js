import MedicalRecord from "../models/MedicalRecord.js";

export const getReportById = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.recordId).populate("userId", "name age gender");
    if (!record) {
      res.status(404);
      throw new Error("Report not found");
    }

    const canAccess =
      req.user.role === "admin" ||
      req.user.role === "doctor" ||
      record.userId._id.toString() === req.user._id.toString();

    if (!canAccess) {
      res.status(403);
      throw new Error("Not allowed to access report");
    }

    res.json({ success: true, record });
  } catch (error) {
    next(error);
  }
};
