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

  const normalizeDigits = (val = "") =>
    String(val).replace(/\D/g, "").slice(-10);

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
    }, 400);
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
    }, 350);
  };

  const handleEmailPasswordLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    const existingUser = (usersList || []).find(
      (u) =>
        String(u.email || "").toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      loginUser(existingUser);
      toast.success(`Welcome back, ${existingUser.name}!`);
      navigate(redirectTo, { replace: true });
    } else {
      const created = registerUser({
        name:
          email.split("@")[0].replace(/[^a-zA-Z ]/g, " ") ||
          "Pluggy Customer",
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
    toast.success(`Logged in as ${demoUser.name}`);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* ================= MOBILE COMPACT TOP BRAND BAR (< lg) ================= */}
      <div className="lg:hidden bg-gradient-to-r from-[#1A2A49] via-[#1E3258] to-[#121E36] text-white px-4 py-3.5 border-b-2 border-[#F37021] shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-100 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10"
          >
            <ChevronLeft size={14} /> Home
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
            <Database size={11} /> SQL Live Sync
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md shrink-0">
            <img
              src="/image/logos.png"
              alt="Pluggy Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight leading-none">
              <span className="text-white">Plug</span>
              <span className="text-[#F37021]">gy</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-[#F37021]/20 text-[#FF8C42] px-2 py-0.5 rounded-md border border-[#F37021]/30">
                Customer Portal
              </span>
            </div>
            <p className="text-[11px] text-blue-100/85 mt-1">
              60-Min Verified Repairs • Dual-PIN Escrow Protection
            </p>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP LEFT SIDE: PLUGGY ICON & BRAND SHOWCASE (lg+) ================= */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 lg:h-full bg-gradient-to-br from-[#1A2A49] via-[#1E3258] to-[#121E36] text-white p-7 xl:p-10 flex-col justify-between relative overflow-hidden border-r-4 border-[#F37021]">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#F37021]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition"
          >
            <ChevronLeft size={15} /> Back to Home
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Database size={12} /> SQL Live Sync Active
          </div>
        </div>

        {/* Center Pluggy Brand Card & Highlights */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F37021]/20 border border-[#F37021]/40 text-[#FF8C42] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> Customer Service Portal
          </div>

          {/* Prominent Pluggy Icon + Brand Lockup (No gap between Plug and gy) */}
          <div className="flex items-center gap-4 mb-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
            <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg shrink-0 ring-2 ring-[#F37021]">
              <img
                src="/image/logos.png"
                alt="Pluggy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-none">
                <span className="text-white">Plug</span>
                <span className="text-[#F37021]">gy</span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium mt-1">
                60-Minute Verified Home Electrical & Appliance Care
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-amber-300 font-semibold">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>4.9/5 Rating</span>
                <span className="text-white/30">•</span>
                <span className="text-blue-200">
                  {requests?.length || 1}+ Live SQL Orders
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold leading-snug tracking-tight mb-2">
            Book, Track & Approve Repairs with{" "}
            <span className="text-[#F37021]">Dual-PIN Security.</span>
          </h1>
          <p className="text-xs xl:text-sm text-blue-100/80 leading-relaxed mb-4">
            Every request you raise here immediately flows to our 24/7 Executive
            Desk and Assigned Engineer Portal in real time.
          </p>

          {/* 3 Compact Feature Pills */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <ShieldCheck size={17} className="text-[#F37021] mb-1" />
              <p className="text-[11px] font-bold text-white">Dual-PIN Safe</p>
              <p className="text-[10px] text-blue-200/80">
                Start & Happy PINs
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <CheckCircle2 size={17} className="text-emerald-400 mb-1" />
              <p className="text-[11px] font-bold text-white">100% Escrow</p>
              <p className="text-[10px] text-blue-200/80">
                Released post-repair
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Wrench size={17} className="text-amber-300 mb-1" />
              <p className="text-[11px] font-bold text-white">MRP Spares</p>
              <p className="text-[10px] text-blue-200/80">
                0% part commission
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs text-blue-200/80">
          <span>🔒 100% Verified Doorstep Service</span>
          <span>Dual-PIN Escrow Protected</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: CUSTOMER LOGIN FORM (Fits 100% in Viewport) ================= */}
      <div className="flex-1 lg:w-7/12 xl:w-1/2 lg:h-full flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-6"
        >
          <div className="mb-4">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2 py-0.5 rounded mb-1">
              Step into Pluggy
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2A49] leading-tight">
              {step === "input" && "Customer Sign In"}
              {step === "otp" && "Verify Mobile OTP"}
              {step === "profile" && "Complete Your Profile"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === "input" &&
                "Sign in to add services to cart, pay securely & track OTPs."}
              {step === "otp" &&
                `Enter the 6-digit OTP sent to +91 ${normalizeDigits(phone)}`}
              {step === "profile" &&
                "Almost done! Tell us your name for service invoices."}
            </p>
          </div>

          {/* Login Mode Toggle (Phone OTP vs Email/Password) */}
          {step === "input" && (
            <>
              <div className="flex border-b border-slate-200 mb-3.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLoginMode("phone")}
                  className={`flex-1 pb-2 border-b-2 transition ${
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
                  className={`flex-1 pb-2 border-b-2 transition ${
                    loginMode === "email"
                      ? "border-[#F37021] text-[#1A2A49]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  ✉️ Email & Password
                </button>
              </div>

              {loginMode === "phone" ? (
                <form onSubmit={sendOtp} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                      Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <Phone
                        size={16}
                        className="absolute left-3.5 text-slate-400"
                      />
                      <span className="absolute left-9 text-xs font-bold text-slate-600 border-r border-slate-200 pr-2">
                        +91
                      </span>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-18 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                        style={{ paddingLeft: "4.5rem" }}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                  >
                    {loading ? "Sending OTP..." : "Get Instant OTP"}{" "}
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailPasswordLogin} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail
                        size={16}
                        className="absolute left-3.5 text-slate-400"
                      />
                      <input
                        type="email"
                        placeholder="lakhan@pluggy.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock
                        size={16}
                        className="absolute left-3.5 text-slate-400"
                      />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                  >
                    Sign In with Email <ArrowRight size={15} />
                  </button>
                </form>
              )}

              {/* Compact 2-Column 1-Click SQL Customer Accounts */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>⚡ 1-Click Demo Customer Login</span>
                  <span className="text-emerald-600">Instant Access</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(usersList || []).slice(0, 2).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickDemoCustomer(u)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-[#F37021] hover:bg-orange-50/40 transition text-left group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#1A2A49] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {u.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1A2A49] group-hover:text-[#F37021] truncate">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {u.phone}
                          </p>
                        </div>
                      </div>
                      <ArrowRight
                        size={13}
                        className="text-[#F37021] shrink-0 ml-1"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-slate-500 mt-3.5">
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
            <form onSubmit={verifyOtp} className="space-y-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center justify-between">
                <span>
                  Demo OTP Auto-Filled:{" "}
                  <strong>{generatedOtp || "123456"}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtp(generatedOtp || "123456")}
                  className="text-emerald-700 underline font-bold"
                >
                  Use 123456
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl tracking-[0.35em] font-extrabold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#F37021] hover:bg-[#e06318] text-white rounded-xl font-bold text-sm shadow-md transition"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <button
                type="button"
                onClick={() => setStep("input")}
                className="w-full py-1.5 text-xs font-bold text-slate-500 hover:text-[#1A2A49]"
              >
                ← Change Mobile Number
              </button>
            </form>
          )}

          {/* Profile Completion Step */}
          {step === "profile" && (
            <form onSubmit={completeProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm shadow-md transition"
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
