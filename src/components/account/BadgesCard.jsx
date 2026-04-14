// src/components/account/BadgesCard.jsx
import { motion } from "framer-motion"
import { Award, Star, Zap, Crown, TrendingUp } from "lucide-react"

export default function BadgesCard({ completedCount }) {
  const badges = [
    { name: "First Booking", earned: completedCount >= 1, icon: Star, color: "text-yellow-500" },
    { name: "5 Services", earned: completedCount >= 5, icon: Zap, color: "text-blue-500" },
    { name: "10 Services", earned: completedCount >= 10, icon: Award, color: "text-purple-500" },
    { name: "Premium", earned: completedCount >= 20, icon: Crown, color: "text-amber-500" },
  ]

  const earnedCount = badges.filter(b => b.earned).length
  const nextTier = badges.find(b => !b.earned)
  const progress = (completedCount / 5) * 100 // For 5 services tier

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1A2A49] dark:text-white flex items-center gap-2">
          <Award size={18} className="text-[#F37021]" />
          Loyalty Badges
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">{earnedCount}/{badges.length} Earned</span>
      </div>
      
      <div className="flex gap-3 mb-4">
        {badges.map((badge, i) => {
          const Icon = badge.icon
          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center ${
                badge.earned 
                  ? "bg-gradient-to-br from-[#1A2A49]/10 to-[#223a61]/10 dark:from-[#F37021]/20 dark:to-[#FF8C42]/20" 
                  : "bg-gray-100 dark:bg-gray-800/50 opacity-50"
              }`}
            >
              <Icon size={24} className={badge.earned ? badge.color : "text-gray-400"} />
              <span className="text-[10px] font-medium text-center mt-1 dark:text-gray-400">{badge.name}</span>
            </motion.div>
          )
        })}
      </div>
      
      {nextTier && (
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">
              {5 - completedCount} more to {nextTier.name}
            </span>
            <span className="font-medium text-[#1A2A49] dark:text-white">{completedCount}/5</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#F37021] to-[#FF8C42] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}