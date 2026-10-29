// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useApp } from "../AppContext";
import { motion } from "framer-motion";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Star,
  Lock,
  Mail,
  UserCheck,
  Wrench,
  Database,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const { loginUser, registerUser, usersList, requests } = useApp();

  const [loginMode, setLoginMode] = useState("phone"); // "phone" | "email"
  const [step, setStep] = useState("input"); // "input" | "otp" | "profile"
  const [phone, setPhone] = useState("9876543210");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [email, setEmail] = useState("lakhan@pluggy.in");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "" });

  const normalizeDigits = (val = "") => String(val).replace(/\D/g, "").slice(-10);

  const sendOtp = (e) => {
    if (e) e.preventDefault();
    const cleanPhone = normalizeDigits(phone);
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const code = "123456";
      setGeneratedOtp(code);
      setOtp(code);
      setStep("otp");
      setLoading(false);
      toast.success(`OTP Sent! Auto-filled Demo OTP: ${code}`);
    }, 500);
  };

  const verifyOtp = (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Enter valid OTP");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (otp === generatedOtp || otp === "123456") {
        const cleanPhone = normalizeDigits(phone);
        const existingUser = (usersList || []).find(
          (u) => normalizeDigits(u.phone) === cleanPhone
        );

        if (existingUser) {
          loginUser(existingUser);
          toast.success(`Welcome back, ${existingUser.name}!`);
          navigate(redirectTo, { replace: true });
        } else {
          setStep("profile");
        }
      } else {
        toast.error("Invalid OTP. Use 123456 for demo.");
      }
      setLoading(false);
    }, 400);
  };

  const handleEmailPasswordLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    const existingUser = (usersList || []).find(
      (u) => String(u.email || "").toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      loginUser(existingUser);
      toast.success(`Welcome back, ${existingUser.name}!`);
      navigate(redirectTo, { replace: true });
    } else {
      const created = registerUser({
        name: email.split("@")[0].replace(/[^a-zA-Z ]/g, " ") || "Pluggy Customer",
        email: email.trim(),
        phone: "+919876543210",
        password,
      });
      toast.success(`Logged in as ${created.name}!`);
      navigate(redirectTo, { replace: true });
    }
  };

  const completeProfile = (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    const cleanPhone = normalizeDigits(phone);
    const created = registerUser({
      name: profile.name.trim(),
      email: profile.email.trim() || `${cleanPhone}@pluggy.in`,
      phone: `+91${cleanPhone}`,
    });

    toast.success(`Welcome to Pluggy, ${created.name}!`);
    navigate(redirectTo, { replace: true });
  };

  const handleQuickDemoCustomer = (demoUser) => {
    loginUser(demoUser);
    toast.success(`Logged in as ${demoUser.name} (Customer Portal)`);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* ================= LEFT SIDE: PLUGGY ICON & BRAND SHOWCASE ================= */}
      <div className="lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-[#1A2A49] via-[#1E3258] to-[#121E36] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#F37021]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        {/* Top navigation + Portal Role Switcher */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl border border-white/10 transition"
          >
            <ChevronLeft size={16} /> Back to Home
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Database size={13} /> SQL Live Sync Active
          </div>
        </div>

        {/* Center Pluggy Icon & Customer Value Proposition */}
        <div className="relative z-10 my-8 lg:my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F37021]/20 border border-[#F37021]/40 text-[#FF8C42] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={13} /> Customer Service Portal
          </div>

          {/* Prominent Pluggy Icon + Brand Lockup */}
          <div className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/10 shadow-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center p-2.5 shadow-lg shrink-0">
              <img
                src="/image/logos.png"
                alt="Pluggy Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Plug
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F37021]">
                  gy
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-0.5">
                60-Minute Verified Home Electrical & Appliance Care
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-300 font-semibold">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>4.9/5 Rating</span>
                <span className="text-white/30">•</span>
                <span className="text-blue-200">{requests?.length || 2}+ Active SQL Orders</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight mb-3">
            Book, Track & Approve Repairs with{" "}
            <span className="text-[#F37021]">Dual-PIN Security.</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed mb-6">
            Every request you raise here immediately flows to our 24/7 Executive Desk and Assigned Engineer Portal in real time.
          </p>

          {/* 3 Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <ShieldCheck size={20} className="text-[#F37021] mb-1.5" />
              <p className="text-xs font-bold text-white">Dual-PIN Protection</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                Start PIN & Happy PIN control
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <CheckCircle2 size={20} className="text-emerald-400 mb-1.5" />
              <p className="text-xs font-bold text-white">100% Escrow Safe</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                Money released after repair
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <Wrench size={20} className="text-amber-300 mb-1.5" />
              <p className="text-xs font-bold text-white">MRP Spare Parts</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">
                0% commission on parts
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Role Switcher Bar */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-blue-200/80 font-medium">Switch Portal Role:</span>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl bg-[#F37021] text-white font-bold shadow-sm"
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
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              🛡️ Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: CUSTOMER LOGIN FORM ================= */}
      <div className="lg:w-7/12 xl:w-1/2 flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8"
        >
          {/* Role Tabs at Top of Form */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
            <Link
              to="/login"
              className="py-2.5 text-center rounded-xl bg-[#1A2A49] text-white shadow-sm"
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
              className="py-2.5 text-center rounded-xl text-slate-600 hover:text-[#1A2A49] hover:bg-white/60 transition"
            >
              🛡️ Admin
            </Link>
          </div>

          <div className="mb-6">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2.5 py-1 rounded-md mb-1.5">
              Step into Pluggy
            </span>
            <h2 className="text-2xl font-extrabold text-[#1A2A49]">
              {step === "input" && "Customer Sign In"}
              {step === "otp" && "Verify Mobile OTP"}
              {step === "profile" && "Complete Your Profile"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {step === "input" &&
                "Sign in to book services, view live OTPs, and track SQL order history."}
              {step === "otp" && `Enter the 6-digit OTP sent to +91 ${normalizeDigits(phone)}`}
              {step === "profile" && "Almost done! Tell us your name for service invoices."}
            </p>
          </div>

          {/* Login Mode Toggle (Phone OTP vs Email/Password) */}
          {step === "input" && (
            <>
              <div className="flex border-b border-slate-200 mb-5 text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setLoginMode("phone")}
                  className={`flex-1 pb-2.5 border-b-2 transition ${
                    loginMode === "phone"
                      ? "border-[#F37021] text-[#1A2A49]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  📱 Mobile + OTP
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode("email")}
                  className={`flex-1 pb-2.5 border-b-2 transition ${
                    loginMode === "email"
                      ? "border-[#F37021] text-[#1A2A49]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  ✉️ Email & Password
                </button>
              </div>

              {loginMode === "phone" ? (
                <form onSubmit={sendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                      Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <Phone size={17} className="absolute left-3.5 text-slate-400" />
                      <span className="absolute left-10 text-sm font-bold text-slate-600 border-r border-slate-200 pr-2.5">
                        +91
                      </span>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-20 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99]"
                  >
                    {loading ? "Sending OTP..." : "Get Instant OTP"}{" "}
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={17} className="absolute left-3.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="lakhan@pluggy.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock size={17} className="absolute left-3.5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99]"
                  >
                    Sign In with Email <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* 1-Click Instant SQL Demo Customer Login */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                  <span>⚡ 1-Click SQL Customer Accounts</span>
                  <span className="text-emerald-600">Instant Demo</span>
                </p>
                <div className="space-y-2">
                  {(usersList || []).slice(0, 2).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickDemoCustomer(u)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#F37021] hover:bg-orange-50/40 transition text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center font-bold text-xs">
                          {u.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1A2A49] group-hover:text-[#F37021]">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {u.phone} • {u.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#F37021] flex items-center gap-1">
                        Login <ArrowRight size={13} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-slate-500 mt-5">
                New to Pluggy?{" "}
                <Link
                  to="/signup"
                  className="text-[#F37021] font-bold hover:underline"
                >
                  Create Customer Account
                </Link>
              </p>
            </>
          )}

          {/* OTP Verification Step */}
          {step === "otp" && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center justify-between">
                <span>Demo OTP Auto-Filled: <strong>{generatedOtp || "123456"}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtp(generatedOtp || "123456")}
                  className="text-emerald-700 underline font-bold"
                >
                  Use 123456
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl tracking-[0.35em] font-extrabold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#F37021] hover:bg-[#e06318] text-white rounded-xl font-bold text-sm shadow-md transition"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <button
                type="button"
                onClick={() => setStep("input")}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-[#1A2A49]"
              >
                ← Change Mobile Number
              </button>
            </form>
          )}

          {/* Profile Completion Step */}
          {step === "profile" && (
            <form onSubmit={completeProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm shadow-md transition"
              >
                Save to SQL & Continue
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
