import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { Wrench, Fan, Plug, Zap, ArrowLeft } from "lucide-react"

export default function OurServices() {
  const navigate = useNavigate()
  const location = useLocation()

  // ⭐ Correct category IDs (match ServiceDetail.jsx)
  const categories = [
    { id: "ac-repair", title: "AC Services", desc: "Repair & Installation", icon: Wrench },
    { id: "fan-motor", title: "Fan & Motor", desc: "Ceiling & Exhaust Fans", icon: Fan },
    { id: "wiring", title: "Wiring", desc: "Switchboards • Circuits", icon: Plug },
    { id: "electrical", title: "Electrical", desc: "Appliances & Fittings", icon: Zap },
  ]

  // ⭐ ServiceDetail compatible subcategory ids
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

  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const parts = location.pathname.split("/")
    const categoryFromPath = parts[parts.length - 1]
    if (categories.some((c) => c.id === categoryFromPath)) {
      setSelectedCategory(categoryFromPath)
    }
  }, [location.pathname])

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  // ⭐ Correct navigation for ServiceDetail.jsx route
  const handleSubClick = (sub) => {
    navigate(`/services/${sub.parent}/${sub.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 mb-6 text-[#1A2A49] font-medium hover:text-[#223a61]"
        >
          <ArrowLeft size={18} />
          Back to Categories
        </button>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            categories.map((cat, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -6, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 220 }}
                onClick={() => setSelectedCategory(cat.id)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 cursor-pointer flex flex-col items-center text-center border border-gray-100"
              >
                <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#1A2A49]/10 mb-4">
                  <cat.icon size={28} className="text-[#1A2A49]" />
                </div>
                <h3 className="font-semibold text-lg text-[#1A2A49]">
                  {cat.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{cat.desc}</p>
              </motion.div>
            ))
          ) : (
            subcategories[selectedCategory]?.map((sub, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleSubClick(sub)}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 cursor-pointer flex flex-col justify-center items-center text-center border border-gray-100"
              >
                <h3 className="font-medium text-[#1A2A49] text-base">
                  {sub.name}
                </h3>
                <p className="text-gray-500 text-xs mt-1">Click to view details</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
