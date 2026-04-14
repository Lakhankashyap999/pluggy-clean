// src/components/account/ProfileStrengthMeter.jsx
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export default function ProfileStrengthMeter({ user }) {
  const calculateStrength = () => {
    let strength = 0
    if (user.name) strength += 25
    if (user.email) strength += 25
    if (user.phone) strength += 25
    if (user.email && user.phone) strength += 25
    return strength
  }

  const strength = calculateStrength()
  
  const getSuggestion = () => {
    if (!user.phone) return "Add phone number"
    if (!user.email) return "Add email address"
    if (strength < 100) return "Complete your profile"
    return "Profile complete! 🎉"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/80 text-sm">Profile Strength</span>
        <span className="text-white font-bold">{strength}%</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            strength === 100 ? "bg-green-400" : "bg-[#F37021]"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      {strength < 100 && (
        <p className="text-white/60 text-xs mt-2 flex items-center gap-1">
          <AlertCircle size={12} />
          {getSuggestion()} to improve
        </p>
      )}
    </div>
  )
}