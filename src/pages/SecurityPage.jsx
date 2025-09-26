import { Shield, Mail, Phone, Lock, Laptop, Smartphone, AlertCircle } from "lucide-react"
import { useApp } from "../AppContext"
import BackButton from "../components/BackButton"

export default function SecurityPage() {
  const { user } = useApp()

  const devices = [
    {
      id: 1,
      type: "Desktop",
      browser: "Chrome on Windows 10",
      location: "Hapur, India",
      lastActive: "Today, 10:45 AM",
      icon: <Laptop size={20} className="text-[#1A2A49]" />,
    },
    {
      id: 2,
      type: "Mobile",
      browser: "Pluggy App on Android",
      location: "Delhi, India",
      lastActive: "Yesterday, 9:15 PM",
      icon: <Smartphone size={20} className="text-[#1A2A49]" />,
    },
  ]

  return (
    <div className="main-container max-w-3xl mx-auto px-4 py-6">
      <BackButton />
      <h2 className="text-xl font-bold text-[#1A2A49] mb-6 flex items-center gap-2">
        <Shield size={20} /> Login & Security
      </h2>

      {/* Last Login Info */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Last Login</h3>
        <p className="text-sm text-gray-600">
          📍 Location: <span className="font-medium">Hapur, India</span>
        </p>
        <p className="text-sm text-gray-600">
          ⏰ Time: <span className="font-medium">Today, 11:20 AM</span>
        </p>
      </div>

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

      {/* Active Devices */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
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
              <button className="text-xs text-red-600 hover:underline">
                Logout
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 2FA */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">
          Two-Factor Authentication (2FA)
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Add an extra layer of security to your account by enabling 2FA.
        </p>
        <button className="mt-2 text-sm px-4 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]">
          Enable 2FA
        </button>
      </div>

      {/* Security Tips */}
      <div className="bg-gray-50 border rounded-xl p-5 text-sm text-gray-600 flex items-start gap-2">
        <AlertCircle size={18} className="text-[#1A2A49] mt-0.5" />
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
