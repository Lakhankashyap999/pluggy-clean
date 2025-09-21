import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPopup({ onLogin }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const user = {
      name: form.name || "Guest User",
      email: form.email || "guest@example.com",
      phone: form.phone || "0000000000",
    }

    // ✅ save user
    localStorage.setItem("pluggy_user", JSON.stringify(user))
    if (onLogin) onLogin(user)

    setOpen(false)

    // ✅ redirect home page
    navigate("/")
  }

  return (
    <div className="relative">
      {/* Open Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#1A2A49]"
      >
        Login
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-end p-4 z-50">
          <div className="bg-white w-[350px] rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-[#1A2A49] mb-4">Log in</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
              <button
                type="submit"
                className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61]"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
