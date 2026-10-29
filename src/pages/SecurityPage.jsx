// src/pages/SecurityPage.jsx
import { useState } from "react"
import { Shield, Mail, Phone, Lock, Laptop, Smartphone, AlertCircle, CheckCircle2 } from "lucide-react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import BackButton from "../components/BackButton"
import toast from "react-hot-toast"

export default function SecurityPage() {
  const { user, city } = useApp()
  const navigate = useNavigate()

  const [twoFA, setTwoFA] = useState(() => localStorage.getItem("pluggy_2fa") === "true")
  const [devices, setDevices] = useState([
    {
      id: 1,
      type: "Desktop (Current Session)",
      browser: "Chrome on Windows",
      location: `${city || "Delhi"}, India`,
      lastActive: "Active now",
      current: true,
      icon: <Laptop size={20} className="text-[#1A2A49]" />,
    },
    {
      id: 2,
      type: "Mobile",
      browser: "Pluggy App on Android",
      location: "Delhi, India",
      lastActive: "Yesterday, 9:15 PM",
      current: false,
      icon: <Smartphone size={20} className="text-[#1A2A49]" />,
    },
  ])

  const handleToggle2FA = () => {
    const next = !twoFA
    setTwoFA(next)
    localStorage.setItem("pluggy_2fa", String(next))
    toast.success(next ? "Two-Factor Authentication enabled!" : "Two-Factor Authentication disabled")
  }

  const handleRemoveDevice = (id) => {
    setDevices((prev) => prev.filter((d) => d.id !== id))
    toast.success("Device logged out successfully")
  }

  return (
    <div className="main-container max-w-3xl mx-auto px-4 py-6">
      <BackButton />
      <h2 className="text-xl font-bold text-[#1A2A49] mb-6 mt-2 flex items-center gap-2">
        <Shield size={20} className="text-[#F37021]" /> Login & Security
      </h2>

      {/* Last Login Info */}
      <div className="bg-white shadow-sm border rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Last Login</h3>
        <p className="text-sm text-gray-600">
          📍 Location: <span className="font-medium">{city || "Hapur"}, India</span>
        </p>
        <p className="text-sm text-gray-600">
          ⏰ Time: <span className="font-medium">Today</span>
        </p>
      </div>

      {/* Email */}
      <div className="bg-white shadow-sm border rounded-xl p-4 mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <Mail size={16} /> Email
          </h3>
          <p className="text-sm text-gray-600">{user?.email || "Not set"}</p>
        </div>
        <button
          onClick={() => navigate("/account/edit")}
          className="text-sm text-[#F37021] font-medium hover:underline"
        >
          Update Email
        </button>
      </div>

      {/* Phone */}
      <div className="bg-white shadow-sm border rounded-xl p-4 mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <Phone size={16} /> Phone
          </h3>
          <p className="text-sm text-gray-600">{user?.phone || "Not set"}</p>
        </div>
        <button
          onClick={() => navigate("/account/edit")}
          className="text-sm text-[#F37021] font-medium hover:underline"
        >
          Update Phone
        </button>
      </div>

      {/* Password */}
      <div className="bg-white shadow-sm border rounded-xl p-4 mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <Lock size={16} /> Password
          </h3>
          <p className="text-sm text-gray-600">••••••••</p>
        </div>
        <button
          onClick={() => navigate("/account/password")}
          className="text-sm text-[#F37021] font-medium hover:underline"
        >
          Change Password
        </button>
      </div>

      {/* Active Devices */}
      <div className="bg-white shadow-sm border rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Active Devices</h3>
        <ul className="space-y-3">
          {devices.map((d) => (
            <li
              key={d.id}
              className="flex items-start justify-between border rounded-lg p-3"
            >
              <div className="flex gap-3">
                {d.icon}
                <div>
                  <p className="font-medium text-gray-800">{d.type}</p>
                  <p className="text-sm text-gray-600">{d.browser}</p>
                  <p className="text-xs text-gray-400">
                    {d.location} • {d.lastActive}
                  </p>
                </div>
              </div>
              {!d.current ? (
                <button
                  onClick={() => handleRemoveDevice(d.id)}
                  className="text-xs text-red-600 font-medium hover:underline"
                >
                  Logout
                </button>
              ) : (
                <span className="text-xs text-green-600 font-medium">Current</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 2FA */}
      <div className="bg-white shadow-sm border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700">
            Two-Factor Authentication (2FA)
          </h3>
          {twoFA && (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={12} /> Enabled
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Add an extra layer of security to your account by enabling 2FA.
        </p>
        <button
          onClick={handleToggle2FA}
          className={`mt-1 text-sm px-4 py-2 rounded-lg font-medium transition ${
            twoFA
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-[#1A2A49] text-white hover:bg-[#223a61]"
          }`}
        >
          {twoFA ? "Disable 2FA" : "Enable 2FA"}
        </button>
      </div>

      {/* Security Tips */}
      <div className="bg-gray-50 border rounded-xl p-5 text-sm text-gray-600 flex items-start gap-2">
        <AlertCircle size={18} className="text-[#1A2A49] mt-0.5 flex-shrink-0" />
        <ul className="list-disc list-inside space-y-1">
          <li>Use a unique password for your Pluggy account.</li>
          <li>Enable 2FA to prevent unauthorized access.</li>
          <li>Review your active devices regularly.</li>
          <li>Beware of phishing emails & fake links.</li>
        </ul>
      </div>
    </div>
  )
}
