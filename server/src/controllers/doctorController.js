import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";

export const dashboardSummary = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate("userId", "name age gender")
      .sort({ createdAt: -1 });

    const patientIds = [...new Set(appointments.map((item) => item.userId?._id?.toString()).filter(Boolean))];
    const reports = await MedicalRecord.find({
      $or: [{ doctorId: req.user._id }, { userId: { $in: patientIds } }]
    })
      .populate("userId", "name age gender")
      .sort({ createdAt: -1 });

    res.json({ success: true, appointments, reports });
  } catch (error) {
    next(error);
  }
};

export const analytics = async (req, res, next) => {
  try {
    const [appointments, reports] = await Promise.all([
      Appointment.find({ doctorId: req.user._id }),
      MedicalRecord.find({ doctorId: req.user._id })
    ]);

    const patientIds = new Set([
      ...appointments.map((item) => item.userId.toString()),
      ...reports.map((item) => item.userId.toString())
    ]);

    const diseaseTrends = reports.reduce((acc, report) => {
      const top = report.predictions?.[0]?.disease || "Unknown";
      acc[top] = (acc[top] || 0) + 1;
      return acc;
    }, {});

    const severityDistribution = reports.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + 1;
      return acc;
    }, {});

    const appointmentStatus = appointments.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      analytics: {
        totalPatients: patientIds.size,
        totalAppointments: appointments.length,
        reportsGenerated: reports.length,
        activePatients: patientIds.size,
        diseaseTrends,
        severityDistribution,
        appointmentStatus,
        patientGrowth: reports.map((item) => ({
          month: item.createdAt.toISOString().slice(0, 7),
          patientId: item.userId
        })),
        ageGroupAnalysis: {
          child: 0,
          adult: patientIds.size,
          senior: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
