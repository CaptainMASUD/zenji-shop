import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/common/Button.jsx";
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({
    email: "demo@zenji.store",
    password: "zenji123",
  });
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Enter your email and password.");
      return;
    }
    login(form);
    nav(loc.state?.from || "/account");
  };
  return (
    <section className="site-container grid min-h-[calc(100vh-110px)] items-stretch lg:grid-cols-2">
      <div className="hidden overflow-hidden border-r border-line lg:block">
        <img
          src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=88"
          alt=""
          className="h-full w-full object-cover opacity-80"
        />
      </div>
      <div className="flex items-center justify-center py-16 lg:px-14">
        <form onSubmit={submit} className="w-full max-w-md">
          <p className="eyebrow">ACCOUNT / ACCESS</p>
          <h1 className="mt-4 font-display text-6xl tracking-[-.055em]">
            Welcome back.
          </h1>
          <p className="mt-4 text-sm leading-7 text-silver">
            Use the demo credentials already filled in, or enter any
            email/password to explore the frontend account flow.
          </p>
          {error && <p className="mt-4 text-sm text-crimson">{error}</p>}
          <label className="mt-8 block">
            <span className="eyebrow">Email</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              className="mt-2 w-full border-b border-line bg-transparent py-4 outline-none focus:border-crimson"
            />
          </label>
          <label className="mt-5 block">
            <span className="eyebrow">Password</span>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              className="mt-2 w-full border-b border-line bg-transparent py-4 outline-none focus:border-crimson"
            />
          </label>
          <Button type="submit" className="mt-8 w-full">
            Login
          </Button>
          <p className="mt-6 text-center text-xs text-silver">
            New here?{" "}
            <Link
              to="/register"
              className="text-ivory underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
