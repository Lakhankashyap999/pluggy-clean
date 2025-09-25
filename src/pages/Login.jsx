// src/pages/Login.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { Mail, Lock } from "lucide-react"
import { useApp } from "../AppContext"

export default function Login() {
  const navigate = useNavigate()
  const { loginUser, setUser } = useApp()
  const [form, setForm] = useState({ email: "", password: "" })

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [newPass, setNewPass] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ✅ Normal login
  const handleSubmit = (e) => {
    e.preventDefault()
    const stored = localStorage.getItem("pluggy_user")
    if (!stored) {
      toast.error("No account found. Please sign up first.")
      return
    }
    const userData = JSON.parse(stored)
    if (form.email === userData.email && form.password === userData.password) {
      loginUser(userData)
      toast.success(`Welcome back, ${userData.name}! 🎉`)
      navigate("/") // ✅ homepage redirect
    } else {
      toast.error("Invalid credentials ❌")
    }
  }

  // ✅ Forgot Password Flow
  const sendOtp = () => {
    if (!form.email) {
      toast.error("Enter your email first ❌")
      return
    }
    const stored = localStorage.getItem("pluggy_user")
    if (!stored) {
      toast.error("No account found with this email ❌")
      return
    }
    const userData = JSON.parse(stored)
    if (userData.email !== form.email) {
      toast.error("Email not registered ❌")
      return
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(code)
    setOtpSent(true)
    toast.success(`OTP sent (demo: ${code})`)
  }

  const resetPassword = () => {
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP ❌")
      return
    }
    const stored = JSON.parse(localStorage.getItem("pluggy_user") || "null")
    if (!stored) {
      toast.error("No account found ❌")
      return
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        {!showForgot ? (
          <>
            <h2 className="text-2xl font-bold text-[#1A2A49] mb-6 text-center">
              Log in to Pluggy
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center border rounded-md px-3 py-2">
                <Mail size={18} className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm"
                  required
                />
              </div>
              <div className="flex items-center border rounded-md px-3 py-2">
                <Lock size={18} className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61] transition"
              >
                Log in
              </button>
            </form>

            {/* Forgot password */}
            <p
              onClick={() => setShowForgot(true)}
              className="mt-3 text-sm text-[#1A2A49] text-center hover:underline cursor-pointer"
            >
              Forgot your password?
            </p>

            {/* Signup */}
            <p className="mt-4 text-sm text-gray-600 text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#1A2A49] font-medium hover:underline">
                Create new account
              </Link>
            </p>

            {/* Engineer login link */}
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
