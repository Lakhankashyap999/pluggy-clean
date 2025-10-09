// src/pages/EngineerLogin.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../AppContext"
import { ShieldCheck, Mail, Lock } from "lucide-react"
import toast from "react-hot-toast"

export default function EngineerLogin() {
  const { loginEngineer } = useApp()
  const [form, setForm] = useState({ email: "", password: "" })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // ✅ Only admin email allowed
    if (form.email === "lakhankashyap795@gmail.com") {
      loginEngineer({ name: "Admin Engineer", email: form.email })
      toast.success("Welcome Engineer 🚀")
      navigate("/engineer")
    } else {
      toast.error("Access Denied: Unauthorized Engineer")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* 🔰 Header Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#1A2A49] p-3 rounded-full mb-3 shadow-md">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A49] tracking-wide">
            Engineer Login
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Only authorized engineer access allowed
          </p>
        </div>

        {/* 🧾 Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"
              placeholder="Engineer Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A2A49] text-white py-3 rounded-lg font-medium hover:bg-[#223a61] transition-all duration-300"
          >
            Log in
          </button>
        </form>

        {/* 🔙 Back to User Login */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-[#1A2A49] hover:underline"
          >
            Back to User Login
          </button>
        </div>

        {/* 🧠 Footer Text */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Pluggy Engineer Portal © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
