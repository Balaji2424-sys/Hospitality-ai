import { Link, NavLink, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Layout() {
  const { auth, setAuth, t } = useApp();
  const isDoctor = auth.user?.role === "doctor";

  const links = isDoctor
    ? [
        { to: "/app/doctor/dashboard", label: "Doctor Dashboard" },
        { to: "/app/appointments", label: t.appointments },
        { to: "/app/notifications", label: t.notifications },
        { to: "/app/doctor/analytics", label: t.doctorAnalytics }
      ]
    : [
        { to: "/app", label: "Dashboard" },
        { to: "/app/diagnosis", label: t.diagnosis },
        { to: "/app/history", label: t.history },
        { to: "/app/appointments", label: t.appointments },
        { to: "/app/notifications", label: t.notifications }
      ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/app" className="font-display text-2xl text-brand-700">
            {t.appName}
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/app"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 ${isActive ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-700"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={() => setAuth({ token: "", user: null })}
              className="rounded-full bg-rose-100 px-4 py-2 text-rose-700"
            >
              {t.logout}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
