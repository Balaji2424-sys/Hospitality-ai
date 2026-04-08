import MedicalRecord from "../models/MedicalRecord.js";

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const canAccess =
      req.user.role === "admin" ||
      req.user._id.toString() === userId ||
      req.user.role === "doctor";

    if (!canAccess) {
      res.status(403);
      throw new Error("Not allowed to access this history");
    }

    const query = { userId };
    if (req.query.search) {
      query.$or = [
        { symptoms: { $in: [req.query.search] } },
        { "predictions.disease": { $regex: req.query.search, $options: "i" } }
      ];
    }

    const records = await MedicalRecord.find(query)
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    res.json({ success: true, records });
  } catch (error) {
    next(error);
  }
};

export const addHistory = async (req, res, next) => {
  try {
    const record = await MedicalRecord.create(req.body);
    res.status(201).json({ success: true, record });
  } catch (error) {
    next(error);
  }
};

export const addDoctorNote = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.recordId);
    if (!record) {
      res.status(404);
      throw new Error("Medical record not found");
    }

    record.doctorId = req.user._id;
    record.doctorNotes = req.body.doctorNotes;
    await record.save();

    res.json({ success: true, record });
  } catch (error) {
    next(error);
  }
};
