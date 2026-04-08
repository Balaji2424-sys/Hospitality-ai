export default function Card({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-[#dce9ea] bg-[rgba(255,255,255,0.97)] p-6 shadow-[0_20px_56px_rgba(15,23,42,0.08)] backdrop-blur-sm ${className}`}
    >
      {title ? <h2 className="mb-4 text-xl font-semibold text-slate-900">{title}</h2> : null}
      {children}
    </section>
  );
}
