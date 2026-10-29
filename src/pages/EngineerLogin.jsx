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
  ChevronLeft,
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
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* ================= MOBILE COMPACT TOP BRAND BAR (< lg) ================= */}
      <div className="lg:hidden bg-gradient-to-r from-[#121E36] via-[#1A2A49] to-[#223a61] text-white px-4 py-3.5 border-b-2 border-[#F37021] shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-100 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10"
          >
            <ChevronLeft size={14} /> Home
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-[#F37021]/40 text-[#FF8C42] text-[10px] font-bold">
            <Wrench size={11} /> Engineer Terminal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md shrink-0 ring-2 ring-[#F37021]">
            <img
              src="/image/logos.png"
              alt="Pluggy Partner Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight leading-none">
              <span className="text-white">Plug</span>
              <span className="text-[#F37021]">gy</span>
              <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider bg-[#F37021] text-white px-2 py-0.5 rounded-md">
                ENGINEER
              </span>
            </div>
            <p className="text-[11px] text-blue-100/85 mt-1">
              Login with Admin-Issued Engineer ID & Password
            </p>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP LEFT SIDE: PLUGGY ENGINEER BRAND SHOWCASE (lg+) ================= */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 lg:h-full bg-gradient-to-br from-[#121E36] via-[#1A2A49] to-[#223a61] text-white p-7 xl:p-10 flex-col justify-between relative overflow-hidden border-r-4 border-[#F37021]">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F37021]/20 blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition"
          >
            <ChevronLeft size={15} /> Back to Storefront
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Database size={12} /> SQL Dispatch Connected
          </span>
        </div>

        {/* Center Pluggy Partner Logo & Highlights */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-[#F37021]/40 text-[#FF8C42] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Wrench size={12} /> Dedicated Field Partner Terminal
          </div>

          {/* Pluggy Logo Lockup */}
          <div className="flex items-center gap-4 mb-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl">
            <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg shrink-0 ring-2 ring-[#F37021]">
              <img
                src="/image/logos.png"
                alt="Pluggy Partner Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-2xl xl:text-3xl font-extrabold text-white">
                  Plug<span className="text-[#F37021]">gy</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#F37021] text-white px-2 py-0.5 rounded-md">
                  ENGINEER
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium mt-1">
                Field Technician Dispatch & OTP Verification Terminal
              </p>
              <p className="text-[11px] text-emerald-300 font-semibold mt-1">
                • ID & Access Controlled by Admin HQ
              </p>
            </div>
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold leading-snug mb-2">
            Your Assigned Jobs, Toolkit &{" "}
            <span className="text-[#F37021]">Instant Wallet Payouts.</span>
          </h1>
          <p className="text-xs xl:text-sm text-blue-100/80 leading-relaxed mb-4">
            Sign in with the Engineer ID and Password issued by the Pluggy Admin
            Desk to view your assigned customer visits and verify Start/Happy
            PINs.
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <IndianRupee size={17} className="text-[#F37021] mb-1" />
              <p className="text-[11px] font-bold text-white">80% Share</p>
              <p className="text-[10px] text-blue-200/80">+ 100% Spare MRP</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Briefcase size={17} className="text-emerald-400 mb-1" />
              <p className="text-[11px] font-bold text-white">Assigned Only</p>
              <p className="text-[10px] text-blue-200/80">
                Dispatched by Admin
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Award size={17} className="text-amber-300 mb-1" />
              <p className="text-[11px] font-bold text-white">Instant Payout</p>
              <p className="text-[10px] text-blue-200/80">On Happy PIN entry</p>
            </div>
          </div>
        </div>

        {/* Bottom Role Switcher */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
          <span className="text-blue-200/80 font-medium">Switch Portal:</span>
          <div className="flex items-center gap-1.5">
            <Link
              to="/login"
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              👤 Customer
            </Link>
            <Link
              to="/engineer-login"
              className="px-2.5 py-1 rounded-lg bg-[#F37021] text-white font-bold shadow-sm"
            >
              👨‍🔧 Engineer
            </Link>
            <Link
              to="/admin-login"
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              🛡️ Admin
            </Link>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: ENGINEER LOGIN FORM (Fits 100% in Viewport) ================= */}
      <div className="flex-1 lg:w-7/12 xl:w-1/2 lg:h-full flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-6"
        >
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
            <Link
              to="/login"
              className="py-2 text-center rounded-lg text-slate-600 hover:text-[#1A2A49] hover:bg-white/60 transition"
            >
              👤 Customer
            </Link>
            <Link
              to="/engineer-login"
              className="py-2 text-center rounded-lg bg-[#1A2A49] text-white shadow-sm"
            >
              👨‍🔧 Engineer
            </Link>
            <Link
              to="/admin-login"
              className="py-2 text-center rounded-lg text-slate-600 hover:text-[#1A2A49] hover:bg-white/60 transition"
            >
              🛡️ Admin
            </Link>
          </div>

          <div className="mb-4">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2 py-0.5 rounded mb-1">
              Admin-Issued Partner Credentials
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2A49] leading-tight">
              Engineer Terminal Login
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the Engineer ID (e.g.,{" "}
              <code className="font-bold text-[#1A2A49]">ENG001</code>) and
              Password issued by the Admin Desk.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Engineer ID or Registered Phone
              </label>
              <div className="relative flex items-center">
                <ShieldCheck
                  size={16}
                  className="absolute left-3.5 text-[#F37021]"
                />
                <input
                  type="text"
                  placeholder="ENG001 or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Partner Password (Issued by Admin)
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password (default: eng123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              {loading ? "Authenticating..." : "Sign In to Engineer Terminal"}{" "}
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Compact 2-Column Admin-Registered SQL Engineers Grid */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <KeyRound size={11} className="text-[#F37021]" />{" "}
                Admin-Registered SQL Engineers
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Click to Fill ID
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-0.5">
              {(engineersList || []).map((eng) => (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => fillEngineerCredentials(eng)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition text-left ${
                    identifier.toUpperCase() === eng.id.toUpperCase()
                      ? "border-[#F37021] bg-orange-50/50"
                      : "border-slate-200 hover:border-[#1A2A49]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#1A2A49] text-[#F37021] font-mono text-[10px] font-extrabold">
                        {eng.id}
                      </span>
                      <span className="text-xs font-bold text-[#1A2A49] truncate">
                        {eng.name.split(" ")[0]}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      Pass: <code>{eng.password || "eng123"}</code>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
