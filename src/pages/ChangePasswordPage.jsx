// src/pages/ChangePasswordPage.jsx
import { useState } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { Lock } from "lucide-react"
import toast from "react-hot-toast"
import BackButton from "../components/BackButton"

export default function ChangePasswordPage() {
  const { user, updateUser } = useApp()
  const navigate = useNavigate()
  const [current, setCurrent] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirm, setConfirm] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in ❌")
      return
    }

    if (user.password && current !== user.password) {
      toast.error("Current password is incorrect ❌")
      return
    }

    if (newPass.length < 6) {
      toast.error("Password must be at least 6 characters 🔑")
      return
    }

    if (newPass !== confirm) {
      toast.error("Passwords do not match ❌")
      return
    }

    updateUser({ password: newPass })
    toast.success("Password changed successfully 🎉")

    setCurrent("")
    setNewPass("")
    setConfirm("")
    navigate("/account")
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-[72px] md:pt-[112px] pb-28">
      <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6">
        <BackButton />
        <h2 className="text-xl font-bold text-[#1A2A49] mb-4 mt-2">
          Change Password
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Current password */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={18} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Current Password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="flex-1 outline-none text-sm"
              required
            />
          </div>

          {/* New password */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={18} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="flex-1 outline-none text-sm"
              required
            />
          </div>

          {/* Confirm password */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={18} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="flex-1 outline-none text-sm"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#1A2A49] text-white py-2.5 rounded-lg hover:bg-[#223a61] font-medium transition"
          >
            Update Password
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Tip: Use a strong password with a mix of letters, numbers & symbols.
        </p>
      </div>
    </div>
  )
}
