import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import api from "../lib/api.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { language, setAuth } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    preferredLanguage: language,
    specialization: "",
    licenseNumber: ""
  });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, preferredLanguage: language };
      const { data } = await api.post("/auth/register", payload);
      setAuth({ token: data.token, user: data.user });
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold">Create account</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="rounded-2xl border border-slate-200 px-4 py-3"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          {form.role === "doctor" ? (
            <>
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Specialization"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              />
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="License number"
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
              />
            </>
          ) : null}
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <button className="mt-6 w-full rounded-2xl bg-brand-500 px-4 py-3 text-white">Register</button>
        <Link to="/login" className="mt-4 block text-center text-sm text-brand-700">
          Already have an account?
        </Link>
      </form>
    </div>
  );
}
