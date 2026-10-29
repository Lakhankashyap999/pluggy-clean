// src/components/account/WalletCard.jsx
import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useApp } from "../../AppContext"
import toast from "react-hot-toast"

export default function WalletCard({ balance }) {
  const { walletBalance, walletTransactions, addWalletMoney } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState("")

  const displayBalance = balance !== undefined ? balance : walletBalance
  const transactions = walletTransactions || [
    { type: "credit", amount: 100, from: "Referral Bonus", date: "Today" },
    { type: "debit", amount: 50, from: "AC Repair", date: "Yesterday" },
  ]

  const handleAddMoney = (e) => {
    e.preventDefault()
    const num = Number(amount)
    if (!num || num <= 0) {
      toast.error("Enter a valid amount")
      return
    }
    addWalletMoney(num, "Wallet Top-up")
    toast.success(`₹${num} added to Pluggy Wallet!`)
    setAmount("")
    setShowAdd(false)
  }

  return (
    <div className="bg-[#F5F5F7] dark:bg-[#1E293B] rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1A2A49] dark:text-white flex items-center gap-2">
          <Wallet size={18} className="text-[#F37021]" />
          Wallet Balance
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs bg-[#F37021] text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1"
        >
          <Plus size={12} /> {showAdd ? "Cancel" : "Add"}
        </motion.button>
      </div>

      <p className="text-3xl font-bold text-[#1A2A49] dark:text-white mb-4">₹{displayBalance}</p>

      {showAdd && (
        <form onSubmit={handleAddMoney} className="mb-4 flex gap-2">
          <input
            type="number"
            placeholder="Amount (e.g. 200)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1A2A49] text-white text-xs font-semibold rounded-xl"
          >
            Top Up
          </button>
        </form>
      )}

      <div className="space-y-2">
        {transactions.slice(0, 4).map((t, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  t.type === "credit"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                {t.type === "credit" ? (
                  <ArrowDownLeft size={14} className="text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowUpRight size={14} className="text-red-600 dark:text-red-400" />
                )}
              </div>
              <span className="text-gray-700 dark:text-gray-300">{t.from}</span>
            </div>
            <span
              className={`font-medium ${
                t.type === "credit"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {t.type === "credit" ? "+" : "-"}₹{t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
