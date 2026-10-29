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
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row font-inter">
      {/* LEFT PANEL: PLUGGY BRAND SHOWCASE */}
      <div className="lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-[#1A2A49] via-[#1E3258] to-[#121E36] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-100 hover:text-white bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition"
          >
            <ChevronLeft size={16} /> Back to Login
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Database size={13} /> SQL Customer Registry
          </span>
        </div>

        <div className="relative z-10 my-8 lg:my-auto max-w-lg">
          <div className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/10 shadow-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center p-2.5 shadow-lg shrink-0">
              <img
                src="/image/logos.png"
                alt="Pluggy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-3xl font-extrabold text-white">Plug</span>
                <span className="text-3xl font-extrabold text-[#F37021]">gy</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-0.5">
                Create Your Verified Homeowner Account
              </p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
            One Account for All Your Home Repairs &{" "}
            <span className="text-[#F37021]">30-Day Warranties.</span>
          </h1>
          <p className="text-sm text-blue-100/80 leading-relaxed">
            Your profile is stored in the Pluggy SQL database so your service requests, payment receipts, and warranty certificates stay synced across all portals.
          </p>
        </div>

        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-[#F37021]" /> 100% Data Privacy
          </span>
          <Link to="/engineer-login" className="text-[#F37021] font-bold hover:underline">
            Are you an Engineer? Login →
          </Link>
        </div>
      </div>

      {/* RIGHT PANEL: SIGNUP FORM */}
      <div className="lg:w-7/12 xl:w-1/2 flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          <div className="mb-6">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2.5 py-1 rounded-md mb-1.5">
              New Customer Registration
            </span>
            <h2 className="text-2xl font-extrabold text-[#1A2A49]">
              Create Pluggy Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Register to raise real-time service requests and track engineers.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative flex items-center">
              <User size={17} className="text-slate-400 absolute left-3.5" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                required
              />
            </div>

            <div className="relative flex items-center">
              <Mail size={17} className="text-slate-400 absolute left-3.5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                required
              />
            </div>

            <div className="relative flex items-center">
              <Phone size={17} className="text-slate-400 absolute left-3.5" />
              <input
                type="tel"
                name="phone"
                placeholder="10-Digit Mobile Number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                required
              />
            </div>

            <div className="relative flex items-center">
              <Lock size={17} className="text-slate-400 absolute left-3.5" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <div className="relative flex items-center">
              <Lock size={17} className="text-slate-400 absolute left-3.5" />
              <input
                type={showPass ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              Create Account <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-5 text-xs text-slate-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[#F37021] font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
