// src/pages/EngineerLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../AppContext";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Wrench,
  Database,
  Award,
  IndianRupee,
  Briefcase,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

export default function EngineerLogin() {
  const { authenticateEngineer, engineersList } = useApp();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("ENG001");
  const [password, setPassword] = useState("eng123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Please enter your Admin-issued Engineer ID and Password");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = authenticateEngineer(identifier, password);
      setLoading(false);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(
        `Welcome to Field Terminal, ${res.engineer.name} (${res.engineer.id})!`
      );
      navigate("/engineer", { replace: true });
    }, 350);
  };

  const fillEngineerCredentials = (eng) => {
    setIdentifier(eng.id);
    setPassword(eng.password || "eng123");
    toast.success(`Filled credentials for ${eng.name} (${eng.id})`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* ================= LEFT SIDE: PLUGGY ENGINEER BRAND & ICON SHOWCASE ================= */}
      <div className="lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-[#121E36] via-[#1A2A49] to-[#223a61] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-[#F37021]">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#F37021]/20 blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-[#F37021]/40 text-[#FF8C42] text-xs font-bold">
            <Wrench size={13} /> Dedicated Engineer Partner Portal
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Database size={13} /> SQL Dispatch Connected
          </span>
        </div>

        {/* Center Pluggy Partner Logo & Highlights */}
        <div className="relative z-10 my-8 lg:my-auto max-w-lg">
          {/* Pluggy Logo Lockup */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/15 shadow-xl"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center p-2.5 shadow-lg shrink-0 ring-2 ring-[#F37021]">
              <img
                src="/image/logos.png"
                alt="Pluggy Partner Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  Plug<span className="text-[#F37021]">gy</span>
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-[#F37021] text-white px-2.5 py-0.5 rounded-md">
                  ENGINEER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-1">
                Field Technician Dispatch & OTP Verification Terminal
              </p>
              <p className="text-xs text-emerald-300 font-semibold mt-1">
                • ID & Access Controlled by Admin HQ
              </p>
            </div>
          </motion.div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
            Your Assigned Jobs, Toolkit &{" "}
            <span className="text-[#F37021]">Instant Wallet Payouts.</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed mb-6">
            Sign in with the Engineer ID and Password issued by the Pluggy Admin Desk to view your assigned customer visits, verify Start/Happy PINs, and quote official spare parts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <IndianRupee size={20} className="text-[#F37021] mb-1.5" />
              <p className="text-xs font-bold text-white">80% Service Share</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                + 100% MRP on spare parts
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <Briefcase size={20} className="text-emerald-400 mb-1.5" />
              <p className="text-xs font-bold text-white">Assigned Jobs Only</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                Dispatched by Admin HQ
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <Award size={20} className="text-amber-300 mb-1.5" />
              <p className="text-xs font-bold text-white">Instant Settlement</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                On customer Happy PIN entry
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Role Switcher */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-blue-200/80 font-medium">Switch Portal:</span>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              👤 Customer Login
            </Link>
            <Link
              to="/engineer-login"
              className="px-3 py-1.5 rounded-xl bg-[#F37021] text-white font-bold shadow-sm"
            >
              👨‍🔧 Engineer Login
            </Link>
            <Link
              to="/admin-login"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              🛡️ Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: ENGINEER LOGIN FORM ================= */}
      <div className="lg:w-7/12 xl:w-1/2 flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8"
        >
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
            <Link
              to="/login"
              className="py-2.5 text-center rounded-xl text-slate-600 hover:text-[#1A2A49] hover:bg-white/60 transition"
            >
              👤 Customer
            </Link>
            <Link
              to="/engineer-login"
              className="py-2.5 text-center rounded-xl bg-[#1A2A49] text-white shadow-sm"
            >
              👨‍🔧 Engineer
            </Link>
            <Link
              to="/admin-login"
              className="py-2.5 text-center rounded-xl text-slate-600 hover:text-[#1A2A49] hover:bg-white/60 transition"
            >
              🛡️ Admin
            </Link>
          </div>

          <div className="mb-5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2.5 py-1 rounded-md mb-1.5">
              Admin-Issued Partner Credentials
            </span>
            <h2 className="text-2xl font-extrabold text-[#1A2A49]">
              Engineer Terminal Login
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter the Engineer ID (e.g., <code className="font-bold text-[#1A2A49]">ENG001</code>) and Password issued to you by the Admin Control Desk.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Engineer ID or Registered Phone
              </label>
              <div className="relative flex items-center">
                <ShieldCheck
                  size={17}
                  className="absolute left-3.5 text-[#F37021]"
                />
                <input
                  type="text"
                  placeholder="ENG001 or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Partner Password (Issued by Admin)
              </label>
              <div className="relative flex items-center">
                <Lock size={17} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password (default: eng123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99]"
            >
              {loading ? "Authenticating..." : "Sign In to Engineer Terminal"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Registered SQL Engineers List (Click to auto-fill ID & Password) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <KeyRound size={12} className="text-[#F37021]" /> Admin-Registered SQL Engineers
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Click to Fill ID
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {(engineersList || []).map((eng) => (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => fillEngineerCredentials(eng)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition text-left ${
                    identifier.toUpperCase() === eng.id.toUpperCase()
                      ? "border-[#F37021] bg-orange-50/50"
                      : "border-slate-200 hover:border-[#1A2A49]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-2 py-1 rounded-lg bg-[#1A2A49] text-[#F37021] font-mono text-xs font-extrabold shrink-0">
                      {eng.id}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1A2A49] truncate">
                        {eng.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {eng.specialization} • Pass:{" "}
                        <code className="font-bold text-slate-700">
                          {eng.password || "eng123"}
                        </code>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      eng.status === "SUSPENDED"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {eng.status === "SUSPENDED" ? "Suspended" : "Active"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
