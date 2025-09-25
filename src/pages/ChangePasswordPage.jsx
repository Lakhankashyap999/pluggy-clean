// src/pages/ChangePasswordPage.jsx
import { useState } from "react"
import { useApp } from "../AppContext"
import { Lock } from "lucide-react"
import toast from "react-hot-toast"

export default function ChangePasswordPage() {
  const { user, setUser } = useApp()
  const [current, setCurrent] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirm, setConfirm] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in ❌")
      return
    }

    if (current !== user.password) {
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

    const updatedUser = { ...user, password: newPass }
    localStorage.setItem("pluggy_user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    toast.success("Password changed successfully 🎉")

    setCurrent("")
    setNewPass("")
    setConfirm("")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#1A2A49] mb-4">
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
            className="w-full bg-[#1A2A49] text-white py-2 rounded-lg hover:bg-[#223a61]"
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
