// src/components/OurServices.jsx
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { Wrench, Fan, Plug, Zap, ArrowLeft, Star } from "lucide-react"

export default function OurServices() {
  const navigate = useNavigate()
  const location = useLocation()

  const categories = [
    { id: "ac-repair", title: "AC Services", desc: "Repair & Installation", icon: Wrench, rating: 4.8, color: "from-cyan-500 to-blue-500" },
    { id: "fan-motor", title: "Fan & Motor", desc: "Ceiling & Exhaust Fans", icon: Fan, rating: 4.6, color: "from-green-500 to-emerald-500" },
    { id: "wiring", title: "Wiring", desc: "Switchboards • Circuits", icon: Plug, rating: 4.7, color: "from-yellow-500 to-orange-500" },
    { id: "electrical", title: "Electrical", desc: "Appliances & Fittings", icon: Zap, rating: 4.5, color: "from-purple-500 to-pink-500" },
  ]

  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const parts = location.pathname.split("/")
    const categoryFromPath = parts[parts.length - 1]
    if (categories.some((c) => c.id === categoryFromPath)) {
      setSelectedCategory(categoryFromPath)
    }
  }, [location.pathname])

  const subcategories = {
    "ac-repair": [
      { id: "split-ac", name: "Split AC", parent: "ac-repair" },
      { id: "window-ac", name: "Window AC", parent: "ac-repair" },
      { id: "inverter-ac", name: "Inverter AC", parent: "ac-repair" },
    ],
    "fan-motor": [
      { id: "ceiling-fan", name: "Ceiling Fan", parent: "fan-motor" },
      { id: "wall-fan", name: "Wall Fan", parent: "fan-motor" },
      { id: "exhaust-fan", name: "Exhaust Fan", parent: "fan-motor" },
    ],
    wiring: [
      { id: "switchboard", name: "Switchboard", parent: "wiring" },
      { id: "house-wiring", name: "House Wiring", parent: "wiring" },
      { id: "short-circuit", name: "Short Circuit", parent: "wiring" },
    ],
    electrical: [
      { id: "geyser", name: "Geyser Repair", parent: "electrical" },
      { id: "refrigerator", name: "Refrigerator", parent: "electrical" },
      { id: "washing-machine", name: "Washing Machine", parent: "electrical" },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto">
      {selectedCategory && (
        <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 mb-4 text-[#1A2A49] font-medium">
          <ArrowLeft size={18} /> Back to Categories
        </button>
      )}

      <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedCategory(cat.id)}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl p-4 sm:p-5 cursor-pointer border border-gray-100 group"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                  <cat.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-[#1A2A49] text-sm sm:text-base">{cat.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{cat.desc}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-gray-600">{cat.rating}</span>
                </div>
              </motion.div>
            ))
          ) : (
            subcategories[selectedCategory]?.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/services/${sub.parent}/${sub.id}`)}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg p-4 sm:p-5 cursor-pointer border border-gray-100"
              >
                <h3 className="font-medium text-[#1A2A49] text-sm sm:text-base">{sub.name}</h3>
                <p className="text-gray-500 text-xs mt-1">Click to view details</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}