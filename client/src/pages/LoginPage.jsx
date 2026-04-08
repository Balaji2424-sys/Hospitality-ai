import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import api from "../lib/api.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      setAuth({ token: data.token, user: data.user });
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <button className="mt-6 w-full rounded-2xl bg-brand-500 px-4 py-3 text-white">Login</button>
        <Link to="/register" className="mt-4 block text-center text-sm text-brand-700">
          Need an account?
        </Link>
      </form>
    </div>
  );
}
