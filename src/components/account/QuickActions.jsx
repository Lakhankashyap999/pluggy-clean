// src/components/account/QuickActions.jsx
import { motion } from "framer-motion"
import { Edit3, MapPin, CreditCard, Shield, Bell } from "lucide-react"

export default function QuickActions({ navigate }) {
  const actions = [
    { icon: Edit3, label: "Edit", path: "/account/edit", color: "bg-blue-50 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
    { icon: MapPin, label: "Address", path: "/account/address", color: "bg-green-50 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400" },
    { icon: CreditCard, label: "Payment", path: "/account/payment", color: "bg-purple-50 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
    { icon: Shield, label: "Security", path: "/account/security", color: "bg-red-50 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400" },
    { icon: Bell, label: "Notif", path: "/account/notifications", color: "bg-orange-50 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400" },
  ]

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex justify-around">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
              <action.icon size={22} className={action.iconColor} />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}