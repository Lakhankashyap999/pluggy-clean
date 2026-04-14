// src/components/account/PaymentMethodsCard.jsx
import { motion } from "framer-motion"
import { CreditCard, Smartphone, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export default function PaymentMethodsCard() {
  const [methods, setMethods] = useState([
    { id: 1, type: "upi", name: "Google Pay", detail: "rajesh@okhdfcbank", isDefault: true },
    { id: 2, type: "card", name: "HDFC Credit Card", detail: "**** **** **** 4242", isDefault: false },
  ])

  return (
    <div className="space-y-3">
      {methods.map((method, i) => (
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center">
              {method.type === "upi" ? (
                <Smartphone size={20} className="text-green-600" />
              ) : (
                <CreditCard size={20} className="text-blue-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-[#1A2A49] dark:text-white text-sm">{method.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{method.detail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {method.isDefault && (
              <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Default</span>
            )}
            <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </motion.div>
      ))}
      
      <motion.button
        whileHover={{ scale: 1.01 }}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 font-medium text-sm flex items-center justify-center gap-2 hover:border-[#F37021] hover:text-[#F37021] transition"
      >
        <Plus size={16} /> Add Payment Method
      </motion.button>
    </div>
  )
}