// src/pages/SecurityPage.jsx
import { Shield, Mail, Phone, Lock } from "lucide-react"
import { useApp } from "../AppContext"

export default function SecurityPage() {
  const { user } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-6 flex items-center gap-2">
        <Shield size={20} /> Login & Security
      </h2>

      {/* Email */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
          <Mail size={16} /> Email
        </h3>
        <p className="text-sm text-gray-600">{user?.email || "Not set"}</p>
        <button className="mt-2 text-sm text-blue-600 hover:underline">
          Update Email
        </button>
      </div>

      {/* Phone */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
          <Phone size={16} /> Phone
        </h3>
        <p className="text-sm text-gray-600">{user?.phone || "Not set"}</p>
        <button className="mt-2 text-sm text-blue-600 hover:underline">
          Update Phone
        </button>
      </div>

      {/* Password */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
          <Lock size={16} /> Password
        </h3>
        <p className="text-sm text-gray-600">••••••••</p>
        <button className="mt-2 text-sm text-blue-600 hover:underline">
          Change Password
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Two-Factor Authentication (2FA)</h3>
        <p className="text-sm text-gray-600">
          Add an extra layer of security to your account.
        </p>
        <button className="mt-2 text-sm px-4 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]">
          Enable 2FA
        </button>
      </div>
    </div>
  )
}
