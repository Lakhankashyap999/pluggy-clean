import { useState } from "react"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"
import { User, Mail, Phone } from "lucide-react"
import BackButton from "../components/BackButton"

export default function EditProfilePage() {
  const { user, setUser } = useApp()
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      toast.error("Name and Email are required ❌")
      return
    }
    const updated = { ...user, ...form }
    localStorage.setItem("pluggy_user", JSON.stringify(updated))
    setUser(updated)
    toast.success("Profile updated successfully ✅")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <BackButton />
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-[#1A2A49] text-white flex items-center justify-center text-2xl font-bold">
            {form.name ? form.name.charAt(0).toUpperCase() : <User size={28} />}
          </div>
          <h2 className="text-xl font-bold text-[#1A2A49] mt-3">
            Edit Profile
          </h2>
          <p className="text-sm text-gray-500">
            Update your personal information below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#1A2A49]">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="flex-1 outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#1A2A49]">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="flex-1 outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#1A2A49]">
              <Phone size={18} className="text-gray-400 mr-2" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A2A49] text-white py-2.5 rounded-lg font-medium hover:bg-[#223a61] transition shadow-sm"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
