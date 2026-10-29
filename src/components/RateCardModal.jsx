// src/components/RateCardModal.jsx
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShieldCheck, CheckCircle2, FileText, Sparkles } from "lucide-react"
import { SPARE_PARTS_RATE_CARD, CATEGORIES_CATALOG } from "../data/servicesCatalog"

export default function RateCardModal({ open, onClose, initialCategory = "ac-repair" }) {
  const [activeCat, setActiveCat] = useState(
    SPARE_PARTS_RATE_CARD[initialCategory] ? initialCategory : "ac-repair"
  )

  if (!open) return null

  const categoriesWithRates = CATEGORIES_CATALOG.filter((c) => SPARE_PARTS_RATE_CARD[c.slug])
  const parts = SPARE_PARTS_RATE_CARD[activeCat] || SPARE_PARTS_RATE_CARD["ac-repair"]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F37021] flex items-center justify-center shadow-lg">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold font-poppins">
                      Official Spare Parts Rate Card
                    </h3>
                    <span className="bg-white/15 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                      100% Fixed Price
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                    Zero overcharging — Engineer can only add parts approved by you on your phone
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="bg-[#F4F6F9] px-4 py-3 border-b border-gray-200 flex gap-2 overflow-x-auto scrollbar-hide">
              {categoriesWithRates.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCat(cat.slug)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    activeCat === cat.slug
                      ? "bg-[#1A2A49] text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.shortName}</span>
                </button>
              ))}
            </div>

            {/* Rate Table */}
            <div className="p-5 sm:p-6 max-h-[55vh] overflow-y-auto space-y-3">
              {parts.map((part, i) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F6F9]/70 hover:bg-[#F4F6F9] border border-gray-200/80 transition"
                >
                  <div className="pr-3">
                    <h4 className="font-semibold text-[#1A2A49] text-sm sm:text-base">
                      {part.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 font-medium text-gray-700">
                        Brand: {part.brand}
                      </span>
                      <span className="text-green-700 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> {part.warranty} Warranty
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-extrabold text-[#F37021]">₹{part.price}</span>
                    <span className="block text-[10px] text-gray-400">Incl. GST</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Assurance */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
                <span>
                  Every spare part comes with digital warranty & must be approved in your app before billing.
                </span>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#1A2A49] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#223a61] transition"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
