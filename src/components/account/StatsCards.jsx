// src/components/account/StatsCards.jsx
import { motion } from "framer-motion"
import { ShoppingCart, Package, CheckCircle, Star, TrendingUp } from "lucide-react"

export default function StatsCards({ cartCount, activeCount, completedCount, totalSaved }) {
  const stats = [
    { icon: ShoppingCart, value: cartCount, label: "In Cart", color: "from-blue-500 to-blue-600", darkColor: "from-blue-600 to-blue-700" },
    { icon: Package, value: activeCount, label: "Active", color: "from-orange-500 to-orange-600", darkColor: "from-orange-600 to-orange-700" },
    { icon: CheckCircle, value: completedCount, label: "Completed", color: "from-green-500 to-green-600", darkColor: "from-green-600 to-green-700" },
    { icon: TrendingUp, value: `₹${totalSaved}`, label: "Saved", color: "from-purple-500 to-purple-600", darkColor: "from-purple-600 to-purple-700" },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05 }}
          className={`bg-gradient-to-br ${stat.color} dark:${stat.darkColor} rounded-xl p-3 text-white shadow-lg cursor-pointer`}
        >
          <stat.icon size={20} className="mb-2 opacity-80" />
          <p className="text-xl font-bold">{stat.value}</p>
          <p className="text-xs opacity-80">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}