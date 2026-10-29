// src/components/account/SupportCard.jsx
import { motion } from "framer-motion"
import { HelpCircle, MessageCircle, FileText, Phone, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"

export default function SupportCard() {
  const supportOptions = [
    {
      icon: HelpCircle,
      label: "Help Center",
      desc: "FAQs and guides",
      color: "text-blue-600",
      action: () => toast("All services include a 30-day Pluggy warranty!", { icon: "💡" }),
    },
    {
      icon: MessageCircle,
      label: "Live Chat",
      desc: "Usually replies in 5 mins",
      color: "text-green-600",
      badge: "Online",
      action: () => toast.success("Connecting you to a Pluggy support agent..."),
    },
    {
      icon: FileText,
      label: "Raise a Ticket",
      desc: "support@pluggy.in",
      color: "text-purple-600",
      action: () => {
        window.location.href = "mailto:support@pluggy.in?subject=Pluggy%20Support%20Request"
      },
    },
    {
      icon: Phone,
      label: "Call Support",
      desc: "+91 98765 43210",
      color: "text-orange-600",
      action: () => {
        window.location.href = "tel:+919876543210"
      },
    },
  ]

  return (
    <div className="space-y-3">
      {supportOptions.map((option, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={option.action}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <option.icon size={20} className={option.color} />
            </div>
            <div>
              <p className="font-medium text-[#1A2A49] dark:text-white text-sm">{option.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {option.badge && (
              <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                {option.badge}
              </span>
            )}
            <ExternalLink size={14} className="text-gray-400" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
