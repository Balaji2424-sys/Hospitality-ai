import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import VoiceInput from "../components/VoiceInput.jsx";
import { useApp } from "../context/AppContext.jsx";
import api, { withToken } from "../lib/api.js";

export default function DiagnosisPage() {
  const { auth, language } = useApp();
  const [symptomsText, setSymptomsText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speechMessage, setSpeechMessage] = useState("");

  useEffect(() => {
    const savedDraft = localStorage.getItem(`diagnosis-draft-${auth.user?._id}`);
    if (savedDraft) {
      setSymptomsText(savedDraft);
    }
  }, [auth.user?._id]);

  useEffect(() => {
    localStorage.setItem(`diagnosis-draft-${auth.user?._id}`, symptomsText);
  }, [auth.user?._id, symptomsText]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const symptoms = symptomsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const { data } = await api.post(
        "/diagnosis",
        {
          symptoms,
          language
        },
        withToken(auth.token)
      );
      setResult(data);
      setSpeechMessage("");
      localStorage.removeItem(`diagnosis-draft-${auth.user?._id}`);
    } finally {
      setLoading(false);
    }
  };

  const readReportAloud = () => {
    if (!result?.diagnosis?.report_text) {
      setSpeechMessage("No report is available to read.");
      return;
    }

    if (!window.speechSynthesis) {
      setSpeechMessage("Speech is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(result.diagnosis.report_text);
    utterance.lang = { en: "en-US", hi: "hi-IN", ta: "ta-IN" }[language] || "en-US";
    utterance.onstart = () => setSpeechMessage("Reading the AI report aloud.");
    utterance.onend = () => setSpeechMessage("Finished reading the AI report.");
    utterance.onerror = () => setSpeechMessage("Unable to read the report aloud.");

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card title="AI Diagnosis">
        <form onSubmit={submit} className="space-y-4">
          <textarea
            rows="6"
            className="w-full rounded-3xl border border-slate-200 p-4"
            placeholder="Enter symptoms separated by commas"
            value={symptomsText}
            onChange={(e) => setSymptomsText(e.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-brand-500 px-5 py-3 text-white" disabled={loading}>
              {loading ? "Analyzing..." : "Run diagnosis"}
            </button>
            <VoiceInput
              language={language}
              onTranscript={(text) => setSymptomsText((current) => (current ? `${current}, ${text}` : text))}
            />
          </div>
        </form>
      </Card>
      <Card title="Results">
        {!result ? (
          <p className="text-slate-500">Your diagnosis summary, report, and voice explanation will appear here.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Severity</div>
              <div className="text-2xl font-semibold">{result.diagnosis.localized_severity}</div>
            </div>
            <div>
              {result.diagnosis.predictions.map((item) => (
                <div key={item.disease} className="flex items-center justify-between border-b py-2 text-sm">
                  <span>{item.disease}</span>
                  <span>{item.confidence}%</span>
                </div>
              ))}
            </div>
            <div className="whitespace-pre-line rounded-2xl bg-brand-50 p-4 text-sm text-slate-700">
              {result.diagnosis.report_text}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://127.0.0.1:5000"}${result.reportUrl}`}
                className="inline-block rounded-full bg-slate-900 px-4 py-2 text-white"
              >
                Download PDF
              </a>
              <button
                type="button"
                className="rounded-full bg-brand-500 px-4 py-2 text-white"
                onClick={readReportAloud}
              >
                Mic - Read Report
              </button>
            </div>
            {speechMessage ? <p className="text-sm text-brand-700">{speechMessage}</p> : null}
          </div>
        )}
      </Card>
    </div>
  );
}
