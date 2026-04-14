// src/components/account/NotificationPreferences.jsx
import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Mail, Smartphone, MessageCircle } from "lucide-react"

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    push: true,
    email: true,
    sms: false,
    whatsapp: true,
  })

  const channels = [
    { id: "push", label: "Push Notifications", icon: Bell, color: "text-blue-600" },
    { id: "email", label: "Email Updates", icon: Mail, color: "text-green-600" },
    { id: "sms", label: "SMS Alerts", icon: Smartphone, color: "text-orange-600" },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-emerald-600" },
  ]

  return (
    <div className="space-y-3">
      {channels.map((channel, i) => {
        const Icon = channel.icon
        return (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className={channel.color} />
              <span className="text-sm font-medium text-[#1A2A49] dark:text-white">{channel.label}</span>
            </div>
            <button
              onClick={() => setPreferences(prev => ({ ...prev, [channel.id]: !prev[channel.id] }))}
              className={`relative w-11 h-6 rounded-full transition ${
                preferences[channel.id] ? "bg-[#F37021]" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: preferences[channel.id] ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}