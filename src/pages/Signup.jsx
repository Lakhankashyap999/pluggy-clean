// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ChevronLeft,
  Database,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../AppContext";

export default function Signup() {
  const navigate = useNavigate();
  const { registerUser } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const cleanPhone = String(form.phone).replace(/\D/g, "").slice(-10);
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const created = registerUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: `+91${cleanPhone}`,
      password: form.password,
    });

    toast.success(`Account created in SQL Database! Welcome, ${created.name}`);
    navigate("/");
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* ================= MOBILE COMPACT TOP BRAND BAR (< lg) ================= */}
      <div className="lg:hidden bg-gradient-to-r from-[#1A2A49] via-[#1E3258] to-[#121E36] text-white px-4 py-3.5 border-b-2 border-[#F37021] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-100 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10"
          >
            <ChevronLeft size={14} /> Back to Login
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
            <Database size={11} /> SQL Customer Registry
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md shrink-0">
            <img
              src="/image/logos.png"
              alt="Pluggy Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-lg font-extrabold tracking-tight leading-none">
            <span className="text-white">Plug</span>
            <span className="text-[#F37021]">gy</span>
            <span className="text-xs font-medium text-blue-100 block mt-0.5">
              Create Your Verified Homeowner Account
            </span>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP LEFT PANEL: PLUGGY BRAND SHOWCASE (lg+) ================= */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 lg:h-full bg-gradient-to-br from-[#1A2A49] via-[#1E3258] to-[#121E36] text-white p-7 xl:p-10 flex-col justify-between relative overflow-hidden border-r-4 border-[#F37021]">
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition"
          >
            <ChevronLeft size={15} /> Back to Login
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Database size={12} /> SQL Customer Registry
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-lg">
          <div className="flex items-center gap-4 mb-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
            <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg shrink-0 ring-2 ring-[#F37021]">
              <img
                src="/image/logos.png"
                alt="Pluggy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-2xl xl:text-3xl font-extrabold leading-none">
                <span className="text-white">Plug</span>
                <span className="text-[#F37021]">gy</span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium mt-1">
                Create Your Verified Homeowner Account
              </p>
            </div>
          </div>

          <h1 className="text-2xl xl:text-3xl font-extrabold leading-snug mb-2">
            One Account for All Your Home Repairs &{" "}
            <span className="text-[#F37021]">30-Day Warranties.</span>
          </h1>
          <p className="text-xs xl:text-sm text-blue-100/80 leading-relaxed">
            Your profile is stored in the Pluggy SQL database so your service
            requests, payment receipts, and warranty certificates stay synced.
          </p>
        </div>

        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#F37021]" /> 100% Data
            Privacy
          </span>
          <Link
            to="/engineer-login"
            className="text-[#F37021] font-bold hover:underline"
          >
            Engineer Login →
          </Link>
        </div>
      </div>

      {/* ================= RIGHT PANEL: SIGNUP FORM (Fits 100% in Viewport) ================= */}
      <div className="flex-1 lg:w-7/12 xl:w-1/2 lg:h-full flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-6">
          <div className="mb-4">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2 py-0.5 rounded mb-1">
              New Customer Registration
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2A49] leading-tight">
              Create Pluggy Account
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Register to raise real-time service requests and track engineers.
            </p>
          </div>

          <form className="space-y-2.5" onSubmit={handleSubmit}>
            <div className="relative flex items-center">
              <User size={16} className="text-slate-400 absolute left-3.5" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                required
              />
            </div>

            <div className="relative flex items-center">
              <Mail size={16} className="text-slate-400 absolute left-3.5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                required
              />
            </div>

            <div className="relative flex items-center">
              <Phone size={16} className="text-slate-400 absolute left-3.5" />
              <input
                type="tel"
                name="phone"
                placeholder="10-Digit Mobile Number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative flex items-center">
                <Lock size={16} className="text-slate-400 absolute left-3.5" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="relative flex items-center">
                <Lock size={16} className="text-slate-400 absolute left-3.5" />
                <input
                  type={showPass ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition mt-1"
            >
              Create Account <ArrowRight size={15} />
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-500 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#F37021] font-bold hover:underline"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
