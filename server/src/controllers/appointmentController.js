import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";

const notifyParties = async ({
  appointment,
  patientTitle,
  patientMessage,
  doctorTitle,
  doctorMessage,
  type = "appointment"
}) => {
  const notifications = [];

  if (patientTitle && patientMessage) {
    notifications.push({
      userId: appointment.userId,
      title: patientTitle,
      message: patientMessage,
      type
    });
  }

  if (doctorTitle && doctorMessage) {
    notifications.push({
      userId: appointment.doctorId,
      title: doctorTitle,
      message: doctorMessage,
      type
    });
  }

  if (notifications.length) {
    await Notification.insertMany(notifications);
  }
};

export const requestAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      userId: req.user._id,
      tracking: {
        patientStatus: "Waiting",
        consultationStatus: "Scheduled",
        lastUpdatedBy: "system",
        updatedAt: new Date()
      }
    });

    await notifyParties({
      appointment,
      patientTitle: "Appointment Request Sent",
      patientMessage: `Your request for ${req.body.date} at ${req.body.time} has been sent to the doctor.`,
      doctorTitle: "New Appointment Request",
      doctorMessage: `New appointment request for ${req.body.date} at ${req.body.time}.`,
      type: "appointment"
    });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

export const respondAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only assigned doctor can respond");
    }

    const isRescheduleDecision = appointment.status === "Reschedule Requested";

    if (isRescheduleDecision) {
      if (req.body.status === "Accepted") {
        appointment.status = "Accepted";
        if (appointment.rescheduleRequest?.proposedDate) {
          appointment.date = appointment.rescheduleRequest.proposedDate;
        }
        if (appointment.rescheduleRequest?.proposedTime) {
          appointment.time = appointment.rescheduleRequest.proposedTime;
        }
      } else {
        appointment.status = "Accepted";
      }
      appointment.rescheduleRequest = undefined;
    } else {
      appointment.status = req.body.status;
      if (req.body.status !== "Accepted") {
        appointment.rescheduleRequest = undefined;
      }
    }

    appointment.tracking = {
      ...appointment.tracking,
      consultationStatus:
        req.body.status === "Accepted" || isRescheduleDecision
          ? "Scheduled"
          : appointment.tracking?.consultationStatus || "Scheduled",
      lastUpdatedBy: "doctor",
      updatedAt: new Date()
    };
    await appointment.save();

    await notifyParties({
      appointment,
      patientTitle: isRescheduleDecision
        ? req.body.status === "Accepted"
          ? "Reschedule Approved"
          : "Reschedule Rejected"
        : req.body.status === "Accepted"
          ? "Appointment Confirmed"
          : "Appointment Rejected",
      patientMessage: isRescheduleDecision
        ? req.body.status === "Accepted"
          ? `Your appointment has been moved to ${appointment.date} at ${appointment.time}.`
          : `Your reschedule request was rejected. The original appointment remains active.`
        : `Your appointment on ${appointment.date} at ${appointment.time} was ${req.body.status.toLowerCase()}.`,
      doctorTitle: isRescheduleDecision ? "Reschedule Decision Recorded" : "Appointment Response Recorded",
      doctorMessage: isRescheduleDecision
        ? req.body.status === "Accepted"
          ? `You approved the reschedule. New slot: ${appointment.date} at ${appointment.time}.`
          : "You rejected the patient's reschedule request."
        : `You marked the appointment on ${appointment.date} at ${appointment.time} as ${req.body.status}.`,
      type: "appointment"
    });

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

export const updatePatientTracking = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the patient can update this tracking status");
    }

    appointment.tracking = {
      ...appointment.tracking,
      patientStatus: req.body.patientStatus,
      lastUpdatedBy: "user",
      updatedAt: new Date()
    };
    await appointment.save();

    await notifyParties({
      appointment,
      patientTitle: "Your Tracking Status Updated",
      patientMessage: `You marked your appointment as ${req.body.patientStatus}.`,
      doctorTitle: "Patient Tracking Update",
      doctorMessage: `Patient status changed to ${req.body.patientStatus} for the appointment on ${appointment.date} at ${appointment.time}.`,
      type: "appointment-tracking"
    });

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorTracking = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the assigned doctor can update consultation status");
    }

    appointment.tracking = {
      ...appointment.tracking,
      consultationStatus: req.body.consultationStatus,
      lastUpdatedBy: "doctor",
      updatedAt: new Date()
    };
    await appointment.save();

    await notifyParties({
      appointment,
      patientTitle: "Consultation Tracking Update",
      patientMessage: `Your appointment status is now ${req.body.consultationStatus}.`,
      doctorTitle: "Consultation Tracking Updated",
      doctorMessage: `You marked this appointment as ${req.body.consultationStatus}.`,
      type: "appointment-tracking"
    });

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentByPatient = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the patient can cancel this appointment");
    }

    appointment.status = "Cancelled";
    appointment.tracking = {
      ...appointment.tracking,
      consultationStatus: "No Show",
      lastUpdatedBy: "user",
      updatedAt: new Date()
    };
    await appointment.save();

    await notifyParties({
      appointment,
      patientTitle: "Appointment Cancelled",
      patientMessage: `You cancelled the appointment on ${appointment.date} at ${appointment.time}.`,
      doctorTitle: "Patient Cancelled Appointment",
      doctorMessage: `The patient cancelled the appointment on ${appointment.date} at ${appointment.time}.`,
      type: "appointment"
    });

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

export const requestRescheduleByPatient = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the patient can request a reschedule");
    }

    appointment.status = "Reschedule Requested";
    appointment.rescheduleRequest = {
      proposedDate: req.body.date,
      proposedTime: req.body.time,
      note: req.body.note || "",
      requestedAt: new Date()
    };
    appointment.tracking = {
      ...appointment.tracking,
      lastUpdatedBy: "user",
      updatedAt: new Date()
    };
    await appointment.save();

    await notifyParties({
      appointment,
      patientTitle: "Reschedule Request Sent",
      patientMessage: `You requested a new slot for ${req.body.date} at ${req.body.time}.`,
      doctorTitle: "Patient Requested Reschedule",
      doctorMessage: `The patient requested to move the appointment to ${req.body.date} at ${req.body.time}.`,
      type: "appointment"
    });

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const query = req.user.role === "doctor" ? { doctorId: req.user._id } : { userId: req.user._id };
    const appointments = await Appointment.find(query)
      .populate("userId", "name age gender")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};
