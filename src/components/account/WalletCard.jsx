// src/components/account/WalletCard.jsx
import { motion } from "framer-motion"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react"

export default function WalletCard({ balance }) {
  const transactions = [
    { type: "credit", amount: 100, from: "Referral Bonus", date: "Today" },
    { type: "debit", amount: 50, from: "AC Repair", date: "Yesterday" },
  ]

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1A2A49] dark:text-white flex items-center gap-2">
          <Wallet size={18} className="text-[#F37021]" />
          Wallet Balance
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs bg-[#F37021] text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1"
        >
          <Plus size={12} /> Add
        </motion.button>
      </div>
      
      <p className="text-3xl font-bold text-[#1A2A49] dark:text-white mb-4">₹{balance}</p>
      
      <div className="space-y-2">
        {transactions.map((t, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                t.type === "credit" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              }`}>
                {t.type === "credit" ? (
                  <ArrowDownLeft size={14} className="text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowUpRight size={14} className="text-red-600 dark:text-red-400" />
                )}
              </div>
              <span className="text-gray-700 dark:text-gray-300">{t.from}</span>
            </div>
            <span className={`font-medium ${
              t.type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              {t.type === "credit" ? "+" : "-"}₹{t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}