// src/pages/Login.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useApp } from "../AppContext"

export default function Login() {
  const navigate = useNavigate()
  const { loginUser, setUser } = useApp()
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [newPass, setNewPass] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // ✅ Normal login
  const handleSubmit = (e) => {
    e.preventDefault()
    const stored = localStorage.getItem("pluggy_user")
    if (!stored) return toast.error("No account found. Please sign up first.")
    const userData = JSON.parse(stored)
    if (form.email === userData.email && form.password === userData.password) {
      loginUser(userData)
      toast.success(`Welcome back, ${userData.name}! 🎉`)
      navigate("/")
    } else {
      toast.error("Invalid credentials ❌")
    }
  }

  // ✅ Forgot Password Flow
  const sendOtp = () => {
    if (!form.email) return toast.error("Enter your email first ❌")
    const stored = localStorage.getItem("pluggy_user")
    if (!stored) return toast.error("No account found with this email ❌")
    const userData = JSON.parse(stored)
    if (userData.email !== form.email) return toast.error("Email not registered ❌")
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(code)
    setOtpSent(true)
    toast.success(`OTP sent (demo: ${code})`)
  }

  const resetPassword = () => {
    if (otp !== generatedOtp) return toast.error("Invalid OTP ❌")
    const stored = JSON.parse(localStorage.getItem("pluggy_user") || "null")
    if (!stored) return toast.error("No account found ❌")
    const updated = { ...stored, password: newPass }
    localStorage.setItem("pluggy_user", JSON.stringify(updated))
    setUser(updated)
    toast.success("Password updated ✅ Now login with new password")
    setShowForgot(false)
    setOtpSent(false)
    setOtp("")
    setNewPass("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {!showForgot ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-[#1A2A49] p-3 rounded-full mb-3 shadow-md">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A2A49] tracking-wide text-center">
                Log in to Pluggy
              </h2>
              <p className="text-gray-500 text-sm mt-1 text-center">
                Enter your credentials to continue
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative flex items-center border rounded-md px-3 py-2">
                <Mail size={18} className="text-gray-400 absolute left-3" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-sm outline-none"
                  required
                />
              </div>

              <div className="relative flex items-center border rounded-md px-3 py-2">
                <Lock size={18} className="text-gray-400 absolute left-3" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 text-sm outline-none"
                  required
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 cursor-pointer"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61] transition"
              >
                Log in
              </button>
            </form>

            <p
              onClick={() => setShowForgot(true)}
              className="mt-3 text-sm text-[#1A2A49] text-center hover:underline cursor-pointer"
            >
              Forgot your password?
            </p>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#1A2A49] font-medium hover:underline">
                Create new account
              </Link>
            </p>

            <p className="mt-2 text-sm text-gray-600 text-center">
              Are you an engineer?{" "}
              <Link to="/engineer-login" className="text-[#1A2A49] font-medium hover:underline">
                Login here
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-[#1A2A49] mb-6 text-center">
              Reset Password
            </h2>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full border rounded-lg px-4 py-3 text-sm mb-3"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <button
                  onClick={sendOtp}
                  className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61] transition"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border rounded-lg px-4 py-3 text-sm mb-3"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full border rounded-lg px-4 py-3 text-sm mb-3"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <button
                  onClick={resetPassword}
                  className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61] transition"
                >
                  Reset Password
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
