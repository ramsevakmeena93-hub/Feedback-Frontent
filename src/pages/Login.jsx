import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, ArrowLeft, CheckCircle, Eye, EyeOff, Mail, Lock } from "lucide-react";
import mitsLogo from "../assets/mits-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) redirect(user.role);
  }, [user]);

  function redirect(role) {
    const dest =
      role === "vc" ? "/vc"
      : role === "faculty" ? "/faculty"
      : role === "admin" ? "/admin"
      : "/hod";
    navigate(dest, { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name?.split(" ")[0]}! 👋`);
      redirect(data.user.role);
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password.";
      toast.error(msg, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0a0f1e] overflow-hidden">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-700 opacity-90" />
        <div className="absolute inset-0 bg-[#0a0f1e]/30" />
        <div className="absolute inset-0 bg-grid-dark opacity-20" />

        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float-slow" />

        <div className="relative flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20 flex-shrink-0 shadow-lg">
              <img src={mitsLogo} alt="MITS" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-white font-bold leading-tight">MITS Gwalior</p>
              <p className="text-white/60 text-xs">Faculty Feedback System</p>
            </div>
          </div>

          {/* Centre */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <GraduationCap size={36} className="text-white" />
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-3 leading-tight">
              Welcome Back
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Sign in to access your personalized dashboard
            </p>

            <div className="space-y-3">
              {[
                "Secure email & password sign-in",
                "Auto role detection — HOD, Faculty, VC, Admin",
                "Access your personalized dashboard instantly",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Demo credentials hint */}
            <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">🎯 Demo Mode</p>
              <p className="text-white/60 text-xs">
                Register a new account or use pre-seeded credentials to explore all dashboards.
              </p>
            </div>
          </div>

          <div className="text-white/40 text-xs">
            Automated Faculty Feedback Analysis System · MITS 2025–26
          </div>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center px-6 lg:px-10 py-5">
          <button
            onClick={() => navigate("/landing")}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12 pb-8">
          <div className="w-full max-w-sm animate-fade-up">

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl">
                <img src={mitsLogo} alt="MITS" className="w-10 h-10 object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Sign in to your account</h1>
              <p className="text-slate-400 text-sm">Enter your credentials to continue</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full pl-9 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-900/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-600 text-xs">Don't have an account?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Register link */}
            <Link
              to="/register"
              id="go-to-register-btn"
              className="block w-full py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm text-center transition-all duration-200"
            >
              Create a Demo Account
            </Link>

            <p className="text-slate-600 text-xs text-center mt-5">
              By signing in you agree to MITS institutional policies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
