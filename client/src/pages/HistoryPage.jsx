import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { useApp } from "../context/AppContext.jsx";
import api, { withToken } from "../lib/api.js";

export default function HistoryPage() {
  const { auth } = useApp();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get(`/history/${auth.user._id}?search=${encodeURIComponent(search)}`, withToken(auth.token))
      .then(({ data }) => setRecords(data.records));
  }, [auth, search]);

  return (
    <Card title="Medical history">
      <input
        className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
        placeholder="Search by symptom or disease"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record._id} className="rounded-3xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold">{record.predictions?.[0]?.disease}</div>
              <div className="text-sm text-slate-500">{new Date(record.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-sm text-slate-600">Symptoms: {record.symptoms.join(", ")}</div>
            <div className="mt-2 text-sm text-slate-600">Severity: {record.severity}</div>
            <div className="mt-2 text-sm text-slate-600">Doctor notes: {record.doctorNotes || "Pending"}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
