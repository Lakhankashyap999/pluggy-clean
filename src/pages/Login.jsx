import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"

export default function Login({ setUser }) {
  const navigate = useNavigate()
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

    if (form.email === userData.email && form.password === "123") {
      setUser(userData) // ✅ update user state
      toast.success("Logged in successfully 🎉")
      navigate("/")
    } else {
      toast.error("Invalid credentials ❌ (use Signup first)")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-[#1A2A49]"
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
  )
}
