// src/components/account/ActivityTimeline.jsx
import { motion } from "framer-motion"
import { Package, MapPin, User, CreditCard, Bell } from "lucide-react"

export default function ActivityTimeline({ notifications, bookings }) {
  // Combine and sort activities
  const activities = [
    ...notifications.slice(0, 5).map(n => ({
      type: n.type,
      title: n.title,
      message: n.message,
      time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : "Just now",
      icon: Bell
    })),
    ...bookings.slice(0, 3).map(b => ({
      type: "booking",
      title: `Booking ${b.status}`,
      message: `${b.service} - ${b.date || "Today"}`,
      time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString() : "Today",
      icon: Package
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent activity</p>
      ) : (
        activities.map((activity, i) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Icon size={14} className="text-[#1A2A49] dark:text-[#F37021]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1A2A49] dark:text-white">{activity.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.message}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </motion.div>
          )
        })
      )}
    </div>
  )
}