import { X, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function AuthRequiredPopup({ onClose }) {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      {/* Card with animation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-full bg-[#1A2A49]/10 flex items-center justify-center">
            <Lock size={28} className="text-[#1A2A49]" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-lg sm:text-xl font-bold text-center text-[#1A2A49]">
          Login Required
        </h2>
        <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">
          Please login or signup first to raise a service request.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => navigate("/login")}
            className="flex-1 bg-[#1A2A49] text-white py-2 rounded-lg hover:bg-[#223a61] transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Signup
          </button>
        </div>
      </motion.div>
    </div>
  )
}
