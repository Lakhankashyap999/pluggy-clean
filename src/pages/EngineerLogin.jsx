import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../AppContext"

export default function EngineerLogin() {
  const { loginEngineer } = useApp()
  const [form, setForm] = useState({ email: "", password: "" })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // demo: simple auth
    if (form.email && form.password) {
      loginEngineer({ name: "Engineer", email: form.email })
      navigate("/engineer")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 text-center">
          Engineer Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-3 text-sm"
            placeholder="Engineer Email"
            value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})}
            required
          />
          <input
            className="w-full border rounded-lg px-4 py-3 text-sm"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})}
            required
          />
          <button className="w-full bg-[#1A2A49] text-white py-3 rounded-lg font-medium hover:bg-[#223a61]">
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}
