import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { Mail, Lock } from "lucide-react"
import { useApp } from "../AppContext"

export default function Login() {
  const navigate = useNavigate()
  const { loginUser } = useApp()
  const [form, setForm] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const stored = localStorage.getItem("pluggy_user")
    if (!stored) {
      toast.error("No account found. Please sign up first.")
      return
    }

    const userData = JSON.parse(stored)

    if (form.email === userData.email && form.password === userData.password) {
      loginUser(userData) // ✅ context me user set
      toast.success("Logged in successfully 🎉")
      navigate("/")
    } else {
      toast.error("Invalid credentials ❌")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* ✅ Desktop / Laptop View */}
      <div className="hidden md:flex items-center justify-center w-full">
        <div className="bg-white shadow-lg rounded-xl p-8 w-[350px]">
          <h2 className="text-2xl font-bold text-[#1A2A49] mb-6">Log in</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-[#1A2A49]"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-[#1A2A49]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61]"
            >
              Log in
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#1A2A49] font-medium hover:underline">
              Create new account
            </Link>
          </p>
        </div>
      </div>

      {/* ✅ Mobile View */}
      <div className="flex md:hidden w-full h-screen bg-gradient-to-br from-[#1A2A49] to-[#223a61] relative p-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 w-full flex flex-col justify-center">
          <h2 className="text-2xl font-extrabold text-center text-[#1A2A49] mb-6">
            Welcome Back 👋
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center border rounded-full px-3 py-2">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                className="flex-1 outline-none text-sm"
                required
              />
            </div>

            <div className="flex items-center border rounded-full px-3 py-2">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                className="flex-1 outline-none text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#1A2A49] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
