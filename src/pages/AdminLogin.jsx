// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../AppContext";
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Database,
  ChevronLeft,
  PhoneCall,
  Users,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { loginAdmin, requests, paymentTransactions, orderHistoryLogs } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@pluggy.in");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = loginAdmin({ email, password });
      setLoading(false);
      if (res?.ok) {
        toast.success(`Logged into Admin Control Desk: ${res.admin.name}`);
        navigate("/admin");
      } else {
        toast.error(res?.error || "Invalid credentials. Use admin@pluggy.in / admin123");
      }
    }, 350);
  };

  const handleInstantAdminLogin = () => {
    const res = loginAdmin({ email: "admin@pluggy.in", password: "admin123" });
    if (res?.ok) {
      toast.success("Welcome to Pluggy 24/7 Executive & SQL Command Center!");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* ================= LEFT SIDE: PLUGGY ADMIN & SQL COMMAND SHOWCASE ================= */}
      <div className="lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-[#0F172A] via-[#1A2A49] to-[#1E3258] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-[#F37021]">
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#F37021]/15 blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl border border-white/10 transition"
          >
            <ChevronLeft size={16} /> Back to Storefront
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Database size={13} /> SQL Engine v2.4 Online
          </span>
        </div>

        {/* Center Pluggy Admin Logo & Live Metrics */}
        <div className="relative z-10 my-8 lg:my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F37021]/20 border border-[#F37021]/40 text-[#FF8C42] text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldAlert size={13} /> 24/7 Executive & Dispatch Command
          </div>

          {/* Pluggy Logo Lockup */}
          <div className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/15 shadow-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center p-2.5 shadow-lg shrink-0 ring-2 ring-[#F37021]">
              <img
                src="/image/logos.png"
                alt="Pluggy Admin Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  Plug<span className="text-[#F37021]">gy</span>
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-md">
                  ADMIN HQ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-1">
                Central Dispatch, Escrow Payment & SQL Database Control
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-blue-200 font-semibold">
                <span>• {requests?.length || 0} Bookings</span>
                <span>• {paymentTransactions?.length || 0} Payments</span>
                <span>• {orderHistoryLogs?.length || 0} Audit Logs</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
            Verify Customer Faults &{" "}
            <span className="text-[#F37021]">Dispatch Engineers Live.</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed mb-6">
            Verify new customer service requests, lock the required engineer toolkit, assign certified technicians (`ENG001`–`ENG004`), and inspect live SQL tables & payment gateway ledgers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <PhoneCall size={20} className="text-[#F37021] mb-1.5" />
              <p className="text-xs font-bold text-white">Executive Call Desk</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                Confirm fault & lock toolkit
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <Users size={20} className="text-emerald-400 mb-1.5" />
              <p className="text-xs font-bold text-white">Smart Dispatch</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                Assign to ENG001–ENG004
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <Receipt size={20} className="text-amber-300 mb-1.5" />
              <p className="text-xs font-bold text-white">SQL & Escrow Ledger</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                Full payment & order history
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
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              👨‍🔧 Engineer Login
            </Link>
            <Link
              to="/admin-login"
              className="px-3 py-1.5 rounded-xl bg-[#F37021] text-white font-bold shadow-sm"
            >
              🛡️ Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: ADMIN LOGIN FORM ================= */}
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
              className="py-2.5 text-center rounded-xl text-slate-600 hover:text-[#1A2A49] hover:bg-white/60 transition"
            >
              👨‍🔧 Engineer
            </Link>
            <Link
              to="/admin-login"
              className="py-2.5 text-center rounded-xl bg-[#1A2A49] text-white shadow-sm"
            >
              🛡️ Admin
            </Link>
          </div>

          <div className="mb-6">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2.5 py-1 rounded-md mb-1.5">
              Executive Control Desk
            </span>
            <h2 className="text-2xl font-extrabold text-[#1A2A49]">
              Admin HQ Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in to verify bookings, dispatch engineers, and manage the SQL database.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Admin Email or ID
              </label>
              <div className="relative flex items-center">
                <Mail size={17} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pluggy.in"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Executive Passcode
              </label>
              <div className="relative flex items-center">
                <Lock size={17} className="absolute left-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              {loading ? "Authenticating..." : "Open Admin Control Desk"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* 1-Click Instant Admin Login */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
              <span>⚡ 1-Click Executive Access</span>
              <span className="text-emerald-600">SQL Superuser</span>
            </p>
            <button
              type="button"
              onClick={handleInstantAdminLogin}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-[#F37021] hover:bg-orange-50/40 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center font-bold text-xs">
                  HQ
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A2A49] group-hover:text-[#F37021]">
                    Vikramaditya Rao (ADM001)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Chief Dispatch & Verification Officer
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#F37021] flex items-center gap-1">
                Enter <ArrowRight size={13} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
