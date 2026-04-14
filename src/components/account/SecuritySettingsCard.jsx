// src/components/account/SecuritySettingsCard.jsx
import { motion } from "framer-motion"
import { Lock, Shield, Smartphone, History, ChevronRight } from "lucide-react"

export default function SecuritySettingsCard({ navigate }) {
  const settings = [
    { icon: Lock, label: "Change Password", path: "/account/password", color: "text-blue-600" },
    { icon: Shield, label: "Two-Factor Authentication", path: "/account/2fa", color: "text-green-600", badge: "Off" },
    { icon: Smartphone, label: "Trusted Devices", path: "/account/devices", color: "text-purple-600", badge: "2" },
    { icon: History, label: "Login History", path: "/account/login-history", color: "text-orange-600" },
  ]

  return (
    <div className="space-y-2">
      {settings.map((setting, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => navigate(setting.path)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <div className="flex items-center gap-3">
            <setting.icon size={18} className={setting.color} />
            <span className="text-sm font-medium text-[#1A2A49] dark:text-white">{setting.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {setting.badge && (
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                {setting.badge}
              </span>
            )}
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </motion.button>
      ))}
    </div>
  )
}