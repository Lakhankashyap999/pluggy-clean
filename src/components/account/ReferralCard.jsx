// src/components/account/ReferralCard.jsx
import { motion } from "framer-motion"
import { Share2, Copy, Check, Gift } from "lucide-react"
import toast from "react-hot-toast"

export default function ReferralCard({ code = "PLUGGY100", copied, onCopy, earnings = 250, referrals = 3 }) {
  const handleShare = async () => {
    const shareText = `Use my referral code ${code} on Pluggy and get ₹100 off your first home service!`
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pluggy Referral", text: shareText })
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard?.writeText(shareText)
      toast.success("Referral message copied to clipboard!")
    }
  }

  return (
    <div className="bg-[#F5F5F7] dark:bg-[#1E293B] rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1A2A49] dark:text-white flex items-center gap-2">
          <Gift size={18} className="text-[#F37021]" />
          Refer & Earn
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="text-xs bg-[#1A2A49] dark:bg-[#0F172A] text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1"
        >
          <Share2 size={12} /> Share
        </motion.button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Referral Code</p>
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-[#1A2A49] dark:text-white text-lg">{code}</span>
          <button
            onClick={onCopy}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
          </button>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Total Earnings</p>
          <p className="font-bold text-[#1A2A49] dark:text-white">₹{earnings}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 dark:text-gray-400">Successful Referrals</p>
          <p className="font-bold text-[#1A2A49] dark:text-white">{referrals}</p>
        </div>
      </div>
    </div>
  )
}
