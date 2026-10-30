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
  const { authenticateEngineer } = useApp();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Please enter your Partner ID and Secret Password");
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateEngineer(identifier, password);
      setLoading(false);
      if (!res?.ok) {
        toast.error(res?.error || "Invalid Partner ID or Password");
        return;
      }
      toast.success(
        `Welcome to Field Partner App, ${res.engineer.name} (${res.engineer.id})!`
      );
      navigate("/engineer", { replace: true });
    } catch {
      setLoading(false);
      toast.error("Could not sign in. Please try again.");
    }
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
            <ChevronLeft size={14} /> Storefront
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-[#F37021]/40 text-[#FF8C42] text-[10px] font-bold">
            <Wrench size={11} /> Restricted Engineer Portal
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
              Login with Admin-Issued Engineer ID & Secret Password
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
            <ShieldCheck size={12} /> Verified Partner Portal
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
                • ID & Secret Password Issued Strictly by Admin HQ
              </p>
            </div>
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold leading-snug mb-2">
            Your Assigned Jobs, Toolkit &{" "}
            <span className="text-[#F37021]">Instant Wallet Payouts.</span>
          </h1>
          <p className="text-xs xl:text-sm text-blue-100/80 leading-relaxed mb-4">
            Sign in with the Engineer ID and secret password issued by the
            Pluggy Admin Desk to view your assigned customer visits and verify
            Start/Happy PINs.
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

        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs text-blue-200/80">
          <span>🔒 GPS & Shift Telemetry Active on Login</span>
          <span>Verified Partners Only</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: PRIVATE ENGINEER LOGIN FORM ================= */}
      <div className="flex-1 lg:w-7/12 xl:w-1/2 lg:h-full flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-7"
        >
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full mb-2">
              <KeyRound size={11} /> Restricted Field Partner Login
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2A49] leading-tight">
              Engineer Terminal Login
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your Admin-issued Engineer ID (or registered mobile number)
              and secret password.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Engineer ID or Registered Phone
              </label>
              <div className="relative flex items-center">
                <ShieldCheck
                  size={16}
                  className="absolute left-3.5 text-[#F37021]"
                />
                <input
                  type="text"
                  placeholder="Enter Engineer ID (e.g. ENG001)"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Partner Secret Password
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secret password issued by Admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
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
              className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              {loading ? "Authenticating..." : "Sign In to Engineer Terminal"}{" "}
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>📍 Live GPS Logged on Sign-In</span>
            <span>Failed attempts reported to Admin</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
