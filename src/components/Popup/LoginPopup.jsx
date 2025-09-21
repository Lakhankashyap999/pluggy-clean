import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

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
    navigate("/")
  }

  return (
    <div className="relative">
      {/* Open Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm font-medium text-gray-100 hover:text-gray-300"
      >
        Login
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-xl font-bold text-[#1A2A49]">Log in</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Form */}
              <form
                className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"
                />

                <button
                  type="submit"
                  className="w-full bg-[#1A2A49] text-white py-2 rounded-md hover:bg-[#223a61] transition"
                >
                  Log in
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
