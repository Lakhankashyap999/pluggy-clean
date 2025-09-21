import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Wrench, Fan, Plug, Zap } from "lucide-react"

const services = [
  { id: "ac-repair", title: "AC Services", desc: "Repair & Installation", icon: Wrench },
  { id: "fan-motor", title: "Fan & Motor", desc: "Ceiling & Exhaust Fans", icon: Fan },
  { id: "wiring", title: "Wiring", desc: "Switchboards & Circuits", icon: Plug },
  { id: "electrical", title: "Electrical", desc: "Appliances & Fittings", icon: Zap },
]

export default function OurServices() {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2A49] mb-8 sm:mb-12">
        Our Services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {services.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => navigate(`/services/${s.id}`)}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl flex flex-col items-center text-center"
          >
            <s.icon size={32} className="text-[#1A2A49]" />
            <h3 className="font-semibold mt-4 text-lg">{s.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
