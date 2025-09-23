// src/pages/ChangePasswordPage.jsx
import { useState } from "react"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function ChangePasswordPage() {
  const { user, setUser } = useApp()
  const [oldPass, setOldPass] = useState("")
  const [newPass, setNewPass] = useState("")

  const handleChange = () => {
    if (user.password !== oldPass) {
      toast.error("Old password is incorrect ❌")
      return
    }
    setUser({ ...user, password: newPass })
    toast.success("Password updated ✅")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Change Password</h2>
      <input type="password" placeholder="Old Password" className="border w-full mb-2 px-3 py-2 rounded"
        value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
      <input type="password" placeholder="New Password" className="border w-full mb-2 px-3 py-2 rounded"
        value={newPass} onChange={(e) => setNewPass(e.target.value)} />
      <button onClick={handleChange} className="px-4 py-2 bg-[#1A2A49] text-white rounded">
        Update Password
      </button>
    </div>
  )
}
