import Card from "../components/Card.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function DashboardPage() {
  const { auth } = useApp();

  const cards = [
    {
      title: "Voice-ready diagnosis",
      text: "Speak symptoms in your language and receive AI-powered predictions with severity and guidance."
    },
    {
      title: "Rural accessibility",
      text: "Offline-friendly flows, simple layouts, and nearby hospital suggestions keep care usable on weak networks."
    },
    {
      title: "Protected medical records",
      text: "Each diagnosis becomes a searchable record with reports, notes, and appointment follow-up."
    }
  ];

  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-[32px] border border-[#0f766e]/20 px-7 py-8 shadow-[0_28px_90px_rgba(8,47,73,0.22)] md:px-10 md:py-10"
        style={{
          background:
            "linear-gradient(135deg, #083344 0%, #0f766e 48%, #15803d 100%)"
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.18),transparent_26%)]" />
        <div className="relative">
          <p className="inline-flex rounded-full border border-white/20 bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-slate-50">
            Healthcare Command Center
          </p>
          <h1 className="mt-4 font-display text-4xl text-white drop-shadow-[0_4px_16px_rgba(8,47,73,0.3)] md:text-5xl">
            Welcome back, {auth.user?.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100">
            Diagnose symptoms, book verified doctors, track history, and keep multilingual reports ready for your next
            consultation.
          </p>
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="border-[#d5e6e6] bg-white/98 text-slate-900 shadow-[0_20px_70px_rgba(8,47,73,0.08)]">
            <div className="mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-[#f59e0b]" />
            <h2 className="mb-3 text-xl font-semibold text-slate-900">{card.title}</h2>
            <p className="text-[15px] leading-7 text-slate-700">{card.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
