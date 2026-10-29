// src/pages/EngineerLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../AppContext";
import {
  ShieldCheck,
  Phone,
  Lock,
  ArrowRight,
  Wrench,
  Database,
  CheckCircle2,
  ChevronLeft,
  Award,
  IndianRupee,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";

export default function EngineerLogin() {
  const { loginEngineer, engineersList, requests } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [identifier, setIdentifier] = useState("ENG001");
  const [otp, setOtp] = useState("123456");
  const [generatedOtp, setGeneratedOtp] = useState("123456");
  const [loading, setLoading] = useState(false);

  const normalizeDigits = (val = "") => String(val).replace(/\D/g, "").slice(-10);

  const findEngineer = (input) => {
    const raw = String(input || "").trim();
    const digits = normalizeDigits(raw);
    return (engineersList || []).find(
      (e) =>
        e.id.toLowerCase() === raw.toLowerCase() ||
        (digits.length === 10 && normalizeDigits(e.phone) === digits)
    );
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const matched = findEngineer(identifier);
    if (!matched) {
      toast.error("Engineer ID or Phone not found. Select a verified engineer below!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const code = "123456";
      setGeneratedOtp(code);
      setOtp(code);
      setStep("otp");
      setLoading(false);
      toast.success(`Partner OTP sent to ${matched.name} (${matched.id})! Demo: ${code}`);
    }, 400);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const matched = findEngineer(identifier);
    if (!matched) {
      toast.error("Engineer not found");
      return;
    }
    if (otp !== generatedOtp && otp !== "123456") {
      toast.error("Invalid OTP. Use 123456");
      return;
    }
    loginEngineer(matched);
    toast.success(`Logged into Engineer Terminal: ${matched.name} (${matched.id})`);
    navigate("/engineer");
  };

  const handleQuickEngineerLogin = (eng) => {
    loginEngineer(eng);
    toast.success(`Switched to ${eng.name} (${eng.id}) Field Terminal!`);
    navigate("/engineer");
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* ================= LEFT SIDE: PLUGGY ENGINEER BRAND & ICON SHOWCASE ================= */}
      <div className="lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-[#121E36] via-[#1A2A49] to-[#223a61] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-[#F37021]">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#F37021]/20 blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl border border-white/10 transition"
          >
            <ChevronLeft size={16} /> Back to Storefront
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 border border-[#F37021]/40 text-[#FF8C42] text-xs font-bold">
            <Wrench size={13} /> Field Partner Terminal
          </span>
        </div>

        {/* Center Pluggy Partner Logo & Highlights */}
        <div className="relative z-10 my-8 lg:my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Database size={13} /> Connected to Live SQL Dispatch
          </div>

          {/* Pluggy Logo Lockup */}
          <div className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/15 shadow-xl">
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
                  PRO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-1">
                Verified Engineer & Technician Dispatch Portal
              </p>
              <p className="text-xs text-emerald-300 font-semibold mt-1">
                • {engineersList?.length || 4} Certified SQL Engineers Online
              </p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
            Receive Pre-Verified Jobs with{" "}
            <span className="text-[#F37021]">Zero Spare Commission.</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed mb-6">
            Every customer request verified by our Admin Desk lands directly in your Engineer Terminal with a locked Toolkit checklist, Start PIN, and Happy PIN payout release.
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
              <p className="text-xs font-bold text-white">Pre-Briefed Faults</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                Exact toolkit checklist ready
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
          <span className="text-blue-200/80 font-medium">Switch Portal Role:</span>
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

      {/* ================= RIGHT SIDE: ENGINEER LOGIN FORM & 1-CLICK SQL SWITCHER ================= */}
      <div className="lg:w-7/12 xl:w-1/2 flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
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
              Engineer Field Portal
            </span>
            <h2 className="text-2xl font-extrabold text-[#1A2A49]">
              Technician Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Login with your Engineer ID (e.g., ENG001) or click a SQL Engineer profile below to view assigned jobs.
            </p>
          </div>

          {step === "credentials" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Engineer ID or Registered Mobile
                </label>
                <div className="relative flex items-center">
                  <ShieldCheck size={17} className="absolute left-3.5 text-[#F37021]" />
                  <input
                    type="text"
                    placeholder="ENG001 or 9811122233"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                {loading ? "Verifying ID..." : "Send Partner OTP"}{" "}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center justify-between">
                <span>Demo Partner OTP Auto-Filled: <strong>123456</strong></span>
                <CheckCircle2 size={15} className="text-emerald-600" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Enter 6-Digit Partner OTP
                </label>
                <div className="relative flex items-center">
                  <Lock size={17} className="absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl tracking-[0.35em] font-extrabold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    maxLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F37021] hover:bg-[#e06318] text-white rounded-xl font-bold text-sm shadow-md transition"
              >
                Verify & Open Field Terminal
              </button>

              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-[#1A2A49]"
              >
                ← Change Engineer ID
              </button>
            </form>
          )}

          {/* 1-CLICK SQL ENGINEER ACCOUNTS */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                ⚡ 1-Click SQL Engineer Terminals
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                Real-Time Jobs
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {(engineersList || []).map((eng) => {
                const activeJobsCount = (requests || []).filter(
                  (r) =>
                    r.engineerId === eng.id &&
                    r.status !== "Completed" &&
                    r.status !== "Cancelled"
                ).length;

                return (
                  <button
                    key={eng.id}
                    type="button"
                    onClick={() => handleQuickEngineerLogin(eng)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#F37021] hover:bg-orange-50/40 transition text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1A2A49] text-white flex flex-col items-center justify-center font-bold text-[10px] shrink-0">
                        <span className="text-[#F37021]">{eng.id}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1A2A49] group-hover:text-[#F37021] truncate">
                          {eng.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {eng.specialty} • {eng.zone}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activeJobsCount > 0
                            ? "bg-orange-100 text-[#F37021]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {activeJobsCount} Active Job{activeJobsCount === 1 ? "" : "s"}
                      </span>
                      <span className="text-[11px] font-bold text-[#1A2A49] group-hover:text-[#F37021] mt-1 flex items-center gap-0.5">
                        Open <ArrowRight size={12} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
