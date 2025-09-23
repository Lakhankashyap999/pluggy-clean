import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useApp } from "../AppContext"

export default function Signup() {
  const navigate = useNavigate()
  const { loginUser } = useApp() // ✅ context se user set karne ke liye
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
      toast.error("Password not matched ❌")
      return
    }

    const userData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password, // ✅ ab password bhi store hoga
    }

    // context update karega aur localStorage sync AppContext se ho jayega
    loginUser(userData)

    toast.success("Account created successfully 🎉")
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 sm:p-8 shadow-lg rounded-2xl w-full max-w-md">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 text-center">
          Create Your Account
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-[#1A2A49]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-[#1A2A49]"
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-[#1A2A49]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-[#1A2A49]"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-[#1A2A49]"
            required
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#1A2A49] text-white py-3 rounded-lg font-medium hover:bg-[#223a61] transition"
          >
            Sign Up
          </button>
        </form>

        {/* Bottom Link */}
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
