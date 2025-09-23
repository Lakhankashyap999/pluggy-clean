// src/pages/EditProfilePage.jsx
import { useApp } from "../AppContext"
import { useState } from "react"
import toast from "react-hot-toast"

export default function EditProfilePage() {
  const { user, setUser } = useApp()
  const [form, setForm] = useState({ name: user?.name, email: user?.email, phone: user?.phone })

  const save = () => {
    setUser({ ...user, ...form })
    toast.success("Profile updated ✅")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Edit Profile</h2>
      <input className="border w-full mb-2 px-3 py-2 rounded"
        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="border w-full mb-2 px-3 py-2 rounded"
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="border w-full mb-2 px-3 py-2 rounded"
        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <button onClick={save} className="px-4 py-2 bg-[#1A2A49] text-white rounded">Save</button>
    </div>
  )
}
