import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function Signup({ setUser }) {
  const navigate = useNavigate()
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
    }

    localStorage.setItem("pluggy_user", JSON.stringify(userData))
    setUser(userData) // ✅ update global state

    toast.success("Account created successfully 🎉")
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#1A2A49] mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61]"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}
