import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { useApp } from "../context/AppContext.jsx";
import api, { withToken } from "../lib/api.js";

const patientTrackingOptions = ["On The Way", "Arrived"];
const doctorTrackingOptions = ["In Progress", "Completed", "No Show"];

export default function AppointmentsPage() {
  const { auth } = useApp();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorHint, setDoctorHint] = useState("");
  const [form, setForm] = useState({ doctorId: "", date: "", time: "", reason: "" });
  const [rescheduleForm, setRescheduleForm] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const load = () => {
    api.get("/users/doctors", withToken(auth.token)).then(({ data }) => {
      setDoctors(data.doctors);
      setDoctorHint(
        data.diagnosisBasedOn
          ? `Recommended doctors based on your latest diagnosis: ${data.diagnosisBasedOn}`
          : "Showing verified nearby doctors from the built-in care network."
      );
      if (!form.doctorId && data.doctors.length) {
        setForm((current) => ({ ...current, doctorId: data.doctors[0]._id }));
      }
    });
    api.get("/appointments", withToken(auth.token)).then(({ data }) => setAppointments(data.appointments));
  };

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/appointments/request", form, withToken(auth.token));
      setForm({ doctorId: "", date: "", time: "", reason: "" });
      setFeedback({ type: "success", message: "Appointment request sent successfully." });
      load();
    } catch (error) {
      setFeedback({ type: "error", message: error.response?.data?.message || "Unable to send appointment request." });
    }
  };

  const respond = async (appointmentId, status) => {
    try {
      await api.post("/appointments/respond", { appointmentId, status }, withToken(auth.token));
      setFeedback({ type: "success", message: `Appointment updated to ${status}.` });
      load();
    } catch (error) {
      setFeedback({ type: "error", message: error.response?.data?.message || "Unable to update appointment." });
    }
  };

  const updatePatientTracking = async (appointmentId, patientStatus) => {
    try {
      await api.post("/appointments/track/patient", { appointmentId, patientStatus }, withToken(auth.token));
      setFeedback({ type: "success", message: `Patient tracking updated to ${patientStatus}.` });
      load();
    } catch (error) {
      setFeedback({ type: "error", message: error.response?.data?.message || "Unable to update patient tracking." });
    }
  };

  const updateDoctorTracking = async (appointmentId, consultationStatus) => {
    try {
      await api.post("/appointments/track/doctor", { appointmentId, consultationStatus }, withToken(auth.token));
      setFeedback({ type: "success", message: `Consultation marked as ${consultationStatus}.` });
      load();
    } catch (error) {
      setFeedback({ type: "error", message: error.response?.data?.message || "Unable to update consultation status." });
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await api.post("/appointments/cancel", { appointmentId }, withToken(auth.token));
      setFeedback({ type: "success", message: "Appointment cancelled successfully." });
      load();
    } catch (error) {
      setFeedback({ type: "error", message: error.response?.data?.message || "Unable to cancel appointment." });
    }
  };

  const requestReschedule = async (appointmentId) => {
    const payload = rescheduleForm[appointmentId];
    if (!payload?.date || !payload?.time) {
      return;
    }

    try {
      await api.post(
        "/appointments/reschedule",
        {
          appointmentId,
          date: payload.date,
          time: payload.time,
          note: payload.note || ""
        },
        withToken(auth.token)
      );
      setRescheduleForm((current) => ({ ...current, [appointmentId]: undefined }));
      setFeedback({ type: "success", message: "Reschedule request sent successfully." });
      load();
    } catch (error) {
      setFeedback({ type: "error", message: error.response?.data?.message || "Unable to request reschedule." });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {auth.user.role === "user" ? (
        <Card title="Book appointment">
          <form onSubmit={submit} className="space-y-4">
            <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">{doctorHint}</div>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            >
              <option value="">Select doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.recommended ? "Recommended - " : ""}
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
            {doctors.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                {doctors.find((doctor) => doctor._id === form.doctorId)?.matchReason || doctors[0]?.matchReason}
              </div>
            ) : null}
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              type="time"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
            <textarea
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Reason for appointment"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
            <button className="rounded-full bg-brand-500 px-5 py-3 text-white">Send request</button>
          </form>
        </Card>
      ) : null}
      <Card title="Appointment inbox">
        <div className="space-y-4">
          {feedback.message ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                feedback.type === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}
          {!appointments.length ? <p className="text-sm text-slate-500">No appointments yet.</p> : null}
          {appointments.map((appointment) => (
            <div key={appointment._id} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  {auth.user.role === "doctor" ? appointment.userId?.name : appointment.doctorId?.name}
                </div>
                <div className="text-sm">{appointment.status}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {appointment.date} at {appointment.time}
              </div>
              <div className="mt-2 text-sm text-slate-600">{appointment.reason}</div>
              {appointment.status === "Reschedule Requested" && appointment.rescheduleRequest ? (
                <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
                  Proposed new slot: {appointment.rescheduleRequest.proposedDate} at{" "}
                  {appointment.rescheduleRequest.proposedTime}
                  {appointment.rescheduleRequest.note ? ` - ${appointment.rescheduleRequest.note}` : ""}
                </div>
              ) : null}
              {appointment.status === "Accepted" ? (
                <div className="mt-3 grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                  <div>
                    Patient tracking:
                    <span className="ml-2 font-semibold">{appointment.tracking?.patientStatus || "Waiting"}</span>
                  </div>
                  <div>
                    Consultation:
                    <span className="ml-2 font-semibold">
                      {appointment.tracking?.consultationStatus || "Scheduled"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Last updated by {appointment.tracking?.lastUpdatedBy || "system"} on{" "}
                    {appointment.tracking?.updatedAt
                      ? new Date(appointment.tracking.updatedAt).toLocaleString()
                      : "just now"}
                  </div>
                </div>
              ) : null}
              {auth.user.role === "doctor" &&
              (appointment.status === "Pending" || appointment.status === "Reschedule Requested") ? (
                <div className="mt-3 flex gap-2">
                  <button
                    className="rounded-full bg-emerald-600 px-4 py-2 text-white"
                    onClick={() => respond(appointment._id, "Accepted")}
                  >
                    {appointment.status === "Reschedule Requested" ? "Approve Reschedule" : "Accept"}
                  </button>
                  <button
                    className="rounded-full bg-rose-600 px-4 py-2 text-white"
                    onClick={() => respond(appointment._id, "Rejected")}
                  >
                    {appointment.status === "Reschedule Requested" ? "Reject Reschedule" : "Reject"}
                  </button>
                </div>
              ) : null}
              {auth.user.role === "user" && appointment.status === "Accepted" ? (
                <>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {patientTrackingOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="rounded-full bg-brand-100 px-4 py-2 text-brand-700"
                        onClick={() => updatePatientTracking(appointment._id, option)}
                      >
                        Mark {option}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="rounded-full bg-rose-100 px-4 py-2 text-rose-700"
                      onClick={() => cancelAppointment(appointment._id)}
                    >
                      Reject Appointment
                    </button>
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-200 p-3">
                    <div className="text-sm font-medium text-slate-700">Reschedule request</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <input
                        type="date"
                        className="rounded-2xl border border-slate-200 px-4 py-3"
                        value={rescheduleForm[appointment._id]?.date || ""}
                        onChange={(e) =>
                          setRescheduleForm((current) => ({
                            ...current,
                            [appointment._id]: {
                              ...current[appointment._id],
                              date: e.target.value
                            }
                          }))
                        }
                      />
                      <input
                        type="time"
                        className="rounded-2xl border border-slate-200 px-4 py-3"
                        value={rescheduleForm[appointment._id]?.time || ""}
                        onChange={(e) =>
                          setRescheduleForm((current) => ({
                            ...current,
                            [appointment._id]: {
                              ...current[appointment._id],
                              time: e.target.value
                            }
                          }))
                        }
                      />
                    </div>
                    <textarea
                      className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3"
                      placeholder="Reason for reschedule"
                      value={rescheduleForm[appointment._id]?.note || ""}
                      onChange={(e) =>
                        setRescheduleForm((current) => ({
                          ...current,
                          [appointment._id]: {
                            ...current[appointment._id],
                            note: e.target.value
                          }
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="mt-3 rounded-full bg-amber-500 px-4 py-2 text-white"
                      onClick={() => requestReschedule(appointment._id)}
                    >
                      Request Reschedule
                    </button>
                  </div>
                </>
              ) : null}
              {auth.user.role === "doctor" && appointment.status === "Accepted" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {doctorTrackingOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="rounded-full bg-slate-900 px-4 py-2 text-white"
                      onClick={() => updateDoctorTracking(appointment._id, option)}
                    >
                      Mark {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

