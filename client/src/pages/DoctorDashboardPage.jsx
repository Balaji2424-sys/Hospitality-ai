import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { useApp } from "../context/AppContext.jsx";
import api, { withToken } from "../lib/api.js";

export default function DoctorDashboardPage() {
  const { auth } = useApp();
  const [data, setData] = useState({ appointments: [], reports: [] });
  const [notes, setNotes] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const load = () => {
    api.get("/doctor/dashboard", withToken(auth.token)).then(({ data: response }) => setData(response));
  };

  useEffect(() => {
    load();
  }, []);

  const saveNote = async (recordId) => {
    await api.post(`/history/note/${recordId}`, { doctorNotes: notes[recordId] || "" }, withToken(auth.token));
    setStatusMessage("Doctor note saved successfully.");
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Manage appointments">
        <div className="space-y-4">
          {!data.appointments.length ? <p className="text-sm text-slate-500">No appointment requests yet.</p> : null}
          {data.appointments.map((item) => (
            <div key={item._id} className="rounded-3xl border border-slate-200 p-4">
              <div className="font-semibold">{item.userId?.name}</div>
              <div className="mt-2 text-sm text-slate-600">
                {item.date} at {item.time} - {item.status}
              </div>
              <div className="mt-2 text-sm text-slate-600">{item.reason}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Add doctor notes">
        <div className="space-y-4">
          {statusMessage ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{statusMessage}</div> : null}
          {!data.reports.length ? (
            <p className="text-sm text-slate-500">
              No patient reports are linked to this doctor yet. Once a patient books you and has a diagnosis record,
              it will appear here for note entry.
            </p>
          ) : null}
          {data.reports.map((item) => (
            <div key={item._id} className="rounded-3xl border border-slate-200 p-4">
              <div className="font-semibold">{item.userId?.name}</div>
              <div className="mt-2 text-sm text-slate-600">{item.symptoms.join(", ")}</div>
              <textarea
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Add clinical note"
                value={notes[item._id] ?? item.doctorNotes ?? ""}
                onChange={(e) => setNotes({ ...notes, [item._id]: e.target.value })}
              />
              <button
                onClick={() => saveNote(item._id)}
                className="mt-3 rounded-full bg-brand-500 px-4 py-2 text-white"
              >
                Save note
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

