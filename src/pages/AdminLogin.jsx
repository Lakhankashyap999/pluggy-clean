// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../AppContext";
import { motion } from "framer-motion";
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
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { loginAdmin, requests, paymentTransactions, orderHistoryLogs } =
    useApp();
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
        navigate("/admin", { replace: true });
      } else {
        toast.error(
          res?.error || "Invalid credentials. Use admin@pluggy.in / admin123"
        );
      }
    }, 350);
  };

  const handleInstantAdminLogin = () => {
    const res = loginAdmin({ email: "admin@pluggy.in", password: "admin123" });
    if (res?.ok) {
      toast.success("Welcome to Pluggy 24/7 Executive & SQL Command Center!");
      navigate("/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* ================= MOBILE COMPACT TOP BRAND BAR (< lg) ================= */}
      <div className="lg:hidden bg-gradient-to-r from-[#0F172A] via-[#1A2A49] to-[#1E3258] text-white px-4 py-3.5 border-b-2 border-[#F37021] shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-100 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10"
          >
            <ChevronLeft size={14} /> Home
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
            <Database size={11} /> SQL Master HQ
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md shrink-0 ring-2 ring-[#F37021]">
            <img
              src="/image/logos.png"
              alt="Pluggy Admin Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight leading-none">
              <span className="text-white">Plug</span>
              <span className="text-[#F37021]">gy</span>
              <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-md">
                ADMIN HQ
              </span>
            </div>
            <p className="text-[11px] text-blue-100/85 mt-1">
              Central Dispatch, Engineer ID Access & SQL Control
            </p>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP LEFT SIDE: PLUGGY ADMIN SHOWCASE (lg+) ================= */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 lg:h-full bg-gradient-to-br from-[#0F172A] via-[#1A2A49] to-[#1E3258] text-white p-7 xl:p-10 flex-col justify-between relative overflow-hidden border-r-4 border-[#F37021]">
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#F37021]/15 blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition"
          >
            <ChevronLeft size={15} /> Back to Storefront
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Database size={12} /> SQL Engine v2.4 Online
          </span>
        </div>

        {/* Center Pluggy Admin Logo & Live Metrics */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F37021]/20 border border-[#F37021]/40 text-[#FF8C42] text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldAlert size={12} /> 24/7 Executive & Dispatch Command
          </div>

          {/* Pluggy Logo Lockup */}
          <div className="flex items-center gap-4 mb-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl">
            <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg shrink-0 ring-2 ring-[#F37021]">
              <img
                src="/image/logos.png"
                alt="Pluggy Admin Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-2xl xl:text-3xl font-extrabold text-white">
                  Plug<span className="text-[#F37021]">gy</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-md">
                  ADMIN HQ
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium mt-1">
                Central Dispatch, Engineer ID & SQL Database Control
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-blue-200 font-semibold">
                <span>• {requests?.length || 0} Bookings</span>
                <span>• {paymentTransactions?.length || 0} Payments</span>
                <span>• {orderHistoryLogs?.length || 0} Logs</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold leading-snug mb-2">
            Manage Engineers, Create IDs &{" "}
            <span className="text-[#F37021]">Dispatch Jobs Live.</span>
          </h1>
          <p className="text-xs xl:text-sm text-blue-100/80 leading-relaxed mb-4">
            Create & edit Engineer IDs (`ENG001`–`ENG005+`), reset passwords,
            verify customer faults, lock toolkits, and inspect live SQL tables.
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Users size={17} className="text-[#F37021] mb-1" />
              <p className="text-[11px] font-bold text-white">Engineer IDs</p>
              <p className="text-[10px] text-blue-200/80">
                Create & edit access
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <PhoneCall size={17} className="text-emerald-400 mb-1" />
              <p className="text-[11px] font-bold text-white">Live Dispatch</p>
              <p className="text-[10px] text-blue-200/80">
                Assign jobs & toolkits
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Receipt size={17} className="text-amber-300 mb-1" />
              <p className="text-[11px] font-bold text-white">SQL & Escrow</p>
              <p className="text-[10px] text-blue-200/80">
                Full payment ledger
              </p>
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
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              👨‍🔧 Engineer
            </Link>
            <Link
              to="/admin-login"
              className="px-2.5 py-1 rounded-lg bg-[#F37021] text-white font-bold shadow-sm"
            >
              🛡️ Admin
            </Link>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: ADMIN LOGIN FORM (Fits 100% in Viewport) ================= */}
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
              className="py-2 text-center rounded-lg text-slate-600 hover:text-[#1A2A49] hover:bg-white/60 transition"
            >
              👨‍🔧 Engineer
            </Link>
            <Link
              to="/admin-login"
              className="py-2 text-center rounded-lg bg-[#1A2A49] text-white shadow-sm"
            >
              🛡️ Admin
            </Link>
          </div>

          <div className="mb-4">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2 py-0.5 rounded mb-1">
              Executive Control Desk
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2A49] leading-tight">
              Admin HQ Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign in to manage Engineer IDs, dispatch jobs, and view SQL tables.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Admin Email or ID
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pluggy.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Executive Passcode
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              {loading ? "Authenticating..." : "Open Admin Control Desk"}{" "}
              <ArrowRight size={15} />
            </button>
          </form>

          {/* 1-Click Instant Admin Login */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>⚡ 1-Click Executive Access</span>
              <span className="text-emerald-600">SQL Superuser</span>
            </p>
            <button
              type="button"
              onClick={handleInstantAdminLogin}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#F37021] hover:bg-orange-50/40 transition text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center font-bold text-xs">
                  HQ
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A2A49] group-hover:text-[#F37021]">
                    Chief Dispatch Officer (ADM001)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    admin@pluggy.in • Pass: admin123
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#F37021] flex items-center gap-1">
                Enter <ArrowRight size={13} />
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
