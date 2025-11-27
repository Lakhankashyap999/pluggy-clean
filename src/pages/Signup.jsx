// src/pages/Signup.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { User, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react"
import { useApp } from "../AppContext"

export default function Signup() {
  const navigate = useNavigate()
  const { setUser } = useApp()

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match ❌")
      return
    }

    const existing = localStorage.getItem("pluggy_user")
    if (existing) {
      const existingUser = JSON.parse(existing)
      if (existingUser.email === form.email) {
        toast.error("Account already exists with this email ❌")
        return
      }
    }

    const userData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    }

    localStorage.setItem("pluggy_user", JSON.stringify(userData))
    setUser(userData)
    toast.success("Account created successfully 🎉")
    navigate("/") // ✅ homepage redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#1A2A49] p-3 rounded-full mb-3 shadow-md">
            <User size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A49] tracking-wide text-center">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
               ᴊᴏɪɴ ᴘʟᴜɢɢʏ ᴛᴏ ᴍᴀɴᴀɢᴇ ʏᴏᴜʀ ꜱᴇʀᴠɪᴄᴇꜱ ᴇᴀꜱɪʟʏ
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative flex items-center border rounded-md px-3 py-2">
            <User size={18} className="text-gray-400 absolute left-3" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 text-sm outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="relative flex items-center border rounded-md px-3 py-2">
            <Mail size={18} className="text-gray-400 absolute left-3" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 text-sm outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative flex items-center border rounded-md px-3 py-2">
            <Phone size={18} className="text-gray-400 absolute left-3" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 text-sm outline-none"
              required
            />
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="relative flex items-center border rounded-md px-3 py-2">
            <Lock size={18} className="text-gray-400 absolute left-3" />
            <input
              type={showConfirmPass ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 text-sm outline-none"
              required
            />
            <span
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 cursor-pointer"
            >
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61] transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1A2A49] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
