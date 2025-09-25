// src/pages/Signup.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { User, Mail, Lock, Phone } from "lucide-react"
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#1A2A49] mb-6 text-center">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center border rounded-md px-3 py-2">
            <User size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="flex-1 outline-none text-sm"
              required
            />
          </div>

          <div className="flex items-center border rounded-md px-3 py-2">
            <Mail size={18} className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="flex-1 outline-none text-sm"
              required
            />
          </div>

          <div className="flex items-center border rounded-md px-3 py-2">
            <Phone size={18} className="text-gray-400 mr-2" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
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

          <div className="flex items-center border rounded-md px-3 py-2">
            <Lock size={18} className="text-gray-400 mr-2" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="flex-1 outline-none text-sm"
              required
            />
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
