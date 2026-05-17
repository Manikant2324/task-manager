import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles } from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // Basic client-side validation
      if (!formData.email || !formData.password) {
        alert("Email and password are required");
        return;
      }
      if (formData.password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");

    }

    catch (error) {

      alert(
        error.response?.data?.message
        || error.message
        || "Login Failed"
      );

    }

  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-dashboard-gradient px-4 py-10 text-slate-100">

      <form
        onSubmit={handleSubmit}
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 px-8 py-10 shadow-glow backdrop-blur-xl"
      >
        <div className="absolute -left-16 top-8 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">TaskFlow</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-400">Sign in to access your premium task dashboard.</p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-glass pl-11"
                />
              </div>
            </label>
            <label className="block">
              <span className="sr-only">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-glass pl-11"
                />
              </div>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-400" />
              Remember me
            </label>
            <button type="button" className="text-cyan-300 transition hover:text-cyan-100">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30"
          >
            Sign in
          </button>

          <p className="text-center text-sm text-slate-500">
            Don’t have an account?{' '}
            <a href="/register" className="font-medium text-cyan-300 transition hover:text-cyan-100">
              Create one
            </a>
          </p>
        </div>
      </form>

    </div>
  );

}

export default Login;