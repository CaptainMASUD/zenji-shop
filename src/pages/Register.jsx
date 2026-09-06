import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/common/Button.jsx";
export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 6) {
      setError(
        "Complete the required fields. Password must be at least 6 characters.",
      );
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    register(form);
    nav("/account");
  };
  const field = (key, label, type = "text") => (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        type={type}
        className="mt-2 w-full border-b border-line bg-transparent py-4 outline-none focus:border-crimson"
      />
    </label>
  );
  return (
    <section className="site-container flex min-h-[calc(100vh-110px)] items-center justify-center py-16">
      <form onSubmit={submit} className="w-full max-w-xl">
        <p className="eyebrow">ACCOUNT / CREATE</p>
        <h1 className="mt-4 font-display text-6xl tracking-[-.055em]">
          Join the archive.
        </h1>
        <p className="mt-4 text-sm leading-7 text-silver">
          Frontend-only account creation persisted to localStorage for this
          assessment build.
        </p>
        {error && <p className="mt-4 text-sm text-crimson">{error}</p>}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {field("name", "Full name")}
          {field("email", "Email", "email")}
          {field("phone", "Phone")}
          {field("password", "Password", "password")}
          <div className="sm:col-span-2">
            {field("confirm", "Confirm password", "password")}
          </div>
        </div>
        <Button type="submit" className="mt-8 w-full">
          Create account
        </Button>
        <p className="mt-6 text-center text-xs text-silver">
          Already registered?{" "}
          <Link to="/login" className="text-ivory underline underline-offset-4">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
