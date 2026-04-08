import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" }
];

export default function LanguageSelectionPage() {
  const { language, setLanguage } = useApp();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Multilingual Healthcare</p>
        <h1 className="mt-3 font-display text-5xl text-slate-900">Choose your care language</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Rural-friendly AI diagnosis, voice assistance, appointments, reports, and doctor access all adapt to your
          selected language.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className={`rounded-3xl border p-6 text-left transition ${
                language === item.code ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-xl font-semibold">{item.label}</div>
              <div className="mt-2 text-sm text-slate-500">UI, voice, AI answers, and reports</div>
            </button>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          <Link to="/login" className="rounded-full bg-brand-500 px-5 py-3 text-white">
            Continue
          </Link>
          <Link to="/register" className="rounded-full bg-slate-200 px-5 py-3 text-slate-800">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
