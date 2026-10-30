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
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { loginAdmin, requests, paymentTransactions, orderHistoryLogs } =
    useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter Admin ID/Email and Master Passcode");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = loginAdmin({ email, password });
      setLoading(false);
      if (res?.ok) {
        toast.success(`Logged into Admin Control Desk: ${res.admin.name}`);
        navigate("/admin", { replace: true });
      } else {
        toast.error(
          res?.error ||
            "Access Denied: Invalid Admin ID/Email or Master Passcode!"
        );
      }
    }, 300);
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
            <ChevronLeft size={14} /> Storefront
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-200 text-[10px] font-bold">
            <Lock size={11} /> Restricted Admin HQ
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
              Private Chief Dispatch & SQL Command Terminal
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-200 text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldAlert size={12} /> Restricted Executive Command Desk
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
            Private Owner & Chief Dispatch portal. Create & edit Engineer IDs,
            reset passwords, track live engineer GPS & Anti-Bypass alerts, and
            manage live customer bookings.
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

        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs text-blue-200/80">
          <span>🔒 Master Access Protected</span>
          <span>Authorized Personnel Only</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: PRIVATE ADMIN LOGIN FORM ================= */}
      <div className="flex-1 lg:w-7/12 xl:w-1/2 lg:h-full flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-7"
        >
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full mb-2">
              <KeyRound size={11} /> Private Owner & Admin Access
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2A49] leading-tight">
              Admin HQ Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your Master Admin ID or Email and Secret Passcode to unlock
              the Control Desk.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Admin ID or Email
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Admin ID or Email"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Master Executive Passcode
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Master Passcode"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
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
              {loading ? "Authenticating..." : "Unlock Admin Control Desk"}{" "}
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>🛡️ Protected by SQL Master Auth</span>
            <span>Unauthorized login prohibited</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
