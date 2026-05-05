// src/components/account/PaymentMethodsCard.jsx
import { motion } from "framer-motion"
import { CreditCard, Smartphone, Plus, Trash2, Shield } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

export default function PaymentMethodsCard() {
  const [methods, setMethods] = useState([
    { id: 1, type: "upi", name: "Google Pay", detail: "rajesh@okhdfcbank", isDefault: true, color: "bg-green-50" },
    { id: 2, type: "card", name: "HDFC Credit Card", detail: "**** **** **** 4242", isDefault: false, color: "bg-blue-50" },
  ])

  const handleDelete = (id) => {
    if (window.confirm("Remove this payment method?")) {
      setMethods(prev => prev.filter(m => m.id !== id))
      toast.success("Payment method removed")
    }
  }

  const handleSetDefault = (id) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })))
    toast.success("Default updated")
  }

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center`}>
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
              <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
            {!method.isDefault && (
              <button onClick={() => handleSetDefault(method.id)} className="text-xs text-[#F37021] hover:underline">
                Set Default
              </button>
            )}
            <button onClick={() => handleDelete(method.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </motion.div>
      ))}
      
      {/* Add Method Button */}
      <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 font-medium text-sm flex items-center justify-center gap-2 hover:border-[#F37021] hover:text-[#F37021] transition">
        <Plus size={16} /> Add Payment Method
      </button>
      
      {/* Security Note */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
        <Shield size={12} className="text-green-600" />
        <span>Your payment info is encrypted and secure</span>
      </div>
    </div>
  )
}